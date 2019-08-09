"use strict";

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

// Copyright (c) 2018-2020 Double.  All rights reserved.
// Use of this source code is governed by a MIT style
// license that can be found in the LICENSE file.
const _ = require('lodash');

const logger = require('../logger');

const Query = require('./query');

const utils = require('./utils');

const repo = module.exports;

repo.one =
/*#__PURE__*/
function () {
  var _ref = _asyncToGenerator(function* (name, ctx, ext, opts) {
    const key = utils.findStringSubmatch(/:(.*)$/, opts.routePrefixs.one(name, opts));
    const id = ctx.params[key];
    const Model = ext.Model(name);
    const q = Query(ctx.query).build({
      model: Model
    });
    q.cond = yield opts.routeHooks.one.cond(_.assign(q.cond, {
      id,
      deletedAt: null
    }), ctx, {
      name
    });
    q.toOperators();
    const cond = {
      where: q.operators
    };

    if (q.project.length > 0) {
      cond.attributes = q.project;
    }

    cond.include = q.preload;
    ctx.status = 200;
    ctx.body = yield Model.findOne(cond);
  });

  return function (_x, _x2, _x3, _x4) {
    return _ref.apply(this, arguments);
  };
}();

repo.list =
/*#__PURE__*/
function () {
  var _ref2 = _asyncToGenerator(function* (name, ctx, ext, opts) {
    let totalpages;
    let totalrecords;
    const Model = ext.Model(name);
    const q = Query(ctx.query).build({
      model: Model
    });
    q.cond = yield opts.routeHooks.list.cond(_.assign(q.cond, {
      deletedAt: null
    }), ctx, {
      name
    });
    q.toOperators();
    const match = {
      where: q.operators
    };

    if (q.project.length > 0) {
      match.attributes = q.project;
    }

    if (q.preload.length > 0) {
      match.include = q.preload;
    }

    if (q.range === 'PAGE') {
      match.offset = (q.page - 1) * q.size;
      match.limit = q.size;
    }

    const list = yield Model.findAll(match);
    totalrecords = yield Model.count(_.omit(match, ['attributes']));

    if (q.range === 'PAGE') {
      totalpages = Math.ceil(totalrecords / q.size);
      ctx.status = 200;
      ctx.body = {
        cond: q.cond,
        page: q.page,
        size: q.size,
        sort: q.sort,
        project: q.project,
        populate: q.populate,
        totalpages,
        totalrecords,
        list
      };
    } else {
      ctx.status = 200;
      ctx.body = {
        cond: q.cond,
        sort: q.sort,
        project: q.project,
        populate: q.populate,
        totalrecords,
        list
      };
    }
  });

  return function (_x5, _x6, _x7, _x8) {
    return _ref2.apply(this, arguments);
  };
}();

repo.create =
/*#__PURE__*/
function () {
  var _ref3 = _asyncToGenerator(function* (name, ctx, ext, opts) {
    const Model = ext.Model(name);
    let form = ctx.request.body;
    form.docs = form.docs.map(doc => {
      doc.createdAt = new Date();
      return doc;
    });
    form = yield opts.routeHooks.create.form(form, ctx, {
      name
    });
    ctx.status = 200;
    ctx.body = yield Model.bulkCreate(form.docs);
  });

  return function (_x9, _x10, _x11, _x12) {
    return _ref3.apply(this, arguments);
  };
}();

repo.delete =
/*#__PURE__*/
function () {
  var _ref4 = _asyncToGenerator(function* (name, ctx, ext, opts) {
    const Model = ext.Model(name);
    let form = ctx.request.body;

    for (let index = 0; index < form.docs.length; index++) {
      const doc = form.docs[index];

      if (doc['id'] === undefined || doc['id'] === '' || doc['id'] === null) {
        throw new Error('no id found');
      }
    }

    form = yield opts.routeHooks.delete.form(form, {
      name
    });
    const results = [];

    for (const doc of form.docs) {
      doc.deletedAt = new Date();
      const cond = yield opts.routeHooks.delete.cond(_.pick(doc, ['id']), ctx, {
        name
      });
      const ret = yield Model.update(_.pick(doc, ['deletedAt']), {
        where: cond
      });
      results.push(ret);
    }

    ctx.status = 200;
    ctx.body = results;
  });

  return function (_x13, _x14, _x15, _x16) {
    return _ref4.apply(this, arguments);
  };
}();

repo.update =
/*#__PURE__*/
function () {
  var _ref5 = _asyncToGenerator(function* (name, ctx, ext, opts) {
    const Model = ext.Model(name);
    let form = ctx.request.body;

    for (let index = 0; index < form.docs.length; index++) {
      const doc = form.docs[index];

      if (doc['id'] === undefined || doc['id'] === '' || doc['id'] === null) {
        throw new Error('no id found');
      }
    }

    form = yield opts.routeHooks.update.form(form, {
      name
    });
    const results = [];

    for (const doc of form.docs) {
      const cond = yield opts.routeHooks.update.cond(_.pick(doc, ['id']), ctx, {
        name
      });
      doc.updatedAt = new Date();
      const ret = yield Model.update(doc, {
        where: cond,
        fields: Object.keys(doc)
      });
      results.push(ret);
    }

    ctx.status = 200;
    ctx.body = results;
  });

  return function (_x17, _x18, _x19, _x20) {
    return _ref5.apply(this, arguments);
  };
}();