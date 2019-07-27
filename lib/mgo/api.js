// Copyright (c) 2018-2020 Double.  All rights reserved.
// Use of this source code is governed by a MIT style
// license that can be found in the LICENSE file.

const is = require('is')
const merge = require('deepmerge')
const doc = require('./doc')
const _ = require('lodash')

const hook = require('./hook')
const handler = require('./handler')

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
  opts.prefix = this.opts.prefix
  opts.featurePrefix = `${this.opts.featurePrefix}${opts.featurePrefix}`
  return repo.Api({ ext: this.ext }, opts)
}

repo.Api.prototype.Name = function (name) {
  this.opts = merge.all([ this.opts, { featurePrefix: `/${name}` } ])
  return this
}

repo.Api.prototype.One = function (router, name, ...middles) {
  const profile = this.ext.Profile(name)
  const opts = merge.all([ this.opts, _.get(profile, 'opts', {}) ])
  const optHook = opts.routeHooks.one
  const h = hook.Hook({
    pre: optHook.pre,
    post: optHook.post,
    auth: optHook.auth,
    routeHooks: hooks => { opts.routeHooks = merge.all([ opts.routeHooks, hooks ]) },
    handler: ctx => handler.one(name, ctx, this.ext, opts)
  })
  middles.push(h.R)
  router.get(opts.routePrefixs.one(name, opts), ...middles)
  profile.docs = profile.docs.concat(doc.GenDoc({ profile, opts, apis: ['one'] }))
  return h
}

repo.Api.prototype.List = function (router, name, ...middles) {
  const profile = this.ext.Profile(name)
  const opts = merge.all([ this.opts, _.get(profile, 'opts', {}) ])
  const optHook = opts.routeHooks.list
  const h = hook.Hook({
    pre: optHook.pre,
    post: optHook.post,
    auth: optHook.auth,
    routeHooks: hooks => { opts.routeHooks = merge.all([ opts.routeHooks, hooks ]) },
    handler: ctx => handler.list(name, ctx, this.ext, opts)
  })
  middles.push(h.R)
  router.get(opts.routePrefixs.list(name, opts), ...middles)
  profile.docs = profile.docs.concat(doc.GenDoc({ profile, opts, apis: ['list'] }))
  return h
}

repo.Api.prototype.Create = function (router, name, ...middles) {
  const profile = this.ext.Profile(name)
  const opts = merge.all([ this.opts, _.get(profile, 'opts', {}) ])
  const optHook = opts.routeHooks.create
  const h = hook.Hook({
    pre: optHook.pre,
    post: optHook.post,
    auth: optHook.auth,
    routeHooks: hooks => { opts.routeHooks = merge.all([ opts.routeHooks, hooks ]) },
    handler: ctx => handler.create(name, ctx, this.ext, opts)
  })
  middles.push(h.R)
  router.post(opts.routePrefixs.create(name, opts), ...middles)
  profile.docs = profile.docs.concat(doc.GenDoc({ profile, opts, apis: ['create'] }))
  return h
}

repo.Api.prototype.Update = function (router, name, ...middles) {
  const profile = this.ext.Profile(name)
  const opts = merge.all([ this.opts, _.get(profile, 'opts', {}) ])
  const optHook = opts.routeHooks.update
  const h = hook.Hook({
    pre: optHook.pre,
    post: optHook.post,
    auth: optHook.auth,
    routeHooks: hooks => { opts.routeHooks = merge.all([ opts.routeHooks, hooks ]) },
    handler: ctx => handler.update(name, ctx, this.ext, opts)
  })
  middles.push(h.R)
  router.put(opts.routePrefixs.update(name, opts), ...middles)
  profile.docs = profile.docs.concat(doc.GenDoc({ profile, opts, apis: ['update'] }))
  return h
}

repo.Api.prototype.Delete = function (router, name, ...middles) {
  const profile = this.ext.Profile(name)
  const opts = merge.all([ this.opts, _.get(profile, 'opts', {}) ])
  const optHook = opts.routeHooks.delete
  const h = hook.Hook({
    pre: optHook.pre,
    post: optHook.post,
    auth: optHook.auth,
    routeHooks: hooks => { opts.routeHooks = merge.all([ opts.routeHooks, hooks ]) },
    handler: ctx => handler.delete(name, ctx, this.ext, opts)
  })
  middles.push(h.R)
  router.delete(opts.routePrefixs.delete(name, opts), ...middles)
  profile.docs = profile.docs.concat(doc.GenDoc({ profile, opts, apis: ['delete'] }))
  return h
}

