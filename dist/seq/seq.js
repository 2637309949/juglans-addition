"use strict";

// Copyright (c) 2018-2020 Double.  All rights reserved.
// Use of this source code is governed by a MIT style
// license that can be found in the LICENSE file.
const Sequelize = require('sequelize');

const assert = require('assert');

const is = require('is');

const merge = require('deepmerge');

const _ = require('lodash');

const api = require('./api');

const model = require('./model');

const logger = require('../logger');

const repo = module.exports;
repo.Sequelize = Sequelize;
repo.Ext = Ext;
repo.Ext.Model = model;
repo.Ext.defaultConnectOpts = {
  paranoid: true
};

repo.Ext.Connect = function (uri) {
  let opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  opts = merge.all([opts, repo.Ext.defaultConnectOpts]);
  const sequelize = new Sequelize(uri, opts);
  sequelize.authenticate().then(() => {
    logger.info('Connection has been established successfully');
  }).catch(err => {
    logger.error('Unable to connect to the database:', err);
  });
  return new Ext({
    sequelize,
    m: []
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
} // Register model


repo.Ext.prototype.Docs = function () {
  return _.flatMap(this.m, x => x.docs);
}; // Register model and return model


repo.Ext.defaultRegisterOpts = {
  charset: 'utf8',
  collate: 'utf8_general_ci',
  paranoid: true
};

repo.Ext.prototype.Register = function () {
  let schema = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  let opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  assert.ok(is.string(schema.name), 'name can not be empty!');
  assert.ok(is.object(schema.schema), 'schema can not be empty!');
  schema.docs = [];
  this.m.push(schema);
  opts = merge.all([opts, repo.Ext.defaultRegisterOpts]);
  return this.sequelize.define(schema.name, schema.schema, opts);
}; // Register model and return model


repo.Ext.prototype.DefineSchema = function () {
  for (var _len = arguments.length, schema = new Array(_len), _key = 0; _key < _len; _key++) {
    schema[_key] = arguments[_key];
  }

  return Object.assign.apply(Object, [{}, model].concat(schema));
}; // shortcut for sequelize model


repo.Ext.prototype.Model = function (name) {
  return this.sequelize.model(name);
}; // shortcut for sequelize profile


repo.Ext.prototype.Profile = function (name) {
  return this.m.find(x => x.name === name);
}; // set api opts


repo.Ext.prototype.setApiOpts = function () {
  let opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  this.api.setApiOpts(opts);
  return this;
};

repo.Ext.prototype.plugin = function (_ref2) {
  let {
    router
  } = _ref2;

  for (const item of this.m) {
    if (item.autoHook === true || item.autoHook === undefined) {
      this.api.ALL(router, item.name);
    }
  }

  return {
    seqExt: this
  };
};