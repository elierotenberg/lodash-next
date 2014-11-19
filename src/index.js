const _ = require('lodash');
const co = require('co');
const sha256 = require('sha256');
const jsonpatch = require('fast-json-patch');

const __DEV__ = (process.env.NODE_ENV !== 'production');

_.mixin({

  __DEV__,

  scope(fn, ctx) {
    return function() {
      fn.apply(ctx, arguments);
    };
  },

  scopeAll(fn, ctx, methods) {
    methods.each((method) => ctx[method] = _.scope(ctx[method], ctx));
  },

  abstract() {
    throw new Error('This method is abstract and should be extended.');
  },

  dev(fn) {
    return __DEV__ ? fn() : void 0;
  },

  prod(fn) {
    return __DEV__ ? void 0 : fn();
  },

  isServer() {
    return typeof window === 'undefined';
  },

  isClient() {
    return !_.isServer();
  },

  Promise: Promise,

  co: co,

  copromise(gen, ctx) {
    ctx = ctx || this;
    return new Promise((resolve, reject) =>
      co(gen).call(ctx, (err, res) => err ? reject(err) : resolve(res))
    );
  },

  deco(gen, done, ctx) {
    ctx = ctx || this;
    _.co(gen).call(ctx, done);
  },

  sha256: sha256,

  /* jshint ignore:start */
  adler32(data) {
    let a = 1;
    let b = 0;
    var MOD = 65521;
    for (let i = 0; i < data.length; i++) {
      a = (a + data.charCodeAt(i)) % MOD;
      b = (b + a) % MOD;
    }
    return a | (b << 16);
  },
  /* jshint ignore:end */

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
    return { [key]: val };
  },

  sleep(delay) {
    return Promise.delay(delay);
  },

  prollyparse(json) {
    try { return JSON.parse(json); }
    catch(err) { return json; }
  },

  prollystringify(obj) {
    try { return JSON.stringify(obj); }
    catch(err) { return obj; }
  },

});

module.exports = _;