repo.Api.prototype.ALL = function (router, name, ...middles) {
  const profile = this.ext.Profile(name)
  const opts = merge.all([ this.opts, _.get(profile, 'opts', {}) ])
  const h = hook.Hook({
    routeHooks: hooks => { opts.routeHooks = merge.all([ opts.routeHooks, hooks ]) }
  })
  router.get(
    opts.routePrefixs.one(name, opts),
    ...middles,
    async ctx => {
      const optHook = opts.routeHooks.one
      const h1 = hook.Hook({
        pre: optHook.pre,
        post: optHook.post,
        auth: optHook.auth,
        routeHooks: hooks => { opts.routeHooks = merge.all([ opts.routeHooks, hooks ]) },
        handler: ctx => handler.one(name, ctx, this.ext, opts)
      })
      h1.Pre(h.pre)
      h1.Post(h.post)
      h1.Auth(h.auth)
      await h1.R(ctx)
    }
  )

  router.get(
    opts.routePrefixs.list(name, this.opts),
    ...middles,
    async ctx => {
      const optHook = opts.routeHooks.list
      const h1 = hook.Hook({
        pre: optHook.pre,
        post: optHook.post,
        auth: optHook.auth,
        routeHooks: hooks => { opts.routeHooks = merge.all([ opts.routeHooks, hooks ]) },
        handler: ctx => handler.list(name, ctx, this.ext, opts)
      })
      h1.Pre(h.pre)
      h1.Post(h.post)
      h1.Auth(h.auth)
      await h1.R(ctx)
    }
  )

  router.post(
    opts.routePrefixs.create(name, this.opts),
    ...middles,
    async ctx => {
      const optHook = opts.routeHooks.create
      const h1 = hook.Hook({
        pre: optHook.pre,
        post: optHook.post,
        auth: optHook.auth,
        routeHooks: hooks => { opts.routeHooks = merge.all([ opts.routeHooks, hooks ]) },
        handler: ctx => handler.create(name, ctx, this.ext, opts)
      })
      h1.Pre(h.pre)
      h1.Post(h.post)
      h1.Auth(h.auth)
      await h1.R(ctx)
    }
  )

  router.put(
    opts.routePrefixs.update(name, this.opts),
    ...middles,
    async ctx => {
      const optHook = opts.routeHooks.update
      const h1 = hook.Hook({
        pre: optHook.pre,
        post: optHook.post,
        auth: optHook.auth,
        routeHooks: hooks => { opts.routeHooks = merge.all([ opts.routeHooks, hooks ]) },
        handler: ctx => handler.update(name, ctx, this.ext, opts)
      })
      h1.Pre(h.pre)
      h1.Post(h.post)
      h1.Auth(h.auth)
      await h1.R(ctx)
    }
  )

  router.delete(
    opts.routePrefixs.delete(name, opts),
    ...middles,
    async ctx => {
      const optHook = opts.routeHooks.delete
      const h1 = hook.Hook({
        pre: optHook.pre,
        post: optHook.post,
        auth: optHook.auth,
        routeHooks: hooks => { opts.routeHooks = merge.all([ opts.routeHooks, hooks ]) },
        handler: ctx => handler.delete(name, ctx, this.ext, opts)
      })
      h1.Pre(h.pre)
      h1.Post(h.post)
      h1.Auth(h.auth)
      await h1.R(ctx)
    }
  )
  profile.docs = profile.docs.concat(doc.GenDoc({ profile, opts, apis: ['one', 'list', 'create', 'update', 'delete'] }))
  return h
}

// default params
repo.Api.defaultOpts = {
  prefix: '/mgo',
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
      return `${prefix}/${name.toLowerCase()}/:id`
    },
    list: function (name, api = {}) {
      let prefix = ''
      if (api.prefix) {
        prefix = `${prefix}${api.prefix}`
      }
      if (api.featurePrefix) {
        prefix = `${prefix}${api.featurePrefix}`
      }
      return `${prefix}/${name.toLowerCase()}`
    },
    create: function (name, api = {}) {
      let prefix = ''
      if (api.prefix) {
        prefix = `${prefix}${api.prefix}`
      }
      if (api.featurePrefix) {
        prefix = `${prefix}${api.featurePrefix}`
      }
      return `${prefix}/${name.toLowerCase()}`
    },
    update: function (name, api = {}) {
      let prefix = ''
      if (api.prefix) {
        prefix = `${prefix}${api.prefix}`
      }
      if (api.featurePrefix) {
        prefix = `${prefix}${api.featurePrefix}`
      }
      return `${prefix}/${name.toLowerCase()}`
    },
    delete: function (name, api = {}) {
      let prefix = ''
      if (api.prefix) {
        prefix = `${prefix}${api.prefix}`
      }
      if (api.featurePrefix) {
        prefix = `${prefix}${api.featurePrefix}`
      }
      return `${prefix}/${name.toLowerCase()}`
    }
  },
  routeHooks: {
    one: {
      cond: async function (cond, ctx, opts) {
        return cond
      }
    },
    list: {
      cond: async function (cond, ctx, opts) {
        return cond
      }
    },
    create: {
      form: async function (form, ctx, opts) {
        return form
      }
    },
    delete: {
      form: async function (form, ctx, opts) {
        return form
      },
      cond: async function (cond, ctx, opts) {
        return cond
      }
    },
    update: {
      form: async function (form, ctx, opts) {
        return form
      },
      cond: async function (cond, ctx, opts) {
        return cond
      }
    }
  }
}
