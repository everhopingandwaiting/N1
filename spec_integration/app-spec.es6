import {N1Launcher} from './integration-helper'

describe('Nylas Bootup Tests', function() {
  beforeAll((done)=>{
    // Boot in prod mode with no arguments
    console.log("BEFORE ALL");
    this.app = new N1Launcher([]);
    this.app.start().then(()=>{
      console.log("App started");
      N1Launcher.waitUntilMainWindowLoaded(this.app.client).then(()=>{
        console.log("WINDOW LOADED");
        done()
      }).finally(()=>{
        console.log("FINALLY");
        done()
      })
    });
  });

  afterEach((done)=> {
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

  // it('Boots up the main window', (done)=> {
  //   console.log("IN TEST. Getting window count");
  //   this.app.client.getWindowCount()
  //   .then((count)=>{ expect(count).toBe(4) })
  //   .finally(done)
  // });

    // .then(client.isWindowMinimized)
    // .then((result)=>{ expect(result).toBe(false) })
    // .then(client.isWindowDevToolsOpened)
    // .then((result)=>{ expect(result).toBe(false) })
    // .then(client.isWindowVisible)
    // .then((result)=>{ expect(result).toBe(true) })
    // .then(client.isWindowFocused)
    // .then((result)=>{ expect(result).toBe(true) })
    // .then(client.getWindowWidth)
    // .then((result)=>{ expect(result).toBeGreaterThan(0) })
    // .then(client.getWindowHeight)
    // .then((result)=>{ expect(result).toBeGreaterThan(0) })
    // .then(done)
    // .catch(done)
    //
});
