# MockRequire

  Simple module for mocking required dependencies. Works with any testing suite. (https://github.com/mateodelnorte/mockrequire).

```
var db = require('mydblib');

module.exports = function userPaymentCompleted (event) {

  db.User.findByEmail(event.email, function (err, user) {
    if(err) throw err;

    user.payment = 'complete';

    user.save(function (err) { 
      if(err) throw err; 
    });
  });
};
```
