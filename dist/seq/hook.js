"use strict";

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

// Copyright (c) 2018-2020 Double.  All rights reserved.
// Use of this source code is governed by a MIT style
// license that can be found in the LICENSE file.
const assert = require('assert');

const is = require('is');

const repo = module.exports;

const authFailed = ctx => {
  ctx.status = 403;
  ctx.body = {
    message: 'Access Denied, you don\'t have permission.'
  };
};

repo.Hook = function (_ref) {
  let {
    handler,
    pre,
    post,
    auth,
    routeHooks
  } = _ref;

  if (!(this instanceof repo.Hook)) {
    return new repo.Hook({
      handler,
      pre,
      post,
      auth,
      routeHooks
    });
  }

  this.R = this.route();
  this.pre = pre;
  this.post = post;
  this.auth = auth;
  this.handler = handler;
  this.routeHooks = routeHooks;
}; // Wrap spec model router with pre and post hooks


repo.Hook.prototype.route = function () {
  var _this = this;

  return (
    /*#__PURE__*/
    function () {
      var _ref2 = _asyncToGenerator(function* (ctx) {
        if (_this.pre) {
          yield _this.pre(ctx);
        }

        if (_this.handler) {
          if (_this.auth) {
            const ret = yield _this.auth(ctx);

            if (ret) {
              yield _this.handler(ctx);
            } else {
              authFailed(ctx);
            }
          } else {
            yield _this.handler(ctx);
          }
        }

        if (_this.post) {
          yield _this.post(ctx);
        }
      });

      return function (_x) {
        return _ref2.apply(this, arguments);
      };
    }()
  );
}; // Pre hook for after exec spec model router


repo.Hook.prototype.Pre = function (pre) {
  if (is.function(pre)) {
    this.pre = pre;
  }

  return this;
}; // Post hook for after exec spec model router


repo.Hook.prototype.Post = function (post) {
  if (is.function(post)) {
    this.post = post;
  }

  return this;
}; // Auth hook for after exec spec model router


repo.Hook.prototype.Auth = function (auth) {
  if (is.function(auth)) {
    this.auth = auth;
  }

  return this;
}; // Auth hook for after exec spec model router


repo.Hook.prototype.RouteHooks = function (hooks) {
  assert.ok(is.object(hooks), 'hooks can not be empty!');

  if (this.routeHooks) {
    this.routeHooks(hooks);
  }

  return this;
};