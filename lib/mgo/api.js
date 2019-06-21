// Copyright (c) 2018-2020 Double.  All rights reserved.
// Use of this source code is governed by a MIT style
// license that can be found in the LICENSE file.

const hook = require('./hook')
const handler = require('./handler')

const repo = module.exports

repo.Api = function ({ mongoose }) {
  if (!(this instanceof repo.Api)) {
    return new repo.Api({ mongoose })
  }
  this.defaultAPI = null
  this.mongoose = mongoose
}

repo.Api.prototype.setDefaultAPI = function (defaultAPI) {
  this.defaultAPI = defaultAPI
}

repo.Api.prototype.One = function (router, name, ...middles) {
  const h = hook.Hook({ handler: ctx => handler.one(name, ctx, this) })
  middles.push(h.R)
  router.get(`/${name}/:id`, ...middles)
  return h
}

repo.Api.prototype.List = function (router, name, ...middles) {
  const h = hook.Hook({ handler: ctx => handler.list(name, ctx, this) })
  middles.push(h.R)
  router.get(`/${name}`, ...middles)
  return h
}

repo.Api.prototype.Create = function (router, name, ...middles) {
  const h = hook.Hook({ handler: ctx => handler.create(name, ctx, this) })
  middles.push(h.R)
  router.post(`/${name}`, ...middles)
  return h
}

repo.Api.prototype.Update = function (router, name, ...middles) {
  const h = hook.Hook({ handler: ctx => handler.update(name, ctx, this) })
  middles.push(h.R)
  router.put(`/${name}`, ...middles)
  return h
}

repo.Api.prototype.Delete = function (router, name, ...middles) {
  const h = hook.Hook({ handler: ctx => handler.delete(name, ctx, this) })
  middles.push(h.R)
  router.delete(`/${name}`, ...middles)
  return h
}

repo.Api.prototype.ALL = function (router, name) {
  router.get(`/${name}/:id`, ctx => handler.one(name, ctx, this))
  router.get(`/${name}`, ctx => handler.list(name, ctx, this))
  router.post(`/${name}`, ctx => handler.create(name, ctx, this))
  router.put(`/${name}`, ctx => handler.update(name, ctx, this))
  router.delete(`/${name}`, ctx => handler.delete(name, ctx, this))
}
