var _ = require('lodash');
var co = require('co');
var Promise = require('bluebird');
var sha256 = require('sha256');
var jsonpatch = require('jsonpatch');
require('regenerator/runtime');

_.mixin({
  scope: function scope(fn, ctx) {
    var $__arguments0 = arguments;
    var $__arguments = $__arguments0;
    _.dev(function() { if(!ctx) { throw new TypeError('ctx should not be falsy.'); } });

    return function() {
      return fn.apply(ctx, $__arguments);
    };
  },

  scopeAll: function scopeAll(fn, ctx, methods) {
    methods.each(function(method) {
      return ctx[method] = _.scope(ctx[method], ctx);
    });
  },

  dev: function dev(fn) {
    if(!process || !process.env || !process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
      return fn();
    }
  },

  prod: function prod(fn) {
    if(process && process.env && process.env.NODE_ENV === 'production') {
      return fn();
    }
  },

  Promise: Promise,

  co: co,
  deco: function deco(gen, done, ctx) {
    ctx = ctx || this;
    _.co(gen).call(ctx, done);
  },

  sha256: sha256,

  adler32: function adler32(data) {
    var a = 1;
    var b = 0;
    var MOD = 65521;
    for (var i = 0; i < data.length; i++) {
      a = (a + data.charCodeAt(i)) % MOD;
      b = (b + a) % MOD;
    }
    return a | (b << 16);
  },

  hash: function hash(data) {
    if(_.isObject(data)) {
      return _.hash(JSON.stringify(data));
    }
    return _.adler32(data);
  },

  secureHash: function secureHash(data) {
    if(_.isObject(data)) {
      return _.secureHash(JSON.stringify(data));
    }
    return _.sha256(data);
  },

  diff: function diff(prev, next) {
    return jsonpatch.compare(prev, next);
  },

  patch: function patch(prev, diff) {
    return jsonpatch.apply(prev, diff);
  },

  base64Encode: function base64Encode(s) {
    return new Buffer(s).toString('base64');
  },

  base64Decode: function base64Decode(s) {
    return new Buffer(s, 'base64').toString('utf-8');
  },

  guid: function guid(prefix) {
    var s4 = function() {
      return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
    };
    prefix = prefix || '';
    return "" + prefix + "" + s4() + "" + s4() + "-" + s4() + "-" + s4() + "-" + s4() + "-" + s4() + "" + s4() + "" + s4() + "";
  },

  breakpoint: function breakpoint() {
    /*jshint ignore:start*/
    debugger;
    /*jshint ignore:end*/
  },

  rethrow: function rethrow(err, desc) {
    if(err) {
      if(desc) {
        err = _.extendError(err, desc);
      }
      throw err;
    }
  },

  extendError: function extendError(err, desc) {
    err.message = "" + desc + ": " + err.message + "";
    return err;
  },

  record: function record(key, val) {
    /*jshint ignore:start*/
    return function() {
      var obj = {};
      obj[key] = val;
      return obj;
    }.bind(this)();
    /*jshint ignore:end*/
  },

  sleep: function sleep(delay) {
    return Promise.delay(delay);
  },

  unpathify: function unpathify(path) {
    route = path.replace(escapeRegExp, '\\$&')
    .replace(optionalParam, '(?:$1)?')
    .replace(namedParam, function(match, optional) {
      return optional ? match : '([^/?]+)';
    })
    .replace(splatParam, '([^?]*?)');
    return new RegExp('^' + route + '(?:\\?([\\s\\S]*))?$');
  },

});

module.exports = _;
