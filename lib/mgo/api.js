// Copyright (c) 2018-2020 Double.  All rights reserved.
// Use of this source code is governed by a MIT style
// license that can be found in the LICENSE file.

const merge = require('deepmerge')
const moment = require('moment')

const hook = require('./hook')
const handler = require('./handler')

const repo = module.exports

repo.Api = function ({ ext, API = {} }, opts = {}) {
  if (!(this instanceof repo.Api)) {
    return new repo.Api({ ext, API })
  }
  this.API = API
  if (this.API.opts) {
    this.opts = merge.all([ repo.Api.defaultOpts, this.API.opts, opts ])
  } else {
    this.opts = repo.Api.defaultOpts
  }
  this.ext = ext
}

repo.Api.prototype.Name = function (name) {
  this.opts = merge.all([ this.opts, { featurePrefix: name } ])
  return this
}

repo.Api.prototype.setAPI = function (plugin) {
  this.API = plugin
  this.opts = merge.all([ repo.Api.defaultOpts, this.API.opts ])
}

repo.Api.prototype.One = function (router, name, ...middles) {
  const routePrefixs = merge.all([ this.opts.routePrefixs, this.ext.Profile(name).routePrefixs || {} ])
  const routeHooks = merge.all([ this.opts.routeHooks, this.ext.Profile(name).routeHooks || {} ])
  const h = hook.Hook({
    handler: ctx => handler.one(name, ctx, { ext: this.ext, routePrefixs, routeHooks })
  })
  middles.push(h.R)
  router.get(routePrefixs.one(name, this.opts), ...middles)
  return h
}

repo.Api.prototype.List = function (router, name, ...middles) {
  const routePrefixs = merge.all([ this.opts.routePrefixs, this.ext.Profile(name).routePrefixs || {} ])
  const routeHooks = merge.all([ this.opts.routeHooks, this.ext.Profile(name).routeHooks || {} ])
  const h = hook.Hook({
    handler: ctx => handler.list(name, ctx, { ext: this.ext, routePrefixs, routeHooks })
  })
  middles.push(h.R)
  router.get(routePrefixs.list(name, this.opts), ...middles)
  return h
}

repo.Api.prototype.Create = function (router, name, ...middles) {
  const routePrefixs = merge.all([ this.opts.routePrefixs, this.ext.Profile(name).routePrefixs || {} ])
  const routeHooks = merge.all([ this.opts.routeHooks, this.ext.Profile(name).routeHooks || {} ])
  const h = hook.Hook({
    handler: ctx => handler.create(name, ctx, { ext: this.ext, routePrefixs, routeHooks })
  })
  middles.push(h.R)
  router.post(routePrefixs.create(name, this.opts), ...middles)
  return h
}

repo.Api.prototype.Update = function (router, name, ...middles) {
  const routePrefixs = merge.all([ this.opts.routePrefixs, this.ext.Profile(name).routePrefixs || {} ])
  const routeHooks = merge.all([ this.opts.routeHooks, this.ext.Profile(name).routeHooks || {} ])
  const h = hook.Hook({
    handler: ctx => handler.update(name, ctx, { ext: this.ext, routePrefixs, routeHooks })
  })
  middles.push(h.R)
  router.put(routePrefixs.update(name, this.opts), ...middles)
  return h
}

repo.Api.prototype.Delete = function (router, name, ...middles) {
  const routePrefixs = merge.all([ this.opts.routePrefixs, this.ext.Profile(name).routePrefixs || {} ])
  const routeHooks = merge.all([ this.opts.routeHooks, this.ext.Profile(name).routeHooks || {} ])
  const h = hook.Hook({
    handler: ctx => handler.delete(name, ctx, { ext: this.ext, routePrefixs, routeHooks })
  })
  middles.push(h.R)
  router.delete(routePrefixs.delete(name, this.opts), ...middles)
  return h
}

