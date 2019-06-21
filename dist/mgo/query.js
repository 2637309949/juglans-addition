"use strict";

// Copyright (c) 2018-2020 Double.  All rights reserved.
// Use of this source code is governed by a MIT style
// license that can be found in the LICENSE file.
const is = require('is');

function Query(_ref) {
  let {
    cond = '%7B%7D',
    sort = '-_createdAt',
    project = '',
    populate = '',
    page = 1,
    size = 20,
    range = 'PAGE'
  } = _ref;

  if (!(this instanceof Query)) {
    return new Query({
      cond,
      sort,
      project,
      populate,
      page,
      size,
      range
    });
  }

  this.cond = cond;
  this.sort = sort;
  this.project = project;
  this.populate = populate;
  this.page = parseInt(page);
  this.size = parseInt(size);
  this.range = range === 'ALL' ? 'ALL' : 'PAGE';
}

Query.prototype.buildCond = function () {
  try {
    if (is.string(this.cond)) {
      return JSON.parse(decodeURIComponent(this.cond));
    }

    return {};
  } catch (error) {
    console.error('parse cond error!');
    throw error;
  }
};

Query.prototype.buildSort = function () {
  if (!this.sort || !this.sort.trim()) return {};
  return this.sort.trim().split(',').filter(x => !!x).map(x => x.trim()).reduce((acc, curr) => {
    let order = 1;

    if (curr.startsWith('-')) {
      curr = curr.substr(1);
      order = -1;
    }

    acc[curr] = order;
    return acc;
  }, {});
};

Query.prototype.buildProject = function () {
  if (!this.project || !this.project.trim()) return {};
  return this.project.trim().split(',').filter(x => !!x).map(x => x.trim()).reduce((acc, curr) => {
    let stat = 1;

    if (curr.startsWith('-')) {
      curr = curr.substr(1);
      stat = 0;
    }

    acc[curr] = stat;
    return acc;
  }, {});
};

Query.prototype.buildPopulate = function () {
  if (!this.populate || !this.populate.trim()) return [];
  return this.populate.trim().split(',').filter(x => !!x).map(x => x.trim());
};

module.exports = Query;