import {N1Launcher} from './integration-helper'

// Some unit tests, such as the Contenteditable specs need to be run with
// Spectron availble in the environment.
describe('Integrated Unit Tests', function() {
  beforeAll((done)=>{
    // Boot in dev mode with no arguments
    this.app = new N1Launcher(["--test=integration"]);
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
    client.waitForExist("#test-results", jasmine.UNIT_TEST_TIMEOUT)
    .then(()=>{ return client.getHTML("#test-results") })
    .then((results)=>{
      expect(results).toMatch("passed")
      done()
    }).catch(done)
  });

});