repo.Api.prototype.ALL = function (router, name, ...middles) {
  const _this = this
  const h = hook.Hook({})

  router.get((function prefix () {
    const routePrefixs = merge.all([ _this.opts.routePrefixs, _this.ext.Profile(name).routePrefixs || {} ])
    return routePrefixs.one(name, _this.opts)
  })(),
  ...middles, async ctx => {
    const routePrefixs = merge.all([ this.opts.routePrefixs, this.ext.Profile(name).routePrefixs || {} ])
    const routeHooks = merge.all([ this.opts.routeHooks, this.ext.Profile(name).routeHooks || {} ])
    const h1 = hook.Hook({
      handler: ctx => handler.one(name, ctx, { ext: _this.ext, routePrefixs, routeHooks })
    })
    h1.Pre(h.pre)
    h1.Post(h.post)
    h1.Auth(h.auth)
    await h1.R(ctx)
  })

  router.get((function prefix () {
    const routePrefixs = merge.all([ _this.opts.routePrefixs, _this.ext.Profile(name).routePrefixs || {} ])
    return routePrefixs.list(name, _this.opts)
  })(),
  ...middles, async ctx => {
    const routePrefixs = merge.all([ this.opts.routePrefixs, this.ext.Profile(name).routePrefixs || {} ])
    const routeHooks = merge.all([ this.opts.routeHooks, this.ext.Profile(name).routeHooks || {} ])
    const h1 = hook.Hook({
      handler: ctx => handler.list(name, ctx, { ext: _this.ext, routePrefixs, routeHooks })
    })
    h1.Pre(h.pre)
    h1.Post(h.post)
    h1.Auth(h.auth)
    await h1.R(ctx)
  })

  router.post((function prefix () {
    const routePrefixs = merge.all([ _this.opts.routePrefixs, _this.ext.Profile(name).routePrefixs || {} ])
    return routePrefixs.create(name, _this.opts)
  })(),
  ...middles, async ctx => {
    const routePrefixs = merge.all([ this.opts.routePrefixs, this.ext.Profile(name).routePrefixs || {} ])
    const routeHooks = merge.all([ this.opts.routeHooks, this.ext.Profile(name).routeHooks || {} ])
    const h1 = hook.Hook({
      handler: ctx => handler.create(name, ctx, { ext: _this.ext, routePrefixs, routeHooks })
    })
    h1.Pre(h.pre)
    h1.Post(h.post)
    h1.Auth(h.auth)
    await h1.R(ctx)
  })

  router.put((function prefix () {
    const routePrefixs = merge.all([ _this.opts.routePrefixs, _this.ext.Profile(name).routePrefixs || {} ])
    return routePrefixs.update(name, _this.opts)
  })(),
  ...middles, async ctx => {
    const routePrefixs = merge.all([ this.opts.routePrefixs, this.ext.Profile(name).routePrefixs || {} ])
    const routeHooks = merge.all([ this.opts.routeHooks, this.ext.Profile(name).routeHooks || {} ])
    const h1 = hook.Hook({
      handler: ctx => handler.update(name, ctx, { ext: _this.ext, routePrefixs, routeHooks })
    })
    h1.Pre(h.pre)
    h1.Post(h.post)
    h1.Auth(h.auth)
    await h1.R(ctx)
  })

  router.delete((function prefix () {
    const routePrefixs = merge.all([ _this.opts.routePrefixs, _this.ext.Profile(name).routePrefixs || {} ])
    return routePrefixs.delete(name, _this.opts)
  })(),
  ...middles, async ctx => {
    const routePrefixs = merge.all([ this.opts.routePrefixs, this.ext.Profile(name).routePrefixs || {} ])
    const routeHooks = merge.all([ this.opts.routeHooks, this.ext.Profile(name).routeHooks || {} ])
    const h1 = hook.Hook({
      handler: ctx => handler.delete(name, ctx, { ext: _this.ext, routePrefixs, routeHooks })
    })
    h1.Pre(h.pre)
    h1.Post(h.post)
    h1.Auth(h.auth)
    await h1.R(ctx)
  })
  return h
}

// default params
repo.Api.defaultOpts = {
  prefix: 'mgo',
  featurePrefix: '',
  routePrefixs: {
    one: function (name, api = {}) {
      let prefix = ''
      if (api.prefix) {
        prefix = `${prefix}/${api.prefix}`
      }
      if (api.featurePrefix) {
        prefix = `${prefix}/${api.featurePrefix}`
      }
      return `${prefix}/${name}/:id`
    },
    list: function (name, api = {}) {
      let prefix = ''
      if (api.prefix) {
        prefix = `${prefix}/${api.prefix}`
      }
      if (api.featurePrefix) {
        prefix = `${prefix}/${api.featurePrefix}`
      }
      return `${prefix}/${name}`
    },
    create: function (name, api = {}) {
      let prefix = ''
      if (api.prefix) {
        prefix = `${prefix}/${api.prefix}`
      }
      if (api.featurePrefix) {
        prefix = `${prefix}/${api.featurePrefix}`
      }
      return `${prefix}/${name}`
    },
    update: function (name, api = {}) {
      let prefix = ''
      if (api.prefix) {
        prefix = `${prefix}/${api.prefix}`
      }
      if (api.featurePrefix) {
        prefix = `${prefix}/${api.featurePrefix}`
      }
      return `${prefix}/${name}`
    },
    delete: function (name, api = {}) {
      let prefix = ''
      if (api.prefix) {
        prefix = `${prefix}/${api.prefix}`
      }
      if (api.featurePrefix) {
        prefix = `${prefix}/${api.featurePrefix}`
      }
      return `${prefix}/${name}`
    }
  },
  routeHooks: {
    one: {
      cond: async function (cond) {
        return {...cond, _dr: { $ne: true }}
      }
    },
    list: {
      cond: async function (cond) {
        return {...cond, _dr: { $ne: true }}
      }
    },
    create: {
      body: async function (body) {
        return {
          docs: body.docs.map(x => ({
            ...x,
            _dr: false,
            _createdAt: moment().unix()
          })),
          category: body.category
        }
      }
    },
    delete: {
      update: async function (set) {
        return {
          ...set,
          _dr: true,
          _modifiedAt: moment().unix()
        }
      }
    },
    update: {
      body: async function (body) {
        return {
          docs: body.docs.map(x => ({
            ...x,
            _dr: false,
            _modifiedAt: moment().unix()
          })),
          category: body.category
        }
      }
    }
  }
}
