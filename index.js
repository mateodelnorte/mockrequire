var vm = require('vm');
var fs = require('fs');
var path = require('path');

var mochaRegExp = new RegExp(/mocha/),
    testDirRegExp = new RegExp(/\/test$/);
  
/**
 * @param {string} relative path to module being loaded
 * @param {Object} object representing mocks to be supplied to module being loaded. mocks will override child modules otherwise being loaded by require()
 * @param {Object} options object for specifying debug mode 
 */
module.exports = function(filePath, mocks, options) {

  mocks = mocks || {};
  options = options || { debug: false };

  if( ! testDirRegExp.test(process.cwd()) 
      && mochaRegExp.test(process.env._) 
      && new RegExp(/^\.\./).test(filePath)) {
    filePath = filePath.slice(1);
  }

  var fullFilePath = process.env.PWD + '/' + filePath; 
  var suffix = '.js';

  if (fullFilePath.indexOf(suffix, fullFilePath.length - suffix.length) === -1) {
    fullFilePath = fullFilePath + suffix;
  }

  var resolve = function(module) {
    if (module.charAt(0) !== '.') return module;
    var resolvePath = path.dirname(filePath);
    var childPath = path.resolve(resolvePath, module);
    if (options.debug) console.log('childPath: ', childPath);
    return childPath;
  };

  var exports = {};

  var context = {
    require: function(name) {
      return mocks[name] || require(resolve(name));
    },
    console: console,
    exports: exports,
    module: {
      exports: exports
    }
  };

  if (options.debug) console.log('original path: ', fullFilePath);

  try {
    vm.runInNewContext(fs.readFileSync(fullFilePath), context);
  } catch (err) {
    if (mochaRegExp.test(process.env._)) {
      vm.runInNewContext(fs.readFileSync(fullFilePath.replace('./','test/')), context);
    }
    else {
      throw err;
    }
  }

  return context.module.exports;
};
