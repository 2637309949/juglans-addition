"use strict";

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

// Copyright (c) 2018-2020 Double.  All rights reserved.
// Use of this source code is governed by a MIT style
// license that can be found in the LICENSE file.
const _ = require('lodash');

const moment = require('moment');

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
      const q = Query(ctx.query);
      const project = q.buildProject();
      const populate = q.buildPopulate();
      const cond = yield opts.routeHooks.one.cond({
        _id: id
      }, {
        name
      });
      const query = Model.findOne(cond, project);

      for (const pop of populate) {
        query.populate(pop);
      }

      const result = yield query.exec();
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
      const q = Query(ctx.query);
      const cond = q.buildCond();
      const sort = q.buildSort();
      const project = q.buildProject();
      const populate = q.buildPopulate();
      const Model = ext.Model(name);
      const where = yield opts.routeHooks.list.cond(cond, {
        name
      });
      let query = Model.find(where, project).sort(sort);

      for (const pop of populate) {
        query.populate(pop);
      }

      if (q.range === 'PAGE') {
        query = query.skip((q.page - 1) * q.size).limit(q.size);
        result = yield query.exec();
        totalrecords = yield Model.where(where).countDocuments();
        totalpages = Math.ceil(totalrecords / q.size);
        ctx.status = 200;
        ctx.body = {
          cond,
          page: q.page,
          size: q.size,
          sort,
          project,
          populate,
          totalpages,
          totalrecords,
          data: result
        };
      } else if (q.range === 'ALL') {
        result = yield query.exec();
        totalrecords = result.length;
        ctx.status = 200;
        ctx.body = {
          cond,
          sort,
          project,
          populate,
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
      const {
        docs
      } = yield opts.routeHooks.create.form(ctx.request.body, {
        name
      });
      const result = yield Model.create(docs);
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
        return doc['_id'] === undefined || doc['_id'] === '' || doc['_id'] === null;
      });

      if (noid) {
        ctx.body = {
          message: 'no id found'
        };
        return;
      }

      const result = yield Model.bulkWrite(docs.map(x => {
        return {
          updateOne: {
            filter: {
              _id: x._id
            },
            update: {
              $set: {
                _deletedAt: moment().unix()
              }
            },
            upsert: false
          }
        };
      }));
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

      const noid = _.find(docs, function (doc) {
        return doc['_id'] === undefined || doc['_id'] === '' || doc['_id'] === null;
      });

      if (noid) {
        ctx.body = {
          message: 'no id found'
        };
        return;
      }

      const ret = yield Model.bulkWrite(docs.map(x => {
        return {
          updateOne: {
            filter: {
              _id: x._id
            },
            update: {
              $set: x
            },
            upsert: false
          }
        };
      }));
      ctx.status = 200;
      ctx.body = ret;
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