var vm = require('vm');
var fs = require('fs');
var path = require('path');

/**
 * Helper for unit testing:
 * - load module with mocked dependencies
 * - allow accessing private state of the module
 *
 * @param {string} filePath Absolute path to module (file to load)
 * @param {Object=} mocks Hash of mocked dependencies
 */
module.exports = function(filePath, mocks, options) {
  mocks = mocks || {};
  options = options || { debug: false };

  var fullFilePath = process.env.PWD + '/' + filePath; 
  var suffix = '.js';

  if (fullFilePath.indexOf(suffix, fullFilePath.length - suffix.length) === -1) {
    fullFilePath = fullFilePath + suffix;
  }

  // this is necessary to allow relative filePath modules within loaded file
  // i.e. requiring ./some inside file /a/b.js needs to be resolved to /a/some
  var resolveModule = function(module) {
    if (module.charAt(0) !== '.') return module;
    var resolvePath = path.dirname(filePath);
    var childPath = path.resolve(resolvePath, module);
    if (options.debug) console.log('childPath: ', childPath);
    return childPath;
  };

  var exports = {};
  var context = {
    require: function(name) {
      return mocks[name] || require(resolveModule(name));
    },
    console: console,
    exports: exports,
    module: {
      exports: exports
    }
  };
  if (options.debug) console.log('original path: ', fullFilePath);
  vm.runInNewContext(fs.readFileSync(fullFilePath), context);
  return context.module.exports;
};
