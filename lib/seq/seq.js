// Copyright (c) 2018-2020 Double.  All rights reserved.
// Use of this source code is governed by a MIT style
// license that can be found in the LICENSE file.

const Sequelize = require('sequelize')
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

const Op = Sequelize.Op
const operatorsAliases = {
  $eq: Op.eq,
  $ne: Op.ne,
  $gte: Op.gte,
  $gt: Op.gt,
  $lte: Op.lte,
  $lt: Op.lt,
  $not: Op.not,
  $in: Op.in,
  $notIn: Op.notIn,
  $is: Op.is,
  $like: Op.like,
  $notLike: Op.notLike,
  $iLike: Op.iLike,
  $notILike: Op.notILike,
  $regexp: Op.regexp,
  $and: Op.and,
  $or: Op.or,
  $any: Op.any
}

repo.Ext.defaultOpts = { operatorsAliases, paranoid: true }
repo.Ext.Connect = function (uri, opts = {}) {
  opts = merge.all([Ext.defaultOpts, opts])
  const sequelize = new Sequelize(uri, opts)
  sequelize.authenticate()
    .then(() => {
      logger.info('Connection has been established successfully')
    })
    .catch(err => {
      logger.error('Unable to connect to the database:', err)
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

// Register model and return model
repo.Ext.prototype.Register = function (schema = {}, opts = {}) {
  assert.ok(is.string(schema.name), 'name can not be empty!')
  assert.ok(is.object(schema.schema), 'schema can not be empty!')
  schema.docs = []
  this.m.push(schema)
  opts = merge.all([{ charset: 'utf8', collate: 'utf8_general_ci', paranoid: true }, opts])
  return this.sequelize.define(schema.name, schema.schema, opts)
}

// Register model and return model
repo.Ext.prototype.DefineSchema = function (...schema) {
  return Object.assign({}, model, ...schema)
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
    if (item.autoHook === true || item.autoHook === undefined) {
      this.api.ALL(router, item.name)
    }
  }
  return { seqExt: this }
}
