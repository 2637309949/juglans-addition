"use strict";

// Copyright (c) 2018-2020 Double.  All rights reserved.
// Use of this source code is governed by a MIT style
// license that can be found in the LICENSE file.
const Sequelize = require('sequelize');

const assert = require('assert');

const is = require('is');

const merge = require('deepmerge');

const api = require('./api');

const API = require('./plugin');

const model = require('./model');

const logger = require('../logger');

const repo = module.exports; // Sequelize export

repo.Sequelize = Sequelize; // Sequelize Ext export

repo.Ext = Ext; // Model

Ext.Model = model; // Connect defined connect func

Ext.Connect = function (uri, opts) {
  const sequelize = new Sequelize(uri, opts);
  sequelize.authenticate().then(() => {
    logger.info('Connection has been established successfully');
  }).catch(err => {
    logger.error('Unable to connect to the database:', err);
  });
  return new Ext({
    sequelize
  });
}; // Ext defined for Sequelize ext


function Ext(_ref) {
  let {
    m,
    sequelize
  } = _ref;

  if (!(this instanceof Ext)) {
    return new Ext({});
  }

  this.sequelize = sequelize;
  this.m = m || [];
  this.api = api.Api({
    ext: this
  });
} // merge routeHooks


Ext.prototype.RouteHooks = function (name, api) {
  const profile = this.m.find(x => x.name === name);
  return merge.all([profile && profile.routeHooks || {}, api && api.routeHooks || {}]);
}; // Register model and return model


Ext.prototype.Register = function () {
  let schema = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  assert.ok(is.string(schema.name), 'name can not be empty!');
  assert.ok(is.object(schema.schema), 'schema can not be empty!');
  this.m.push(schema);
  return this.sequelize.define(schema.name, schema.schema, schema.opts || {});
}; // shortcut for sequelize model


Ext.prototype.Model = function (name) {
  return this.sequelize.model(name);
}; // shortcut for sequelize profile


Ext.prototype.Profile = function (name) {
  return this.m.find(x => x.name === name);
}; // API defined default api list


Ext.prototype.API = API;