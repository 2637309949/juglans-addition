// Copyright (c) 2018-2020 Double.  All rights reserved.
// Use of this source code is governed by a MIT style
// license that can be found in the LICENSE file.

const Sequelize = require('sequelize')
const assert = require('assert')
const is = require('is')
const merge = require('deepmerge')
const api = require('./api')
const API = require('./plugin')
const model = require('./model')
const logger = require('../logger')

const repo = module.exports

// Sequelize export
repo.Sequelize = Sequelize

// Sequelize Ext export
repo.Ext = Ext

// Model
Ext.Model = model

// Connect defined connect func
Ext.Connect = function (uri, opts) {
  const sequelize = new Sequelize(uri, opts)
  sequelize.authenticate()
    .then(() => {
      logger.info('Connection has been established successfully')
    })
    .catch(err => {
      logger.error('Unable to connect to the database:', err)
    })
  return new Ext({ sequelize })
}

// Ext defined for Sequelize ext
function Ext ({ m, sequelize }) {
  if (!(this instanceof Ext)) {
    return new Ext({})
  }
  this.sequelize = sequelize
  this.m = m || []
  this.api = api.Api({ ext: this })
  this.apifeature1 = api.Api({ ext: this }, { featurePrefix: 'feature1' })
  this.apifeature2 = api.Api({ ext: this }, { featurePrefix: 'feature2' })
  this.apifeature3 = api.Api({ ext: this }, { featurePrefix: 'feature3' })
  this.apifeature4 = api.Api({ ext: this }, { featurePrefix: 'feature4' })
  this.apifeature5 = api.Api({ ext: this }, { featurePrefix: 'feature5' })
  this.apifeature6 = api.Api({ ext: this }, { featurePrefix: 'feature6' })
  this.apifeature7 = api.Api({ ext: this }, { featurePrefix: 'feature7' })
  this.apifeature8 = api.Api({ ext: this }, { featurePrefix: 'feature8' })
  this.apifeature9 = api.Api({ ext: this }, { featurePrefix: 'feature9' })
  this.apifeature10 = api.Api({ ext: this }, { featurePrefix: 'feature10' })
  this.apifeature11 = api.Api({ ext: this }, { featurePrefix: 'feature11' })
  this.apifeature12 = api.Api({ ext: this }, { featurePrefix: 'feature12' })
  this.apifeature13 = api.Api({ ext: this }, { featurePrefix: 'feature13' })
  this.apifeature14 = api.Api({ ext: this }, { featurePrefix: 'feature14' })
  this.apifeature15 = api.Api({ ext: this }, { featurePrefix: 'feature15' })
}

// merge routeHooks
Ext.prototype.RouteHooks = function (name, api) {
  const profile = this.m.find(x => x.name === name)
  return merge.all([ (profile && profile.routeHooks) || {}, (api && api.routeHooks) || {} ])
}

// Register model and return model
Ext.prototype.Register = function (schema = {}) {
  assert.ok(is.string(schema.name), 'name can not be empty!')
  assert.ok(is.object(schema.schema), 'schema can not be empty!')
  this.m.push(schema)
  return this.sequelize.define(schema.name, schema.schema, schema.opts || {})
}

// shortcut for sequelize model
Ext.prototype.Model = function (name) {
  return this.sequelize.model(name)
}

// shortcut for sequelize profile
Ext.prototype.Profile = function (name) {
  return this.m.find(x => x.name === name)
}

// API defined default api list
Ext.prototype.API = API
