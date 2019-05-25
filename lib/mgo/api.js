const hook = require('./hook')
const handler = require('./handler')

const repo = module.exports

repo.Api = function ({ mgo }) {
  if (!(this instanceof repo.Api)) {
    return new repo.Api({ mgo })
  }
  this.mgo = mgo
}

repo.Api.prototype.One = function (router, name) {
  async function middle (ctx) {
    await handler.one(name, this.mgo, ctx)
  }
  const h = hook.Hook({ mgo: this.mgo, handler: middle })
  router.get(`/${name}/:id`, h.R)
  return h
}

repo.Api.prototype.List = function (router, name) {
  async function middle (ctx) {
    await handler.list(name, this.mgo, ctx)
  }
  const h = hook.Hook({ mgo: this.mgo, handler: middle })
  router.get(`/${name}`, h.R)
  return h
}

repo.Api.prototype.Create = function (router, name) {
  async function middle (ctx) {
    await handler.create(name, this.mgo, ctx)
  }
  const h = hook.Hook({ mgo: this.mgo, handler: middle })
  router.post(`/${name}`, h.R)
  return h
}

repo.Api.prototype.Update = function (router, name) {
  async function middle (ctx) {
    await handler.update(name, this.mgo, ctx)
  }
  const h = hook.Hook({ mgo: this.mgo, handler: middle })
  router.put(`/${name}`, h.R)
  return h
}

repo.Api.prototype.Delete = function (router, name) {
  async function middle (ctx) {
    await handler.delete(name, this.mgo, ctx)
  }
  const h = hook.Hook({ mgo: this.mgo, handler: middle })
  router.put(`/${name}`, h.R)
  return h
}

repo.Api.prototype.ALL = function (router, name) {
  router.get(`/${name}/:id`, async ctx => {
    await handler.one(name, this.mgo, ctx)
  })
  router.get(`/${name}`, async ctx => {
    await handler.list(name, this.mgo, ctx)
  })
  router.post(`/${name}`, async ctx => {
    await handler.create(name, this.mgo, ctx)
  })
  router.put(`/${name}`, async ctx => {
    await handler.update(name, this.mgo, ctx)
  })
  router.delete(`/${name}`, async ctx => {
    await handler.delete(name, this.mgo, ctx)
  })
}
