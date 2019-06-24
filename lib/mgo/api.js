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

repo.Api.prototype.ALL = function (router, name, ...middles) {
  const h = hook.Hook({})
  router.get(`/${name}/:id`, ...middles, async ctx => {
    const h1 = hook.Hook({ handler: ctx => handler.one(name, ctx, this) })
    h1.Pre(h.pre)
    h1.Post(h.post)
    h1.Auth(h.auth)
    await h1.R(ctx)
  })
  router.get(`/${name}`, ...middles, async ctx => {
    const h1 = hook.Hook({ handler: ctx => handler.list(name, ctx, this) })
    h1.Pre(h.pre)
    h1.Post(h.post)
    h1.Auth(h.auth)
    await h1.R(ctx)
  })
  router.post(`/${name}`, ...middles, async ctx => {
    const h1 = hook.Hook({ handler: ctx => handler.create(name, ctx, this) })
    h1.Pre(h.pre)
    h1.Post(h.post)
    h1.Auth(h.auth)
    await h1.R(ctx)
  })
  router.put(`/${name}`, ...middles, async ctx => {
    const h1 = hook.Hook({ handler: ctx => handler.update(name, ctx, this) })
    h1.Pre(h.pre)
    h1.Post(h.post)
    h1.Auth(h.auth)
    await h1.R(ctx)
  })
  router.delete(`/${name}`, ...middles, async ctx => {
    const h1 = hook.Hook({ handler: ctx => handler.delete(name, ctx, this) })
    h1.Pre(h.pre)
    h1.Post(h.post)
    h1.Auth(h.auth)
    await h1.R(ctx)
  })
  return h
}
