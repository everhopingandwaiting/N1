import path from 'path'
import Promise from 'bluebird'
import {Application} from 'spectron';

class N1Launcher extends Application {
  constructor(launchArgs = []) {
    super({
      path: N1Launcher.electronPath(),
      args: [jasmine.NYLAS_ROOT_PATH].concat(N1Launcher.defaultNylasArgs()).concat(launchArgs)
    })
  }

  static defaultNylasArgs() {
    return ["--enable-logging", `--resource-path=${jasmine.NYLAS_ROOT_PATH}`]
  }

  static electronPath() {
    nylasRoot = jasmine.NYLAS_ROOT_PATH
    if (process.platform === "darwin") {
      return path.join(nylasRoot, "electron", "Electron.app", "Contents", "MacOS", "Electron")
    } else if (process.platform === "win32") {
      return path.join(nylasRoot, "electron", "electron.exe")
    }
    else if (process.platform === "linux") {
      return path.join(nylasRoot, "electron", "electron")
    }
    else {
      throw new Error(`Platform ${process.platform} is not supported`)
    }
  }

  // We unfortunatley can't just Spectron's `waitUntilWindowLoaded` because
  // the first window that loads isn't necessarily the main render window (it
  // could be the work window or others), and once the window is "loaded"
  // it'll take a while for packages to load, etc. As such we periodically
  // poll the list of windows to find one that looks like the main loaded
  // window.
  //
  // Returns a promise that resolves with the main window's ID once it's
  // loaded.
  static waitUntilMainWindowLoaded(client, lastCheck=0) {
    console.log("Checking for main window loaded");
    var CHECK_EVERY = 1000
    return new Promise((resolve, reject) => {
      client.windowHandles().then(({value}) => {
        console.log("Found windows:");
        console.log(value);
        return Promise.mapSeries(value, (windowId)=>{
          return N1Launcher.switchAndCheckForMain(client, windowId)
        })
      }).then((mainChecks)=>{
        console.log(mainChecks);
        for (mainWindowId of mainChecks) {
          if (mainWindowId) {return resolve(mainWindowId)}
        }

        var now = Date.now();
        var delay = Math.max(CHECK_EVERY - (now - lastCheck), 0)
        setTimeout(()=>{
          N1Launcher.waitUntilMainWindowLoaded(client, now).then(resolve)
        }, delay)
      }).catch((err) => {
        console.log("Catching rejection");
        console.log(err);
      });
    });
  }

  // Returns false or the window ID of the main window
  static switchAndCheckForMain(client, windowId) {
    console.log(`Switching to ${windowId}`);
    return client.window(windowId).then(()=>{
      console.log(`Checking for nylas-workspace in ${windowId}`);
      return client.isExisting(".main-window-loaded").then((exists)=>{
        if (exists) {return windowId} else {return false}
      })
    })
  }
}

module.exports = {N1Launcher}
