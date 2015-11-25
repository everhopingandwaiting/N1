import {N1Launcher} from './integration-helper'

// Some unit tests, such as the Contenteditable specs need to be run with
// Spectron availble in the environment.
describe('Integrated Unit Tests', function() {
  beforeAll((done)=>{
    // Boot in dev mode with no arguments
    this.app = new N1Launcher(["--test=window"]);
    this.app.start().then(done).catch(done)
  });

  afterAll((done)=> {
    if (this.app && this.app.isRunning()) {
      this.app.stop().then(done);
    } else {
      done()
    }
  });

  it("Passes all integrated unit tests", (done)=> {
    var client = this.app.client
    console.log("Waiting for specs-complete to appear")
    client.waitForExist(".specs-complete", jasmine.UNIT_TEST_TIMEOUT)
    .then(()=>{ return client.getHTML(".specs-complete .message") })
    .then((results)=>{
      console.log("DONE")
      expect(results).toMatch(/0 failures/)
      done()
    }).catch(done)
  });

});
