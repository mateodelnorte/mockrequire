var fs = require('fs'),
    log = require('debug')('mockrequire'),
    path = require('path'),
    stacktrace = require('stack-trace'),
    vm = require('vm'),
    extend = require('util')._extend;

module.exports = function (module, mocks, globals) {

  mocks = mocks || {};

  // 3rd object in stacktrace array is calling file
  var caller = stacktrace.get(this)[2].getFileName();

  log('preparing to mockrequire ' + module + ' from module ' + caller);

  var resolve = function (module, base) {
    if (module.charAt(0) !== '.') return module;
    return path.resolve(path.dirname(base), module) + '.js';
  };

  var exports = {};

  var sandbox = {
    require: function (name) {
      if (mocks[name]) {
        log('loading mocked module ' + name + ' from parent module ' + module);
        return mocks[name];
      }
      else {
        var file = path.join(path.dirname(caller), path.dirname(module), name);
        log('loading module ' + file + ' from parent module ' + module);
        return require(file);
      }
    },
    console: console,
    exports: exports,
    module: {
      exports: exports
    }
  };

  if (!!globals) { extend(sandbox, globals); }

  var filepath = resolve(module, caller);

  log('mockrequiring ' + filepath);

  vm.runInNewContext(fs.readFileSync(filepath), sandbox);

  return sandbox.module.exports;
};
