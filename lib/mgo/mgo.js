// Copyright (c) 2018-2020 Double.  All rights reserved.
// Use of this source code is governed by a MIT style
// license that can be found in the LICENSE file.

const mongoose = require('mongoose')
const assert = require('assert')
const is = require('is')
const merge = require('deepmerge')
const api = require('./api')
const model = require('./model')
const API = require('./plugin')

const repo = module.exports

repo.mongoose = mongoose

repo.Ext = Ext

Ext.Model = model

// Connect defined connect func
Ext.Connect = function (uri, opts) {
  const mgo = mongoose.createConnection(uri, opts)
  return new Ext({ mgo })
}

// Ext defined for Sequelize ext
function Ext ({ m, mgo }) {
  if (!(this instanceof Ext)) {
    return new Ext({})
  }
  this.mgo = mgo
  this.m = m || []
  this.api = api.Api({ ext: this })
}

// merge routeHooks
Ext.prototype.RouteHooks = function (name, api) {
  const profile = this.Profile(name)
  return merge.all([ (profile && profile.routeHooks) || {}, (api && api.routeHooks) || {} ])
}

// Register model
Ext.prototype.Register = function (schema = {}) {
  assert.ok(is.string(schema.name), 'name can not be empty!')
  assert.ok(is.object(schema.schema), 'schema can not be empty!')
  this.m.push(schema)
  return this.mgo.model(schema.name, schema.schema)
}

// shortcut for sequelize model
Ext.prototype.Model = function (name) {
  return this.mgo.model(name)
}

// shortcut for sequelize profile
Ext.prototype.Profile = function (name) {
  return this.m.find(x => x.name === name)
}

// API defined default api list
Ext.prototype.API = API
