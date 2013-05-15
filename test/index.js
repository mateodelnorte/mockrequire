require('mocha'),
require('should');

var mockrequire = require('../index');

var user = {
    save: function (cb) {
      cb(null);
      this.saved = true;
    }
  };

// instead of require()ing our handler directly, we can mockrequire() it and supply an object containing any child dependencies we would like to mock as well. Here we're mocking my_db_lib
var module = {
    User: { 
      findByEmail: function (email, cb){
        cb(null, user);
      }
    }
  };

var handler = mockrequire('./support/handler', {
  'my_db_lib': module
});

// we create our unit tests with mocha

describe('mockrequire', function(){
  it('should load provided object instead of module\'s originally required dependency', function () {
    handler.childDependency.should.equal(module);
    handler.childDependency2.should.equal(require('./support/handler2'));

    handler.method({ email: 'fake@email.com' });

    user.should.have.property('saved', true);
  });
});