var fs = require('fs'),
    log = require('debug')('mockrequire'),
    path = require('path'),
    stacktrace = require('stack-trace'),
    vm = require('vm'),
    extend = require('util')._extend;

module.exports = function (module, mocks, compiler) {

  // allow specifying modules with shorthand when named index.js
  if (module.slice(-1) === '/') { module = module + 'index' }

  mocks = mocks || {};

  // 3rd object in stacktrace array is calling file
  var caller = stacktrace.get(this)[2].getFileName();

  log('preparing to mockrequire ' + module + ' from module ' + caller);

  var isNodeModule = function(module) {
    return module[0] !== '.';
  };

  var resolve = function (module, base) {
    if (isNodeModule(module)) return module;
    return path.resolve(path.dirname(base), module) + '.js';
  };

  var findNodeModule = function(file, name) {
    var modulesFolder = path.join(file, '../node_modules');
    if(fs.existsSync(modulesFolder)){
      return path.join(modulesFolder, name);
    } else {
      file = path.join(file, '../');
      return findNodeModule(file, name);
    }
  };

  var exports = {};

  var sandbox = {
    require: function (name) {
      if (mocks[name]) {
        log('loading mocked module ' + name + ' from parent module ' + module);
        return mocks[name];
      } else if (isNodeModule(name)) {
        log('loading node_module ' + file + ' from parent module ' + module);
        return require(name);
      } else {
        var file = path.join(path.dirname(caller), path.dirname(module), name);
        //check if its a node module if so find module in node_modules dir
        if(name.charAt(0) !== '.') {
          file = findNodeModule(file, name);
        }
        log('loading module ' + file + ' from parent module ' + module);
        return require(file);
      }
    },
    exports: exports,
    module: {
      exports: exports
    }
  };

  extend(sandbox, global);

  var filepath = resolve(module, caller);

  log('mockrequiring ' + filepath);
  compiler = compiler || fs.readFileSync;
  vm.runInNewContext(compiler(filepath), sandbox, {
      filename: filepath
  });

  return sandbox.module.exports;
};
