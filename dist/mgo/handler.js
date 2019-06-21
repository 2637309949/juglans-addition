"use strict";

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

// Copyright (c) 2018-2020 Double.  All rights reserved.
// Use of this source code is governed by a MIT style
// license that can be found in the LICENSE file.
const moment = require('moment');

const logger = require('../logger');

const Query = require('./query');

const repo = module.exports;

repo.one =
/*#__PURE__*/
function () {
  var _ref = _asyncToGenerator(function* (name, mgo, ctx) {
    try {
      const id = ctx.params.id;
      const Model = mgo.model(name);
      const q = Query(ctx.query);
      const project = q.buildProject();
      const populate = q.buildPopulate();
      const query = Model.findOne({
        _id: id,
        _dr: false
      }, project);

      for (const pop of populate) {
        query.populate(pop);
      }

      const ret = yield query.exec();
      ctx.status = 200;
      ctx.body = ret;
    } catch (error) {
      logger.error(error);
      ctx.status = 500;
      ctx.body = {
        message: error.message
      };
    }
  });

  return function (_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
}();

repo.list =
/*#__PURE__*/
function () {
  var _ref2 = _asyncToGenerator(function* (name, mgo, ctx) {
    try {
      const q = Query(ctx.query);
      const cond = q.buildCond();
      const sort = q.buildSort();
      const project = q.buildProject();
      const populate = q.buildPopulate();
      let totalpages;
      let totalrecords;
      let data;
      const Model = mgo.model(name);
      const query = Model.find(_objectSpread({
        _dr: false
      }, cond), project).sort(sort);

      for (const pop of populate) {
        query.populate(pop);
      }

      if (q.range === 'PAGE') {
        query.skip((q.page - 1) * q.size).limit(q.size);
        data = yield query.exec();
        totalrecords = yield Model.where(cond).countDocuments();
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
          data
        };
      } else if (q.range === 'ALL') {
        data = yield query.exec();
        totalrecords = data.length;
        ctx.status = 200;
        ctx.body = {
          cond,
          sort,
          project,
          populate,
          totalrecords,
          data
        };
      }
    } catch (error) {
      logger.error(error);
      ctx.status = 500;
      ctx.body = {
        message: error.message
      };
    }
  });

  return function (_x4, _x5, _x6) {
    return _ref2.apply(this, arguments);
  };
}();

repo.create =
/*#__PURE__*/
function () {
  var _ref3 = _asyncToGenerator(function* (name, mgo, ctx) {
    try {
      // eslint-disable-next-line no-unused-vars
      const {
        docs,
        category
      } = ctx.request.body;
      const Model = mgo.model(name);
      const ret = yield Model.create(docs.map(x => _objectSpread({}, x, {
        _dr: false,
        _createdAt: moment().unix()
      })));
      ctx.status = 200;
      ctx.body = ret;
    } catch (error) {
      logger.error(error);
      ctx.status = 500;
      ctx.body = {
        message: error.message
      };
    }
  });

  return function (_x7, _x8, _x9) {
    return _ref3.apply(this, arguments);
  };
}();

repo.delete =
/*#__PURE__*/
function () {
  var _ref4 = _asyncToGenerator(function* (name, mgo, ctx) {
    try {
      // eslint-disable-next-line no-unused-vars
      const {
        docs,
        category
      } = ctx.request.body;
      const Model = mgo.model(name);
      const ret = yield Model.bulkWrite(docs.map(x => {
        return {
          updateOne: {
            filter: {
              _id: x._id
            },
            update: {
              $set: {
                _dr: true,
                _modifiedAt: moment().unix()
              }
            },
            upsert: false
          }
        };
      }));
      ctx.status = 200;
      ctx.body = ret;
    } catch (error) {
      logger.error(error);
      ctx.status = 500;
      ctx.body = {
        message: error.message
      };
    }
  });

  return function (_x10, _x11, _x12) {
    return _ref4.apply(this, arguments);
  };
}();

repo.update =
/*#__PURE__*/
function () {
  var _ref5 = _asyncToGenerator(function* (name, mgo, ctx) {
    try {
      // eslint-disable-next-line no-unused-vars
      const {
        docs,
        category
      } = ctx.request.body;
      const Model = mgo.model(name);
      const ret = yield Model.bulkWrite(docs.map(x => {
        return {
          updateOne: {
            filter: {
              _id: x._id,
              _dr: false
            },
            update: {
              $set: _objectSpread({}, x, {
                _modifiedAt: moment().unix()
              })
            },
            upsert: false
          }
        };
      }));
      ctx.status = 200;
      ctx.body = ret;
    } catch (error) {
      logger.error(error);
      ctx.status = 500;
      ctx.body = {
        message: error.message
      };
    }
  });

  return function (_x13, _x14, _x15) {
    return _ref5.apply(this, arguments);
  };
}();