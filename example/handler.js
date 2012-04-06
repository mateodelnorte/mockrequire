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