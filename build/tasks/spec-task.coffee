fs = require 'fs'
path = require 'path'
request = require 'request'
childProcess = require 'child_process'

executeTests = ({cmd, args}, grunt, done) ->
  testProc = childProcess.spawn(cmd, args)

  testOutput = ""
  testProc.stdout.pipe(process.stdout)
  testProc.stderr.pipe(process.stderr)
  testProc.stdout.on 'data', (data) -> testOutput += data.toString()
  testProc.stderr.on 'data', (data) -> testOutput += data.toString()

  testProc.on 'error', (err) -> grunt.log.error("Process error: #{err}")

  testProc.on 'exit', (exitCode, signal) ->
    if exitCode is 0 then done()
    else notifyOfTestError(testOutput, grunt).then -> done(false)

notifyOfTestError = (testOutput, grunt) -> new Promise (resolve, reject) ->
  if (process.env("TEST_ERROR_HOOK_URL") ? "").length > 0
    testOutput = grunt.log.uncolor(testOutput)
    request.post
      url: process.env("TEST_ERROR_HOOK_URL")
      json:
        username: "Edgehill Builds"
        text: "Aghhh somebody broke the build. ```#{testOutput}```"
    , resolve
  else resolve()

module.exports = (grunt) ->

  grunt.registerTask 'run-spectron-specs', 'Run spectron specs', ->
    electronLauncher = path.resolve("./electron/Electron.app/Contents/MacOS/Electron")
    nylasRoot = path.resolve('.')
    electronArgs = [nylasRoot]
    buildDir = grunt.config.get('nylasGruntConfig.buildDir')
    nylasArgs = ["--test=window", "--enable-logging", "--resource-path=#{nylasRoot}"]

    done = @async()
    npm = path.resolve "./build/node_modules/.bin/npm"
    grunt.log.writeln 'App exists: ' + fs.existsSync(electronLauncher)

    process.chdir('./spectron')
    grunt.log.writeln "Current dir: #{process.cwd()}"
    installProc = childProcess.exec "#{npm} install", (error) ->
      if error?
        process.chdir('..')
        grunt.log.error('Failed while running npm install in spectron folder')
        grunt.fail.warn(error)
        done(false)
      else
        npmArgs = [
          'test'
          "ELECTRON_LAUNCHER=#{electronLauncher}"
          "ELECTRON_ARGS=#{electronArgs.join(',')}"
          "NYLAS_ARGS=#{nylasArgs.join(',')}"
        ]
        executeTests cmd: npm, args: npmArgs, grunt, (succeeded) ->
          process.chdir('..')
          done(succeeded)

  grunt.registerTask 'run-edgehill-specs', 'Run the specs', ->
    done = @async()
    executeTests cmd: './N1.sh', args: ['--test'], grunt, done
