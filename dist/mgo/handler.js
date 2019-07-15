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
      const id = ctx.params[key[0]];
      const Model = ext.Model(name);
      const q = Query(ctx.query).build();
      const cond = yield opts.routeHooks.one.cond(_.assign(q.cond, {
        _id: id,
        deletedAt: null
      }), ctx, {
        name
      });
      const query = Model.findOne(cond, q.project);
      q.populate.forEach(pop => {
        query.populate(pop);
      });
      ctx.status = 200;
      ctx.body = yield query.exec();
    } catch (error) {
      logger.error(error.stack || error.message);
      ctx.status = 500;
      ctx.body = {
        message: error.message
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
      let totalpages;
      let totalrecords;
      let result;
      const q = Query(ctx.query).build();
      const Model = ext.Model(name);
      const cond = yield opts.routeHooks.list.cond(_.assign(q.cond, {
        deletedAt: null
      }), ctx, {
        name
      });
      let query = Model.find(cond, q.project).sort(q.sort);
      q.populate.forEach(pop => {
        query.populate(pop);
      });

      if (q.range === 'PAGE') {
        query = query.skip((q.page - 1) * q.size).limit(q.size);
        result = yield query.exec();
        totalrecords = yield Model.where(cond).countDocuments();
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
          data: result
        };
      } else if (q.range === 'ALL') {
        result = yield query.exec();
        totalrecords = result.length;
        ctx.status = 200;
        ctx.body = {
          cond: q.cond,
          sort: q.sort,
          project: q.project,
          populate: q.populate,
          totalrecords,
          data: result
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
      let form = ctx.request.body;
      form.docs = form.docs.map(x => {
        x.createdAt = new Date();
        return x;
      });
      form = yield opts.routeHooks.create.form(form, {
        name
      });
      ctx.status = 200;
      ctx.body = yield Model.create(form.docs);
    } catch (error) {
      logger.error(error.stack);
      ctx.status = 500;
      ctx.body = {
        message: 'Internal Server Error',
        stack: error.stack
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
      let form = ctx.request.body;

      for (let index = 0; index < form.docs.length; index++) {
        const doc = form.docs[index];

        if (doc['_id'] === undefined || doc['_id'] === '' || doc['_id'] === null) {
          ctx.body = {
            message: 'no id found'
          };
          return;
        }
      }

      form = yield opts.routeHooks.delete.form(form, {
        name
      });
      ctx.status = 200;
      const docs = yield Promise.all(form.docs.map(
      /*#__PURE__*/
      function () {
        var _ref5 = _asyncToGenerator(function* (doc) {
          const cond = yield opts.routeHooks.delete.cond(_.pick(doc, ['_id']), ctx, {
            name
          });
          doc.deletedAt = new Date();
          return {
            updateOne: {
              filter: cond,
              update: {
                $set: _.pick(doc, ['deletedAt'])
              },
              upsert: false
            }
          };
        });

        return function (_x17) {
          return _ref5.apply(this, arguments);
        };
      }()));
      ctx.body = yield Model.bulkWrite(docs);
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
  var _ref6 = _asyncToGenerator(function* (name, ctx, ext, opts) {
    try {
      let form = ctx.request.body;

      for (let index = 0; index < form.docs.length; index++) {
        const doc = form.docs[index];

        if (doc['_id'] === undefined || doc['_id'] === '' || doc['_id'] === null) {
          ctx.body = {
            message: 'no id found'
          };
          return;
        }
      }

      form = yield opts.routeHooks.update.form(form, {
        name
      });
      const Model = ext.Model(name);
      ctx.status = 200;
      const docs = yield Promise.all(form.docs.map(
      /*#__PURE__*/
      function () {
        var _ref7 = _asyncToGenerator(function* (x) {
          const cond = yield opts.routeHooks.update.cond(_.pick(x, ['_id']), ctx, {
            name
          });
          x.updatedAt = new Date();
          return {
            updateOne: {
              filter: cond,
              update: {
                $set: x
              },
              upsert: false
            }
          };
        });

        return function (_x22) {
          return _ref7.apply(this, arguments);
        };
      }()));
      ctx.body = yield Model.bulkWrite(docs);
    } catch (error) {
      logger.error(error.stack || error.message);
      ctx.status = 500;
      ctx.body = {
        message: 'Internal Server Error'
      };
    }
  });

  return function (_x18, _x19, _x20, _x21) {
    return _ref6.apply(this, arguments);
  };
}();