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
  const _this = this
  async function middle (ctx) {
    await handler.one(name, ctx, _this)
  }
  const h = hook.Hook({ handler: middle })
  middles.push(h.R)
  router.get(`/${name}/:id`, ...middles)
  return h
}

repo.Api.prototype.List = function (router, name, ...middles) {
  const _this = this
  async function middle (ctx) {
    await handler.list(name, ctx, _this)
  }
  const h = hook.Hook({ handler: middle })
  middles.push(h.R)
  router.get(`/${name}`, ...middles)
  return h
}

repo.Api.prototype.Create = function (router, name, ...middles) {
  const _this = this
  async function middle (ctx) {
    await handler.create(name, ctx, _this)
  }
  const h = hook.Hook({ handler: middle })
  middles.push(h.R)
  router.post(`/${name}`, ...middles)
  return h
}

repo.Api.prototype.Update = function (router, name, ...middles) {
  const _this = this
  async function middle (ctx) {
    await handler.update(name, ctx, _this)
  }
  const h = hook.Hook({ handler: middle })
  middles.push(h.R)
  router.put(`/${name}`, ...middles)
  return h
}

repo.Api.prototype.Delete = function (router, name, ...middles) {
  const _this = this
  async function middle (ctx) {
    await handler.delete(name, ctx, _this)
  }
  const h = hook.Hook({ handler: middle })
  middles.push(h.R)
  router.delete(`/${name}`, ...middles)
  return h
}

repo.Api.prototype.ALL = function (router, name) {
  router.get(`/${name}/:id`, async ctx => {
    await handler.one(name, ctx, this)
  })
  router.get(`/${name}`, async ctx => {
    await handler.list(name, ctx, this)
  })
  router.post(`/${name}`, async ctx => {
    await handler.create(name, ctx, this)
  })
  router.put(`/${name}`, async ctx => {
    await handler.update(name, ctx, this)
  })
  router.delete(`/${name}`, async ctx => {
    await handler.delete(name, ctx, this)
  })
}
