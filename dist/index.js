"use strict";

require("6to5/polyfill");var Promise = (global || window).Promise = require("bluebird");var __DEV__ = process.env.NODE_ENV !== "production";var __PROD__ = !__DEV__;var __BROWSER__ = typeof window === "object";var __NODE__ = !__BROWSER__;var should = require("should");
var _ = require("lodash").runInContext();
var co = require("co");
var sha256 = require("sha256");
var sigmund = require("sigmund");

_.mixin({

  __DEV__: __DEV__,

  should: should,

  deprecated: function (name) {
    if (__DEV__) {
      console.warn("Warning: function " + name + " is deprecated.");
    }
  },

  scope: function (fn, ctx) {
    return function () {
      fn.apply(ctx, arguments);
    };
  },

  scopeAll: function (ctx, methods) {
    _.dev(function () {
      return ctx.should.be.an.Object && methods.should.be.an.Array && methods.map(function (methodName) {
        return methodName.should.be.a.String && (ctx[methodName] !== void 0).should.be.ok && ctx[methodName].should.be.a.Function;
      });
    });
    methods.forEach(function (method) {
      return ctx[method] = _.scope(ctx[method], ctx);
    });
    return this;
  },

  abstract: function () {
    throw new Error("This method is abstract and should be extended.");
  },

  dev: function (fn) {
    return __DEV__ ? fn() : void 0;
  },

  prod: function (fn) {
    return __DEV__ ? void 0 : fn();
  },

  isBrowser: function () {
    return __BROWSER__;
  },

  isNode: function () {
    return __NODE__;
  },

  isServer: function () {
    _.deprecated("_.isServer");
    return typeof window === "undefined";
  },

  isClient: function () {
    _.deprecated("_.isClient");
    return !_.isServer();
  },

  Promise: Promise,

  co: co,

  sha256: sha256,

  /* jshint ignore:start */
  adler32: function (data) {
    var a = 1;
    var b = 0;
    var MOD = 65521;
    for (var i = 0; i < data.length; i++) {
      a = (a + data.charCodeAt(i)) % MOD;
      b = (b + a) % MOD;
    }
    return a | b << 16;
  },
  /* jshint ignore:end */

  hash: function (data) {
    if (_.isObject(data)) {
      return _.adler32(sigmund(data));
    }
    return _.adler32(data);
  },

  secureHash: function (data) {
    if (_.isObject(data)) {
      return _.secureHash(JSON.stringify(data));
    }
    return _.sha256(data);
  },

  base64Encode: function (s) {
    return new Buffer(s).toString("base64");
  },

  base64Decode: function (s) {
    return new Buffer(s, "base64").toString("utf-8");
  },

  guid: function (prefix) {
    var s4 = function () {
      return Math.floor((1 + Math.random()) * 65536).toString(16).substring(1);
    };
    prefix = prefix || "";
    return "" + prefix + "" + s4() + "" + s4() + "-" + s4() + "-" + s4() + "-" + s4() + "-" + s4() + "" + s4() + "" + s4();
  },

  breakpoint: function () {
    /*jshint ignore:start*/
    debugger;
    /*jshint ignore:end*/
  },

  rethrow: function (err, desc) {
    if (err) {
      if (desc) {
        err = _.extendError(err, desc);
      }
      throw err;
    }
  },

  extendError: function (err, desc) {
    err.message = "" + desc + ": " + err.message;
    return err;
  },

  record: function (key, val) {
    return (function (_ref) {
      _ref[key] = val;
      return _ref;
    })({});
  },

  sleep: function (delay) {
    return Promise.delay(delay);
  },

  prollyparse: function (json) {
    try {
      return JSON.parse(json);
    } catch (err) {
      return json;
    }
  },

  prollystringify: function (obj) {
    try {
      return JSON.stringify(obj);
    } catch (err) {
      return obj;
    }
  } });

module.exports = _;