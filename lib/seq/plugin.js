// Copyright (c) 2018-2020 Double.  All rights reserved.
// Use of this source code is governed by a MIT style
// license that can be found in the LICENSE file.

const moment = require('moment')
const merge = require('deepmerge')

function API (opts = {}, ext) {
  ext = ext || this
  if (!(this instanceof API)) {
    return new API(opts, ext)
  }
  opts = merge.all([ API.defaultOpts, opts ])
  this.opts = opts
  this.ext = ext
}

API.prototype.plugin = function ({ router }) {
  this.ext.api.setAPI(this)
  for (const item of this.ext.m) {
    if (item.autoHook === true || item.autoHook === undefined) {
      this.ext.api.ALL(router, item.name)
    }
  }
}

// DefaultAPI defined a common interface api plugin
API.defaultOpts = {
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

module.exports = API
