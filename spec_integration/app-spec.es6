import {N1Launcher} from './integration-helper'

describe('Nylas Bootup Tests', function() {
  beforeAll((done)=>{
    // Boot in prod mode with no arguments
    console.log("BEFORE ALL");
    this.app = new N1Launcher([]);
    this.app.start().then(()=>{
      console.log("App started");
      N1Launcher.waitUntilMainWindowLoaded(this.app.client)
      .then((mainWindowId)=>{
        console.log(`WINDOW LOADED. Main window is ${mainWindowId}`);
        this.app.client.window(mainWindowId).then(done)
      }).finally(()=>{
        console.log("FINALLY");
        done()
      })
    });
  });

  afterAll((done)=> {
    console.log("AFTER EACH");
    if (this.app && this.app.isRunning()) {
      this.app.stop().then(done);
    } else {
      done()
    }
  });

  it('Boots up the main window', (done)=> {
    console.log("IN TEST. Getting window count");
    this.app.client.windowHandles()
    .then((windows)=>{console.log(windows)})
    .finally(done)
  });

  it("the main window is visible", (done)=> {
    this.app.client.isWindowVisible()
    .then((result)=>{ expect(result).toBe(true) })
    .finally(done)
  });

  it("the main window is focused", (done)=> {
    this.app.client.isWindowFocused()
    .then((result)=>{ expect(result).toBe(true) })
    .finally(done)
  });

  it("isn't minimized", (done)=> {
    this.app.client.isWindowMinimized()
    .then((result)=>{ expect(result).toBe(false) })
    .finally(done)
  });

  it("doesn't have the dev tools open", (done)=> {
    this.app.client.isWindowDevToolsOpened()
    .then((result)=>{ expect(result).toBe(false) })
    .finally(done)
  });

  it("has width", (done)=> {
    this.app.client.getWindowWidth()
    .then((result)=>{ expect(result).toBeGreaterThan(0) })
    .finally(done)
  });

  it("has height", (done)=> {
    this.app.client.getWindowHeight()
    .then((result)=>{ expect(result).toBeGreaterThan(0) })
    .finally(done)
  });

  // it('Boots up the main window', (done)=> {
  //   console.log("IN TEST");
  //   this.app.client.isWindowMinimized()
  //   .then((result)=>{ expect(result).toBe(false) })
  //   .then(this.app.client.isWindowDevToolsOpened)
  //   .then((result)=>{ expect(result).toBe(false) })
  //   .then(this.app.client.isWindowVisible)
  //   .then((result)=>{ expect(result).toBe(true) })
  //   .then(this.app.client.isWindowFocused)
  //   .then((result)=>{ expect(result).toBe(true) })
  //   .then(this.app.client.getWindowWidth)
  //   .then((result)=>{ expect(result).toBeGreaterThan(0) })
  //   .then(this.app.client.getWindowHeight)
  //   .then((result)=>{ expect(result).toBeGreaterThan(0) })
  //   .finally(done)
  // });
});
