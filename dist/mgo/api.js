"use strict";

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
  router.get(`/${name}/:id`, ctx => handler.one(name, ctx, this));
  router.get(`/${name}`, ctx => handler.list(name, ctx, this));
  router.post(`/${name}`, ctx => handler.create(name, ctx, this));
  router.put(`/${name}`, ctx => handler.update(name, ctx, this));
  router.delete(`/${name}`, ctx => handler.delete(name, ctx, this));
};