// Copyright (c) 2018-2020 Double.  All rights reserved.
// Use of this source code is governed by a MIT style
// license that can be found in the LICENSE file.

const Sequelize = require('sequelize')
const pluralize = require('pluralize')
const assert = require('assert')
const is = require('is')
const merge = require('deepmerge')
const _ = require('lodash')
const api = require('./api')
const model = require('./model')
const logger = require('../logger')

const repo = module.exports

repo.Sequelize = Sequelize
repo.Ext = Ext
repo.Ext.Model = model

repo.Ext.defaultConnectOpts = { paranoid: true }
repo.Ext.Connect = function (uri, opts = {}) {
  opts = merge.all([opts, repo.Ext.defaultConnectOpts])
  const sequelize = new Sequelize(uri, opts)
  sequelize.authenticate()
    .then(() => {
      logger.info('seq:Connection has been established successfully')
    })
    .catch(err => {
      logger.error('seq:Failed to established', err)
    })
  return new Ext({ sequelize, m: [] })
}

// Ext defined for Sequelize ext
function Ext ({ m, sequelize }) {
  if (!(this instanceof Ext)) {
    return new Ext({})
  }
  this.sequelize = sequelize
  this.m = m || []
  this.api = api.Api({ ext: this })
}

// Register model
repo.Ext.prototype.Docs = function () {
  return _.flatMap(this.m, x => x.docs)
}

repo.Ext.prototype.Init = function (init) {
  assert.ok(is.function(init), 'init can not be empty!')
  init(this)
  return this
}

// Register model and return model
repo.Ext.defaultRegisterOpts = { charset: 'utf8', collate: 'utf8_general_ci', paranoid: true }
repo.Ext.prototype.Register = function (schema = {}, opts = {}) {
  assert.ok(is.string(schema.name), 'name can not be empty!')
  assert.ok(is.object(schema.schema), 'schema can not be empty!')
  schema.docs = []
  this.m.push(schema)
  opts = merge.all([opts, repo.Ext.defaultRegisterOpts])
  if (!opts.tableName) {
    opts.tableName = pluralize(schema.name.toLowerCase())
  }
  this.sequelize.define(schema.name, schema.schema, opts)
  return this
}

// Register model and return model
repo.Ext.prototype.Schema = function (schema, opts = {}) {
  return _.assign(schema)
}

// shortcut for sequelize model
repo.Ext.prototype.Model = function (name) {
  return this.sequelize.model(name)
}

// shortcut for sequelize profile
repo.Ext.prototype.Profile = function (name) {
  return this.m.find(x => x.name === name)
}

// set api opts
repo.Ext.prototype.setApiOpts = function (opts = {}) {
  this.api.setApiOpts(opts)
  return this
}

repo.Ext.prototype.plugin = function ({ router }) {
  for (const item of this.m) {
    if (item.autoHook) {
      this.api.ALL(router, item.name)
    }
  }
  return { seqExt: this }
}
