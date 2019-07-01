// Copyright (c) 2018-2020 Double.  All rights reserved.
// Use of this source code is governed by a MIT style
// license that can be found in the LICENSE file.

const is = require('is')
const merge = require('deepmerge')
const _ = require('lodash')

const handler = require('./handler')
const hook = require('./hook')

const repo = module.exports

repo.Api = function ({ ext }, opts = {}) {
  if (!(this instanceof repo.Api)) {
    return new repo.Api({ ext }, opts)
  }
  this.ext = ext
  this.opts = merge.all([ repo.Api.defaultOpts, opts ])
}

repo.Api.prototype.setApiOpts = function (opts = {}) {
  this.opts = merge.all([ this.opts, opts ])
  return this
}

repo.Api.prototype.Feature = function (opts = { featurePrefix: '/feature' }) {
  if (is.string(opts)) {
    opts = { featurePrefix: `/${opts}` }
  }
  opts.featurePrefix = `${this.opts.featurePrefix}${opts.featurePrefix}`
  return repo.Api({ ext: this.ext }, opts)
}

repo.Api.prototype.Name = function (name) {
  this.opts = merge.all([ this.opts, { featurePrefix: `/${name}` } ])
  return this
}

repo.Api.prototype.One = function (router, name, ...middles) {
  const profile = this.ext.Profile(name)
  const { routePrefixs, routeHooks } = merge.all([ this.opts, _.get(profile, 'opts', {}) ])
  const optHook = routeHooks.one
  const h = hook.Hook({
    pre: optHook.pre,
    post: optHook.post,
    auth: optHook.auth,
    handler: ctx => handler.one(name, ctx, { ext: this.ext, routePrefixs, routeHooks })
  })
  middles.push(h.R)
  router.get(routePrefixs.one(name, this.opts), ...middles)
  return h
}

repo.Api.prototype.List = function (router, name, ...middles) {
  const profile = this.ext.Profile(name)
  const { routePrefixs, routeHooks } = merge.all([ this.opts, _.get(profile, 'opts', {}) ])
  const optHook = routeHooks.list
  const h = hook.Hook({
    pre: optHook.pre,
    post: optHook.post,
    auth: optHook.auth,
    handler: ctx => handler.list(name, ctx, { ext: this.ext, routePrefixs, routeHooks })
  })
  middles.push(h.R)
  router.get(routePrefixs.list(name, this.opts), ...middles)
  return h
}

repo.Api.prototype.Create = function (router, name, ...middles) {
  const profile = this.ext.Profile(name)
  const { routePrefixs, routeHooks } = merge.all([ this.opts, _.get(profile, 'opts', {}) ])
  const optHook = routeHooks.create
  const h = hook.Hook({
    pre: optHook.pre,
    post: optHook.post,
    auth: optHook.auth,
    handler: ctx => handler.create(name, ctx, { ext: this.ext, routePrefixs, routeHooks })
  })
  middles.push(h.R)
  router.post(routePrefixs.create(name, this.opts), ...middles)
  return h
}

repo.Api.prototype.Update = function (router, name, ...middles) {
  const profile = this.ext.Profile(name)
  const { routePrefixs, routeHooks } = merge.all([ this.opts, _.get(profile, 'opts', {}) ])
  const optHook = routeHooks.update
  const h = hook.Hook({
    pre: optHook.pre,
    post: optHook.post,
    auth: optHook.auth,
    handler: ctx => handler.update(name, ctx, { ext: this.ext, routePrefixs, routeHooks })
  })
  middles.push(h.R)
  router.put(routePrefixs.update(name, this.opts), ...middles)
  return h
}

repo.Api.prototype.Delete = function (router, name, ...middles) {
  const profile = this.ext.Profile(name)
  const { routePrefixs, routeHooks } = merge.all([ this.opts, _.get(profile, 'opts', {}) ])
  const optHook = routeHooks.delete
  const h = hook.Hook({
    pre: optHook.pre,
    post: optHook.post,
    auth: optHook.auth,
    handler: ctx => handler.delete(name, ctx, { ext: this.ext, routePrefixs, routeHooks })
  })
  middles.push(h.R)
  router.delete(routePrefixs.delete(name, this.opts), ...middles)
  return h
}

repo.Api.prototype.ALL = function (router, name, ...middles) {
  const profile = this.ext.Profile(name)
  const { routePrefixs, routeHooks } = merge.all([ this.opts, _.get(profile, 'opts', {}) ])
  const h = hook.Hook({})
  router.get(
    routePrefixs.one(name, this.opts),
    ...middles,
    async ctx => {
      const optHook = routeHooks.one
      const h1 = hook.Hook({
        pre: optHook.pre,
        post: optHook.post,
        auth: optHook.auth,
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
      const optHook = routeHooks.list
      const h1 = hook.Hook({
        pre: optHook.pre,
        post: optHook.post,
        auth: optHook.auth,
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
      const optHook = routeHooks.create
      const h1 = hook.Hook({
        pre: optHook.pre,
        post: optHook.post,
        auth: optHook.auth,
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
      const optHook = routeHooks.update
      const h1 = hook.Hook({
        pre: optHook.pre,
        post: optHook.post,
        auth: optHook.auth,
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
      const optHook = routeHooks.delete
      const h1 = hook.Hook({
        pre: optHook.pre,
        post: optHook.post,
        auth: optHook.auth,
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
