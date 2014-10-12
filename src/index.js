var _ = require('lodash');
var co = require('co');
var Promise = require('bluebird');
var sha256 = require('sha256');
var jsonpatch = require('jsonpatch');
require('regenerator/runtime');

_.mixin({
    scope(fn, ctx) {
        return function() {
            fn.apply(ctx, arguments);
        };
    },

    scopeAll(fn, ctx, methods) {
        _.each(methods, function(method) {
            ctx[method] = _.scope(ctx[method], ctx);
        });
    },

    dev(fn) {
        if(node.env.NODE_ENV === 'development') {
            return fn();
        }
    },

    prod(fn) {
        if(node.env.NODE_ENV === 'production') {
            return fn();
        }
    },

    Promise: Promise,

    co: co,

    sha256: sha256,

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

    asyncNoop: function*() {
        yield _.defer;
        return;
    },

    asyncTimeout: function*(delay) {
        var timeout = function() {
            return function(fn) {
                setTimeout(fn, delay);
            };
        };
        yield timeout();
    },

    asyncConstant: function*(val) {
        yield _.asyncNoop();
        return val;
    },

});

module.exports = _;