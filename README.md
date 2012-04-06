# MockRequire

Simple module for mocking required dependencies. Works with any testing suite. (https://github.com/mateodelnorte/mockrequire).


### Example Usage

Imagine your application uses the following module to onboard a user, in reaction to a recieved event. A service will require the module and call it, passing the event as a parameter. But, in the course of developing your application, you'd like to test the module in isolation from the rest of your code. The module depends on another module, 'my_db_lib'. 

How can you test the module in isolation?

```
var db = require('my_db_lib');

module.exports = function onboardUser (event) {

  db.User.findByEmail(event.email, function (err, user) {
    if(err) throw err;

    user.onboarding = 'complete';

    user.save(function (err) { 
      if(err) throw err; 
    });
  });
};
```

MockRequire provides a simple means of allowing you to mock dependencies of any module you require(). Want to unit test your code without ever having to hit a database, even though your code is require-ing your datastore modules directly? MockRequire is exactly what you need. 

The following example uses 'mocha' and 'should' to create a unit test for the module above. We also use 'mockrequire' to mock out our dependencies, parts of our module we don't care to isolate in our test. 

```
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
```
