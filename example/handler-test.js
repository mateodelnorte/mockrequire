require('mocha'),
require('should');
var mockrequire = require('../index');

var user = (function() {
  return {
    save: function (cb) {
      cb(null);
      this.saved = true;
    }
  };
})();

// instead of require()ing our handler directly, we can mockrequire() it and supply an object containing any child dependencies we would like to mock as well. Here we're mocking my_db_lib

var onboardUser = mockrequire('./handler', {
  'my_db_lib': {
    User: { 
      findByEmail: function (email, cb){
        cb(null, user);
      }
    }
  }
});

// we create our unit tests with mocha

describe('userPaymentComplete()', function(){
  onboardUser({ email: 'fake@email.com' });
  it('should set onboarding as \'complete\'', function() {
    user.should.have.property('onboarding').equal('complete');
  });
  it('should save user', function() {
    user.should.have.property('saved').equal(true);
  });
});
