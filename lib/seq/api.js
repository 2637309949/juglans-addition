// Copyright (c) 2018-2020 Double.  All rights reserved.
// Use of this source code is governed by a MIT style
// license that can be found in the LICENSE file.

const is = require('is')
const merge = require('deepmerge')

const handler = require('./handler')
const hook = require('./hook')

const repo = module.exports

repo.Api = function ({ ext, API = {} }, opts = {}) {
  if (!(this instanceof repo.Api)) {
    return new repo.Api({ ext, API }, opts)
  }
  this.ext = ext
  this.API = API
  if (is.object(this.API && this.API.opts)) {
    this.opts = merge.all([ repo.Api.defaultOpts, this.API.opts, opts ])
  } else {
    this.opts = merge.all([ repo.Api.defaultOpts, opts ])
  }
}

repo.Api.prototype.Feature = function (opts = { featurePrefix: '/feature' }) {
  if (is.string(opts)) {
    opts = { featurePrefix: `/${opts}` }
  }
  opts.featurePrefix = `${this.opts.featurePrefix}${opts.featurePrefix}`
  return repo.Api({ ext: this.ext, API: this.API }, opts)
}

repo.Api.prototype.Name = function (name) {
  this.opts = merge.all([ this.opts, { featurePrefix: `/${name}` } ])
  return this
}

// set plugin for default params
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
  const h = hook.Hook({})
  const routePrefixs = merge.all([ this.opts.routePrefixs, this.ext.Profile(name).routePrefixs || {} ])
  const routeHooks = merge.all([ this.opts.routeHooks, this.ext.Profile(name).routeHooks || {} ])
  router.get(
    routePrefixs.one(name, this.opts),
    ...middles,
    async ctx => {
      const h1 = hook.Hook({
        handler: ctx => handler.one(name, ctx, { ext: this.ext, routePrefixs, routeHooks })
      })
      h1.Pre(h.pre)
      h1.Post(h.post)
      h1.Auth(h.auth)
      await h1.R(ctx)
    }
  )

  router.get(
    routePrefixs.list(name, this.opts),
    ...middles,
    async ctx => {
      const h1 = hook.Hook({
        handler: ctx => handler.list(name, ctx, { ext: this.ext, routePrefixs, routeHooks })
      })
      h1.Pre(h.pre)
      h1.Post(h.post)
      h1.Auth(h.auth)
      await h1.R(ctx)
    }
  )

  router.post(
    routePrefixs.create(name, this.opts),
    ...middles,
    async ctx => {
      const h1 = hook.Hook({
        handler: ctx => handler.create(name, ctx, { ext: this.ext, routePrefixs, routeHooks })
      })
      h1.Pre(h.pre)
      h1.Post(h.post)
      h1.Auth(h.auth)
      await h1.R(ctx)
    }
  )

  router.put(
    routePrefixs.update(name, this.opts),
    ...middles,
    async ctx => {
      const h1 = hook.Hook({
        handler: ctx => handler.update(name, ctx, { ext: this.ext, routePrefixs, routeHooks })
      })
      h1.Pre(h.pre)
      h1.Post(h.post)
      h1.Auth(h.auth)
      await h1.R(ctx)
    }
  )

  router.delete(
    routePrefixs.delete(name, this.opts),
    ...middles,
    async ctx => {
      const h1 = hook.Hook({
        handler: ctx => handler.delete(name, ctx, { ext: this.ext, routePrefixs, routeHooks })
      })
      h1.Pre(h.pre)
      h1.Post(h.post)
      h1.Auth(h.auth)
      await h1.R(ctx)
    }
  )
  return h
}

// default params
repo.Api.defaultOpts = {
  prefix: '/seq',
  featurePrefix: '',
  routePrefixs: {
    one: function (name, api = {}) {
      let prefix = ''
      if (api.prefix) {
        prefix = `${prefix}${api.prefix}`
      }
      if (api.featurePrefix) {
        prefix = `${prefix}${api.featurePrefix}`
      }
      return `${prefix}/${name}/:id`
    },
    list: function (name, api = {}) {
      let prefix = ''
      if (api.prefix) {
        prefix = `${prefix}${api.prefix}`
      }
      if (api.featurePrefix) {
        prefix = `${prefix}${api.featurePrefix}`
      }
      return `${prefix}/${name}`
    },
    create: function (name, api = {}) {
      let prefix = ''
      if (api.prefix) {
        prefix = `${prefix}${api.prefix}`
      }
      if (api.featurePrefix) {
        prefix = `${prefix}${api.featurePrefix}`
      }
      return `${prefix}/${name}`
    },
    update: function (name, api = {}) {
      let prefix = ''
      if (api.prefix) {
        prefix = `${prefix}${api.prefix}`
      }
      if (api.featurePrefix) {
        prefix = `${prefix}${api.featurePrefix}`
      }
      return `${prefix}/${name}`
    },
    delete: function (name, api = {}) {
      let prefix = ''
      if (api.prefix) {
        prefix = `${prefix}${api.prefix}`
      }
      if (api.featurePrefix) {
        prefix = `${prefix}${api.featurePrefix}`
      }
      return `${prefix}/${name}`
    }
  },
  routeHooks: {
    one: {
      cond: async function (cond) {
        return {...cond, deletedAt: null}
      }
    },
    list: {
      cond: async function (cond) {
        return {...cond, deletedAt: null}
      }
    },
    create: {
      body: async function (body) {
        return {
          docs: body.docs.map(x => ({
            ...x
          })),
          category: body.category
        }
      }
    },
    delete: {
      update: async function (set) {
        return {
          ...set,
          deletedAt: new Date()
        }
      }
    },
    update: {
      body: async function (body) {
        return {
          docs: body.docs.map(x => ({
            ...x
          })),
          category: body.category
        }
      }
    }
  }
}
