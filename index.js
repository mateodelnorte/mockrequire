var fs = require('fs'),
    log = require('debug')('mockrequire'),
    vm = require('vm'),
    path = require('path');

var mochaRegExp = new RegExp(/mocha/),
    testDirRegExp = new RegExp(/\/test$/);
  
/**
 * @param {string} relative path to module being loaded
 * @param {Object} object representing mocks to be supplied to module being loaded. mocks will override child modules otherwise being loaded by require()
 * @param {Object} options object for specifying debug mode 
 */
module.exports = function (path, mocks) {

  mocks = mocks || {};

  // if( ! testDirRegExp.test(process.cwd()) 
  //     && mochaRegExp.test(process.env._) 
  //     && new RegExp(/^\.\./).test(path)) {
  //   log(path);
  //   path = path.slice(1);
  //   log(path);
  // }

  var filepath = process.env.PWD + '/' + path, suffix = '.js';

  if (filepath.indexOf(suffix, filepath.length - suffix.length) === -1) {
    filepath = filepath + suffix;
  }

  var resolve = function (module) {
    if (module.charAt(0) !== '.') return module;
    
    var resolvePath = path.dirname(path);
    var childPath = path.resolve(resolvePath, module);
    
    log('childPath: ' + childPath);
    
    return childPath;
  };

  var exports = {};

  var sandbox = {
    require: function (name) {
      return mocks[name] || require(resolve(name));
    },
    console: console,
    exports: exports,
    module: {
      exports: exports
    }
  };

  log('original path: ' + filepath);

  try {
    vm.runInNewContext(fs.readFileSync(filepath), sandbox);
  } catch (err) {
    if (mochaRegExp.test(process.env._)) {
      log('mocha')
      vm.runInNewContext(fs.readFileSync(filepath.replace('./','test/')), sandbox);
    }
    else {
      throw err;
    }
  }

  return sandbox.module.exports;
};
