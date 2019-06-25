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
  prefix: 'seq',
  routePrefixs: {
    one: function (name, opts = {}) {
      if (opts.prefix) {
        return `/${opts.prefix}/${name}/:id`
      }
      return `/${name}/:id`
    },
    list: function (name, opts = {}) {
      if (opts.prefix) {
        return `/${opts.prefix}/${name}`
      }
      return `/${name}`
    },
    create: function (name, opts = {}) {
      if (opts.prefix) {
        return `/${opts.prefix}/${name}`
      }
      return `/${name}`
    },
    update: function (name, opts = {}) {
      if (opts.prefix) {
        return `/${opts.prefix}/${name}`
      }
      return `/${name}`
    },
    delete: function (name, opts = {}) {
      if (opts.prefix) {
        return `/${opts.prefix}/${name}`
      }
      return `/${name}`
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

module.exports = API
