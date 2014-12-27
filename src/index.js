const should = require('should');
const _ = require('lodash').runInContext();
const co = require('co');
const sha256 = require('sha256');
const sigmund = require('sigmund');

_.mixin({

  __DEV__,

  should,

  deprecated(name) {
    if(__DEV__) {
      console.warn(`Warning: function ${name} is deprecated.`);
    }
  },

  scope(fn, ctx) {
    return function() {
      fn.apply(ctx, arguments);
    };
  },

  scopeAll(ctx, methods) {
    _.dev(() => ctx.should.be.an.Object &&
      methods.should.be.an.Array &&
      methods.map((methodName) => methodName.should.be.a.String &&
        (ctx[methodName] !== void 0).should.be.ok &&
        ctx[methodName].should.be.a.Function
      )
    );
    methods.forEach((method) => ctx[method] = _.scope(ctx[method], ctx));
    return this;
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

  isBrowser() {
    return __BROWSER__;
  },

  isNode() {
    return __NODE__;
  },

  isServer() {
    _.deprecated('_.isServer');
    return typeof window === 'undefined';
  },

  isClient() {
    _.deprecated('_.isClient');
    return !_.isServer();
  },

  Promise,

  co,

  sha256,

  /* jshint ignore:start */
  adler32(data) {
    let a = 1;
    let b = 0;
    const MOD = 65521;
    for (let i = 0; i < data.length; i++) {
      a = (a + data.charCodeAt(i)) % MOD;
      b = (b + a) % MOD;
    }
    return a | (b << 16);
  },
  /* jshint ignore:end */

  hash(data) {
    if(_.isObject(data)) {
      return _.adler32(sigmund(data));
    }
    return _.adler32(data);
  },

  secureHash(data) {
    if(_.isObject(data)) {
      return _.secureHash(JSON.stringify(data));
    }
    return _.sha256(data);
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
