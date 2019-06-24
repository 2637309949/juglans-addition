"use strict";

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

// Copyright (c) 2018-2020 Double.  All rights reserved.
// Use of this source code is governed by a MIT style
// license that can be found in the LICENSE file.
const hook = require('./hook');

const handler = require('./handler');

const repo = module.exports;

repo.Api = function (_ref) {
  let {
    mongoose
  } = _ref;

  if (!(this instanceof repo.Api)) {
    return new repo.Api({
      mongoose
    });
  }

  this.defaultAPI = null;
  this.mongoose = mongoose;
};

repo.Api.prototype.setDefaultAPI = function (defaultAPI) {
  this.defaultAPI = defaultAPI;
};

repo.Api.prototype.One = function (router, name) {
  const h = hook.Hook({
    handler: ctx => handler.one(name, ctx, this)
  });

  for (var _len = arguments.length, middles = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
    middles[_key - 2] = arguments[_key];
  }

  middles.push(h.R);
  router.get.apply(router, [`/${name}/:id`].concat(middles));
  return h;
};

repo.Api.prototype.List = function (router, name) {
  const h = hook.Hook({
    handler: ctx => handler.list(name, ctx, this)
  });

  for (var _len2 = arguments.length, middles = new Array(_len2 > 2 ? _len2 - 2 : 0), _key2 = 2; _key2 < _len2; _key2++) {
    middles[_key2 - 2] = arguments[_key2];
  }

  middles.push(h.R);
  router.get.apply(router, [`/${name}`].concat(middles));
  return h;
};

repo.Api.prototype.Create = function (router, name) {
  const h = hook.Hook({
    handler: ctx => handler.create(name, ctx, this)
  });

  for (var _len3 = arguments.length, middles = new Array(_len3 > 2 ? _len3 - 2 : 0), _key3 = 2; _key3 < _len3; _key3++) {
    middles[_key3 - 2] = arguments[_key3];
  }

  middles.push(h.R);
  router.post.apply(router, [`/${name}`].concat(middles));
  return h;
};

repo.Api.prototype.Update = function (router, name) {
  const h = hook.Hook({
    handler: ctx => handler.update(name, ctx, this)
  });

  for (var _len4 = arguments.length, middles = new Array(_len4 > 2 ? _len4 - 2 : 0), _key4 = 2; _key4 < _len4; _key4++) {
    middles[_key4 - 2] = arguments[_key4];
  }

  middles.push(h.R);
  router.put.apply(router, [`/${name}`].concat(middles));
  return h;
};

repo.Api.prototype.Delete = function (router, name) {
  const h = hook.Hook({
    handler: ctx => handler.delete(name, ctx, this)
  });

  for (var _len5 = arguments.length, middles = new Array(_len5 > 2 ? _len5 - 2 : 0), _key5 = 2; _key5 < _len5; _key5++) {
    middles[_key5 - 2] = arguments[_key5];
  }

  middles.push(h.R);
  router.delete.apply(router, [`/${name}`].concat(middles));
  return h;
};

repo.Api.prototype.ALL = function (router, name) {
  var _this = this;

  const h = hook.Hook({});

  for (var _len6 = arguments.length, middles = new Array(_len6 > 2 ? _len6 - 2 : 0), _key6 = 2; _key6 < _len6; _key6++) {
    middles[_key6 - 2] = arguments[_key6];
  }

  router.get.apply(router, [`/${name}/:id`].concat(middles, [
  /*#__PURE__*/
  function () {
    var _ref2 = _asyncToGenerator(function* (ctx) {
      const h1 = hook.Hook({
        handler: ctx => handler.one(name, ctx, _this)
      });
      h1.Pre(h.pre);
      h1.Post(h.post);
      h1.Auth(h.auth);
      yield h1.R(ctx);
    });

    return function (_x) {
      return _ref2.apply(this, arguments);
    };
  }()]));
  router.get.apply(router, [`/${name}`].concat(middles, [
  /*#__PURE__*/
  function () {
    var _ref3 = _asyncToGenerator(function* (ctx) {
      const h1 = hook.Hook({
        handler: ctx => handler.list(name, ctx, _this)
      });
      h1.Pre(h.pre);
      h1.Post(h.post);
      h1.Auth(h.auth);
      yield h1.R(ctx);
    });

    return function (_x2) {
      return _ref3.apply(this, arguments);
    };
  }()]));
  router.post.apply(router, [`/${name}`].concat(middles, [
  /*#__PURE__*/
  function () {
    var _ref4 = _asyncToGenerator(function* (ctx) {
      const h1 = hook.Hook({
        handler: ctx => handler.create(name, ctx, _this)
      });
      h1.Pre(h.pre);
      h1.Post(h.post);
      h1.Auth(h.auth);
      yield h1.R(ctx);
    });

    return function (_x3) {
      return _ref4.apply(this, arguments);
    };
  }()]));
  router.put.apply(router, [`/${name}`].concat(middles, [
  /*#__PURE__*/
  function () {
    var _ref5 = _asyncToGenerator(function* (ctx) {
      const h1 = hook.Hook({
        handler: ctx => handler.update(name, ctx, _this)
      });
      h1.Pre(h.pre);
      h1.Post(h.post);
      h1.Auth(h.auth);
      yield h1.R(ctx);
    });

    return function (_x4) {
      return _ref5.apply(this, arguments);
    };
  }()]));
  router.delete.apply(router, [`/${name}`].concat(middles, [
  /*#__PURE__*/
  function () {
    var _ref6 = _asyncToGenerator(function* (ctx) {
      const h1 = hook.Hook({
        handler: ctx => handler.delete(name, ctx, _this)
      });
      h1.Pre(h.pre);
      h1.Post(h.post);
      h1.Auth(h.auth);
      yield h1.R(ctx);
    });

    return function (_x5) {
      return _ref6.apply(this, arguments);
    };
  }()]));
  return h;
};