require('should');

var mockrequire = require('../index');

describe('handling nested files that require node_modules', function () {
  it('should not throw an error', function () {
    var nestedFile = mockrequire('./nestLevel1/nestLevel2/nestLevel3/nestedFile', {});
  });

});
