"use strict";

// Copyright (c) 2018-2020 Double.  All rights reserved.
// Use of this source code is governed by a MIT style
// license that can be found in the LICENSE file.
const is = require('is');

const utils = require('./utils');

const logger = require('../logger');

function Query(_ref) {
  let {
    cond = '%7B%7D',
    sort = '-_createdAt',
    project = '',
    preload = '',
    page = 1,
    size = 20,
    range = 'PAGE'
  } = _ref;

  if (!(this instanceof Query)) {
    return new Query({
      cond,
      sort,
      project,
      preload,
      page,
      size,
      range
    });
  }

  try {
    this.query = {
      cond,
      sort,
      project,
      preload,
      page,
      size,
      range
    };
    this.cond = {};
    this.operators = {};
    this.sort = {};
    this.project = [];
    this.preload = [];
    this.page = parseInt(page);
    this.size = parseInt(size);
    this.range = range === 'ALL' ? 'ALL' : 'PAGE';
  } catch (error) {
    logger.error(error.stack || error.message);
    throw error;
  }
}

Query.prototype.build = function (_ref2) {
  let {
    model
  } = _ref2;
  this.page = this.query.page;
  this.size = this.query.size;
  this.range = this.query.range;
  this.buildCond();
  this.toOperators();
  this.buildSort();
  this.buildProject();
  this.buildPreload(model);
  return this;
};

Query.prototype.toOperators = function () {
  try {
    this.operators = utils.toOperators(this.cond);
  } catch (error) {
    logger.error(error.stack || error.message);
    throw error;
  }
};

Query.prototype.buildCond = function () {
  try {
    if (is.string(this.query.cond)) {
      this.cond = JSON.parse(decodeURIComponent(this.query.cond));
    }
  } catch (error) {
    logger.error(error.stack || error.message);
    throw error;
  }
};

Query.prototype.buildSort = function () {
  if (this.query.sort && this.query.sort.trim()) {
    this.sort = this.query.sort.trim().split(',').filter(x => !!x).map(x => x.trim()).reduce((acc, curr) => {
      let order = 1;

      if (curr.startsWith('-')) {
        curr = curr.substr(1);
        order = -1;
      }

      acc[curr] = order;
      return acc;
    }, {});
  }
};

Query.prototype.buildProject = function () {
  if (this.query.project && this.query.project.trim()) {
    this.project = this.query.project.trim().split(',').filter(x => !!x).map(x => x.trim());
  }
};

Query.prototype.buildPreload = function (model) {
  if (this.query.preload && this.query.preload.trim()) {
    const associations = utils.associations(model);
    this.preload = this.query.preload.trim().split(',').filter(x => !!x).map(x => x.trim()).map(x => {
      return associations.find(as => as.as === x);
    }).filter(x => !!x).map(x => ({
      model: x.model,
      as: x.as
    }));
  }
};

module.exports = Query;