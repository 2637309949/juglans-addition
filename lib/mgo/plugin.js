// Copyright (c) 2018-2020 Double.  All rights reserved.
// Use of this source code is governed by a MIT style
// license that can be found in the LICENSE file.

const moment = require('moment')
const merge = require('deepmerge')

function DefaultAPI (params = {}) {
  if (!(this instanceof DefaultAPI)) {
    return new DefaultAPI(params)
  }
  params = merge.all([ params, DefaultAPI.defaultParams ])
  this.routeHooks = params.routeHooks
}

DefaultAPI.prototype.plugin = function ({ router }) {
  for (const item of DefaultAPI.mongoose.ext.m) {
    if (item.autoHook === true || item.autoHook === undefined) {
      DefaultAPI.mongoose.ext.api.setDefaultAPI(this)
      DefaultAPI.mongoose.ext.api.ALL(router, item.name)
    }
  }
}

// DefaultAPI defined a common interface api plugin
DefaultAPI.defaultParams = {
  routeHooks: {
    one: {
      cond: async function (cond) {
        return {...cond, _dr: false}
      }
    },
    list: {
      cond: async function (cond) {
        return {...cond, _dr: false}
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

module.exports = DefaultAPI
