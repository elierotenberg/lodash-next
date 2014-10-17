require('regenerator/runtime');
var _ = require('lodash');
var co = require('co');
var jsonpatch = require('fast-json-patch');
var Promise = require('bluebird');
var sha256 = require('sha256');
var should = require('should');

var escapeRegExp = /[\-{}\[\]+?.,\\\^$|#\s]/g;
var namedParam = /(\(\?)?:\w+/g;
var optionalParam = /\((.*?)\)/g;
var splatParam = /\*\w+/g;

_.mixin({
  scope(fn, ctx) {
    _.dev(() => ctx.should.be.an.Object && fn.should.be.a.Function);
    return function() { return fn.apply(ctx, arguments); };
  },

  scopeAll(ctx, methodNames) {
    _.dev(() => ctx.should.be.an.Object && methodNames.should.be.an.Array);
    methodNames.forEach((methodName) => {
      _.dev(() => methodName.should.be.a.String && ctx[methodName].should.be.a.Function);
      ctx[methodName] = _.scope(ctx[methodName], ctx);
    });
    return this;
  },

  dev(fn) {
    if(!process || !process.env || !process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
      return fn();
    }
    return true;
  },

  prod(fn) {
    if(process && process.env && process.env.NODE_ENV === 'production') {
      return fn();
    }
    return true;
  },

  Promise: Promise,

  co: co,
  deco(gen, done, ctx) {
    ctx = ctx || this;
    _.co(gen).call(ctx, done);
  },

  sha256: sha256,

  adler32(data) {
    var a = 1;
    var b = 0;
    var MOD = 65521;
    for (var i = 0; i < data.length; i++) {
      a = (a + data.charCodeAt(i)) % MOD;
      b = (b + a) % MOD;
    }
    return a | (b << 16);
  },

  hash(data) {
    if(_.isObject(data)) {
      return _.hash(JSON.stringify(data));
    }
    return _.adler32(data);
  },

  secureHash(data) {
    if(_.isObject(data)) {
      return _.secureHash(JSON.stringify(data));
    }
    return _.sha256(data);
  },

  diff(prev, next) {
    return jsonpatch.compare(prev, next);
  },

  patch(prev, diff) {
    return jsonpatch.apply(prev, diff);
  },

  base64Encode(s) {
    return new Buffer(s).toString('base64');
  },

  base64Decode(s) {
    return new Buffer(s, 'base64').toString('utf-8');
  },

  guid(prefix) {
    var s4 = () => Math.floor((1 + Math.random()) * 0x10000)
    .toString(16)
    .substring(1);
    prefix = prefix || '';
    return `${prefix}${s4()}${s4()}-${s4()}-${s4()}-${s4()}-${s4()}${s4()}${s4()}`;
  },

  breakpoint() {
    /*jshint ignore:start*/
    debugger;
    /*jshint ignore:end*/
  },

  rethrow(err, desc) {
    if(err) {
      if(desc) {
        err = _.extendError(err, desc);
      }
      throw err;
    }
  },

  extendError(err, desc) {
    err.message = `${desc}: ${err.message}`;
    return err;
  },

  record(key, val) {
    /*jshint ignore:start*/
    return { [key]: val };
    /*jshint ignore:end*/
  },

  sleep(delay) {
    return Promise.delay(delay);
  },

  unpathify(path) {
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
