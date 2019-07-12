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
    try {
      const key = utils.findStringSubmatch(/:(.*)$/, opts.routePrefixs.one(name, opts));
      const id = ctx.params[key];
      const Model = ext.Model(name);
      const q = Query(ctx.query).build({
        model: Model
      });
      const cond = {
        where: {
          id
        }
      };
      cond.where = yield opts.routeHooks.one.cond(cond.where, {
        name
      });

      if (q.project.length > 0) {
        cond.attributes = q.project;
      }

      cond.include = q.populate;
      const result = yield Model.findOne(cond);
      ctx.status = 200;
      ctx.body = result;
    } catch (error) {
      logger.error(error.stack || error.message);
      ctx.status = 500;
      ctx.body = {
        message: 'Internal Server Error'
      };
    }
  });

  return function (_x, _x2, _x3, _x4) {
    return _ref.apply(this, arguments);
  };
}();

repo.list =
/*#__PURE__*/
function () {
  var _ref2 = _asyncToGenerator(function* (name, ctx, ext, opts) {
    try {
      let data;
      let totalpages;
      let totalrecords;
      const Model = ext.Model(name);
      const q = Query(ctx.query).build({
        model: Model
      });
      const match = {
        where: q.operators
      };
      match.where = yield opts.routeHooks.list.cond(match.where, {
        name
      });

      if (q.project.length > 0) {
        match.attributes = q.project;
      }

      if (q.populate.length > 0) {
        match.include = q.populate;
      }

      if (q.range === 'PAGE') {
        match.offset = (q.page - 1) * q.size;
        match.limit = q.size;
      }

      data = yield Model.findAll(match);
      delete match.attributes;
      totalrecords = yield Model.count(match);

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
          data
        };
      } else {
        ctx.status = 200;
        ctx.body = {
          cond: q.cond,
          sort: q.sort,
          project: q.project,
          populate: q.populate,
          totalrecords,
          data
        };
      }
    } catch (error) {
      logger.error(error.stack || error.message);
      ctx.status = 500;
      ctx.body = {
        message: 'Internal Server Error'
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
    try {
      const Model = ext.Model(name);
      const {
        docs
      } = yield opts.routeHooks.create.form(ctx.request.body, {
        name
      });
      const result = yield Model.bulkCreate(docs);
      ctx.status = 200;
      ctx.body = result;
    } catch (error) {
      logger.error(error.stack || error.message);
      ctx.status = 500;
      ctx.body = {
        message: error.message
      };
    }
  });

  return function (_x9, _x10, _x11, _x12) {
    return _ref3.apply(this, arguments);
  };
}();

repo.delete =
/*#__PURE__*/
function () {
  var _ref4 = _asyncToGenerator(function* (name, ctx, ext, opts) {
    try {
      const Model = ext.Model(name);
      const {
        docs
      } = yield opts.routeHooks.delete.form(ctx.request.body, {
        name
      });

      const noid = _.find(docs, function (doc) {
        return doc['id'] === undefined || doc['id'] === '' || doc['id'] === null;
      });

      if (noid) {
        ctx.body = {
          message: 'no id found'
        };
        return;
      }

      const results = [];

      for (const item of docs) {
        const result = yield Model.update({
          deletedAt: new Date()
        }, {
          where: {
            id: item.id
          }
        });
        results.push(result);
      }

      ctx.status = 200;
      ctx.body = results;
    } catch (error) {
      logger.error(error.stack || error.message);
      ctx.status = 500;
      ctx.body = {
        message: 'Internal Server Error'
      };
    }
  });

  return function (_x13, _x14, _x15, _x16) {
    return _ref4.apply(this, arguments);
  };
}();

repo.update =
/*#__PURE__*/
function () {
  var _ref5 = _asyncToGenerator(function* (name, ctx, ext, opts) {
    try {
      const {
        docs
      } = yield opts.routeHooks.update.form(ctx.request.body, {
        name
      });
      const Model = ext.Model(name);
      const results = [];

      const noid = _.find(docs, function (doc) {
        return doc['id'] === undefined || doc['id'] === '' || doc['id'] === null;
      });

      if (noid) {
        ctx.body = {
          message: 'no id found'
        };
        return;
      }

      for (const item of docs) {
        const result = yield Model.update(item, {
          where: {
            id: item.id
          },
          fields: Object.keys(item)
        });
        results.push(result);
      }

      ctx.status = 200;
      ctx.body = results;
    } catch (error) {
      logger.error(error.stack || error.message);
      ctx.status = 500;
      ctx.body = {
        message: 'Internal Server Error'
      };
    }
  });

  return function (_x17, _x18, _x19, _x20) {
    return _ref5.apply(this, arguments);
  };
}();