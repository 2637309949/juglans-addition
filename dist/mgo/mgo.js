"use strict";

// Copyright (c) 2018-2020 Double.  All rights reserved.
// Use of this source code is governed by a MIT style
// license that can be found in the LICENSE file.
const mongoose = require('mongoose');

const assert = require('assert');

const is = require('is');

const merge = require('deepmerge');

const _ = require('lodash');

const api = require('./api');

const model = require('./model');

const logger = require('../logger');

const repo = module.exports;
repo.mongoose = mongoose;
repo.Ext = Ext;
repo.Ext.Model = model; // Connect defined connect func

repo.Ext.defaultConnectOpts = {};

repo.Ext.Connect = function (uri) {
  let opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  opts = merge.all([opts, repo.Ext.defaultConnectOpts]);
  const mgo = mongoose.createConnection(uri, opts);
  mgo.on('connected', function (ref) {
    logger.info('mongo:Connection has been established successfully');
  });
  mgo.on('error', function (err) {
    logger.error('mongo:Failed to established', err);
  });
  return new Ext({
    mgo
  });
}; // Ext defined for Sequelize ext


function Ext(_ref) {
  let {
    m,
    mgo
  } = _ref;

  if (!(this instanceof Ext)) {
    return new Ext({});
  }

  this.mgo = mgo;
  this.m = m || [];
  this.api = api.Api({
    ext: this
  });
} // Register model


repo.Ext.prototype.Docs = function () {
  return _.flatMap(this.m, x => x.docs);
};

repo.Ext.prototype.Init = function (init) {
  assert.ok(is.function(init), 'init can not be empty!');
  init(this);
  return this;
}; // Register model


repo.Ext.prototype.Register = function () {
  var _this$mgo;

  let schema = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  let opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  assert.ok(is.string(schema.name), 'name can not be empty!');
  assert.ok(is.object(schema.schema), 'schema can not be empty!');
  schema.docs = [];
  const optsList = [];

  if (opts.collection) {
    optsList.push(opts.collection);
  }

  if (opts.skipInit) {
    if (!opts.collection) {
      optsList.push(null);
    }

    optsList.push(opts.skipInit);
  }

  this.m.push(schema);

  (_this$mgo = this.mgo).model.apply(_this$mgo, [schema.name, schema.schema].concat(optsList));

  return this;
}; // Register model and return model


repo.Ext.defaultSchemaOpts = {
  timestamps: {
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  }
};

repo.Ext.prototype.Schema = function (schema) {
  let opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  return new mongoose.Schema(schema, merge.all([opts, repo.Ext.defaultSchemaOpts]));
}; // shortcut for sequelize model


repo.Ext.prototype.Model = function (name) {
  return this.mgo.model(name);
}; // shortcut for sequelize profile


repo.Ext.prototype.Profile = function (name) {
  return this.m.find(x => x.name === name);
}; // set api opts


repo.Ext.prototype.setApiOpts = function () {
  let opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  this.api.setApiOpts(opts);
  return this;
}; // plugin for juglans


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
    mgoExt: this
  };
};