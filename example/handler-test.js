require('mocha'),
require('should');
var mockrequire = require('mockrequire');

var user = {
    save: function (cb) {
      cb(null);
      this.saved = true;
    }
  };

var userPaymentComplete = mockrequire('../handlers/userPaymentComplete', {
  'gochime.lib/datastore': {
    User: function User () {
      return {
        findByEmail: function (email, cb){
          cb(null, user);
        }
      };
    }
  }
});

describe('userPaymentComplete()', function(){
  onboardUser({ email: 'fake@email.com' });
  it('should set onboarding as \'complete\'', function() {
    user.should.have.property('onboarding').equal(true);
  });
  it('should save user', function() {
    user.should.have.property('saved').equal(true);
  });
});