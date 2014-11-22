"use strict";

require("6to5/polyfill");var Promise = require("bluebird");var __DEV__ = (process.env.NODE_ENV !== "production");
var should = require("should");
var _ = require("lodash");
var co = require("co");
var sha256 = require("sha256");
var jsonpatch = require("fast-json-patch");


_.mixin({
  __DEV__: __DEV__,

  should: should,

  scope: function (fn, ctx) {
    return function () {
      fn.apply(ctx, arguments);
    };
  },

  scopeAll: function (ctx, methods) {
    methods.each(function (method) {
      return ctx[method] = _.scope(ctx[method], ctx);
    });
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

  isServer: function () {
    return typeof window === "undefined";
  },

  isClient: function () {
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
    return a | (b << 16);
  },
  /* jshint ignore:end */

  hash: function (data) {
    if (_.isObject(data)) {
      return _.hash(JSON.stringify(data));
    }
    return _.adler32(data);
  },

  secureHash: function (data) {
    if (_.isObject(data)) {
      return _.secureHash(JSON.stringify(data));
    }
    return _.sha256(data);
  },

  diff: function (prev, next) {
    return jsonpatch.compare(prev, next);
  },

  patch: function (prev, diff) {
    return jsonpatch.apply(prev, diff);
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
//# sourceMappingURL=data:application/json;base64,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S0FBRSxDQUNuQyxPQUFNLEdBQUcsRUFBRTtBQUFFLGFBQU8sR0FBRyxDQUFDO0tBQUU7R0FDM0IsRUFFRixDQUFDLENBQUM7O0FBRUgsTUFBTSxDQUFDLE9BQU8sR0FBRyxDQUFDLENBQUMiLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VzQ29udGVudCI6WyJjb25zdCBzaG91bGQgPSByZXF1aXJlKCdzaG91bGQnKTtcbmNvbnN0IF8gPSByZXF1aXJlKCdsb2Rhc2gnKTtcbmNvbnN0IGNvID0gcmVxdWlyZSgnY28nKTtcbmNvbnN0IHNoYTI1NiA9IHJlcXVpcmUoJ3NoYTI1NicpO1xuY29uc3QganNvbnBhdGNoID0gcmVxdWlyZSgnZmFzdC1qc29uLXBhdGNoJyk7XG5cblxuXy5taXhpbih7XG5cbiAgX19ERVZfXyxcblxuICBzaG91bGQsXG5cbiAgc2NvcGUoZm4sIGN0eCkge1xuICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgIGZuLmFwcGx5KGN0eCwgYXJndW1lbnRzKTtcbiAgICB9O1xuICB9LFxuXG4gIHNjb3BlQWxsKGN0eCwgbWV0aG9kcykge1xuICAgIG1ldGhvZHMuZWFjaCgobWV0aG9kKSA9PiBjdHhbbWV0aG9kXSA9IF8uc2NvcGUoY3R4W21ldGhvZF0sIGN0eCkpO1xuICB9LFxuXG4gIGFic3RyYWN0KCkge1xuICAgIHRocm93IG5ldyBFcnJvcignVGhpcyBtZXRob2QgaXMgYWJzdHJhY3QgYW5kIHNob3VsZCBiZSBleHRlbmRlZC4nKTtcbiAgfSxcblxuICBkZXYoZm4pIHtcbiAgICByZXR1cm4gX19ERVZfXyA/IGZuKCkgOiB2b2lkIDA7XG4gIH0sXG5cbiAgcHJvZChmbikge1xuICAgIHJldHVybiBfX0RFVl9fID8gdm9pZCAwIDogZm4oKTtcbiAgfSxcblxuICBpc1NlcnZlcigpIHtcbiAgICByZXR1cm4gdHlwZW9mIHdpbmRvdyA9PT0gJ3VuZGVmaW5lZCc7XG4gIH0sXG5cbiAgaXNDbGllbnQoKSB7XG4gICAgcmV0dXJuICFfLmlzU2VydmVyKCk7XG4gIH0sXG5cbiAgUHJvbWlzZTogUHJvbWlzZSxcblxuICBjbzogY28sXG5cbiAgc2hhMjU2OiBzaGEyNTYsXG5cbiAgLyoganNoaW50IGlnbm9yZTpzdGFydCAqL1xuICBhZGxlcjMyKGRhdGEpIHtcbiAgICBsZXQgYSA9IDE7XG4gICAgbGV0IGIgPSAwO1xuICAgIHZhciBNT0QgPSA2NTUyMTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGRhdGEubGVuZ3RoOyBpKyspIHtcbiAgICAgIGEgPSAoYSArIGRhdGEuY2hhckNvZGVBdChpKSkgJSBNT0Q7XG4gICAgICBiID0gKGIgKyBhKSAlIE1PRDtcbiAgICB9XG4gICAgcmV0dXJuIGEgfCAoYiA8PCAxNik7XG4gIH0sXG4gIC8qIGpzaGludCBpZ25vcmU6ZW5kICovXG5cbiAgaGFzaChkYXRhKSB7XG4gICAgaWYoXy5pc09iamVjdChkYXRhKSkge1xuICAgICAgcmV0dXJuIF8uaGFzaChKU09OLnN0cmluZ2lmeShkYXRhKSk7XG4gICAgfVxuICAgIHJldHVybiBfLmFkbGVyMzIoZGF0YSk7XG4gIH0sXG5cbiAgc2VjdXJlSGFzaChkYXRhKSB7XG4gICAgaWYoXy5pc09iamVjdChkYXRhKSkge1xuICAgICAgcmV0dXJuIF8uc2VjdXJlSGFzaChKU09OLnN0cmluZ2lmeShkYXRhKSk7XG4gICAgfVxuICAgIHJldHVybiBfLnNoYTI1NihkYXRhKTtcbiAgfSxcblxuICBkaWZmKHByZXYsIG5leHQpIHtcbiAgICByZXR1cm4ganNvbnBhdGNoLmNvbXBhcmUocHJldiwgbmV4dCk7XG4gIH0sXG5cbiAgcGF0Y2gocHJldiwgZGlmZikge1xuICAgIHJldHVybiBqc29ucGF0Y2guYXBwbHkocHJldiwgZGlmZik7XG4gIH0sXG5cbiAgYmFzZTY0RW5jb2RlKHMpIHtcbiAgICByZXR1cm4gbmV3IEJ1ZmZlcihzKS50b1N0cmluZygnYmFzZTY0Jyk7XG4gIH0sXG5cbiAgYmFzZTY0RGVjb2RlKHMpIHtcbiAgICByZXR1cm4gbmV3IEJ1ZmZlcihzLCAnYmFzZTY0JykudG9TdHJpbmcoJ3V0Zi04Jyk7XG4gIH0sXG5cbiAgZ3VpZChwcmVmaXgpIHtcbiAgICB2YXIgczQgPSAoKSA9PiBNYXRoLmZsb29yKCgxICsgTWF0aC5yYW5kb20oKSkgKiAweDEwMDAwKVxuICAgIC50b1N0cmluZygxNilcbiAgICAuc3Vic3RyaW5nKDEpO1xuICAgIHByZWZpeCA9IHByZWZpeCB8fCAnJztcbiAgICByZXR1cm4gYCR7cHJlZml4fSR7czQoKX0ke3M0KCl9LSR7czQoKX0tJHtzNCgpfS0ke3M0KCl9LSR7czQoKX0ke3M0KCl9JHtzNCgpfWA7XG4gIH0sXG5cbiAgYnJlYWtwb2ludCgpIHtcbiAgICAvKmpzaGludCBpZ25vcmU6c3RhcnQqL1xuICAgIGRlYnVnZ2VyO1xuICAgIC8qanNoaW50IGlnbm9yZTplbmQqL1xuICB9LFxuXG4gIHJldGhyb3coZXJyLCBkZXNjKSB7XG4gICAgaWYoZXJyKSB7XG4gICAgICBpZihkZXNjKSB7XG4gICAgICAgIGVyciA9IF8uZXh0ZW5kRXJyb3IoZXJyLCBkZXNjKTtcbiAgICAgIH1cbiAgICAgIHRocm93IGVycjtcbiAgICB9XG4gIH0sXG5cbiAgZXh0ZW5kRXJyb3IoZXJyLCBkZXNjKSB7XG4gICAgZXJyLm1lc3NhZ2UgPSBgJHtkZXNjfTogJHtlcnIubWVzc2FnZX1gO1xuICAgIHJldHVybiBlcnI7XG4gIH0sXG5cbiAgcmVjb3JkKGtleSwgdmFsKSB7XG4gICAgcmV0dXJuIHsgW2tleV06IHZhbCB9O1xuICB9LFxuXG4gIHNsZWVwKGRlbGF5KSB7XG4gICAgcmV0dXJuIFByb21pc2UuZGVsYXkoZGVsYXkpO1xuICB9LFxuXG4gIHByb2xseXBhcnNlKGpzb24pIHtcbiAgICB0cnkgeyByZXR1cm4gSlNPTi5wYXJzZShqc29uKTsgfVxuICAgIGNhdGNoKGVycikgeyByZXR1cm4ganNvbjsgfVxuICB9LFxuXG4gIHByb2xseXN0cmluZ2lmeShvYmopIHtcbiAgICB0cnkgeyByZXR1cm4gSlNPTi5zdHJpbmdpZnkob2JqKTsgfVxuICAgIGNhdGNoKGVycikgeyByZXR1cm4gb2JqOyB9XG4gIH0sXG5cbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IF87XG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=