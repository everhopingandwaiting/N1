import {Application} from 'spectron';

describe('Nylas Unit Tests', ()=> {
  beforeAll((done)=>{
    this.app = new Application({
      path: jasmine.ELECTRON_LAUNCHER,
      args: jasmine.ELECTRON_ARGS.concat(jasmine.NYLAS_ARGS)
    });
    this.app.start().then(()=> {
      client = this.app.client
      client.waitForExist(".spec-reporter", jasmine.BOOT_WAIT).then(=> {
        done()
      })
    });
  });

  it("doesn't work", (done)=> {
    expect(true).toBe(false)
    done();
  });

  afterEach((done)=> {
    if (this.app && this.app.isRunning()) {
      this.app.stop().then(done);
    } else {
      done()
    }
  });

});

describe('Nylas Bootup Tests', function() {
  beforeEach((done)=>{
    this.app = new Application({
      path: jasmine.ELECTRON_LAUNCHER,
      args: jasmine.ELECTRON_ARGS.concat(jasmine.NYLAS_ARGS)
    });
    this.app.start().then(()=> {
      client = this.app.client
      client.waitForExist(".spec-reporter", jasmine.BOOT_WAIT).then(=> {
        done()
      })
    });
  });

  afterEach((done)=> {
    if (this.app && this.app.isRunning()) {
      this.app.stop().then(done);
    } else {
      done()
    }
  });

  it('boots 4 windows on launch', (done)=> {
    this.app.client.getWindowCount().then((count)=> {
      expect(count).toEqual(4);
      done();
    });
  });
});

describe('Nylas Integration Tests', function() {

});

