"use strict";

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

/**
 * @author [Double]
 * @email [2637309949@qq.com]
 * @create date 2019-01-10 11:33:13
 * @modify date 2019-01-10 11:33:13
 * @desc [handler functions]
 */
const is = require('is');

const utils = require('./utils');

const repo = module.exports;

repo.one =
/*#__PURE__*/
function () {
  var _ref = _asyncToGenerator(function* (name, mgo, ctx) {
    try {
      const id = ctx.params.id;
      const Model = mgo.model(name);
      const ret = yield Model.findById(id);
      ctx.status = 200;
      ctx.body = ret;
    } catch (error) {
      console.error(error);
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
      const page = parseInt(ctx.query.page) || 1;
      const size = parseInt(ctx.query.size) || 20;
      const range = ctx.query.range === 'ALL' ? ctx.query.range.toUpperCase() : 'PAGE';
      const cond = utils.toCond(ctx.query.cond);
      const sort = utils.toSort(ctx.query.sort);
      const project = utils.toProject(ctx.query.project);
      const populate = utils.toPopulate(ctx.query.populate);
      let totalpages;
      let totalrecords;
      let data;
      const Model = mgo.model(name);
      const query = Model.find(cond, project).sort(sort);
      utils.popModel(query, populate);

      if (range === 'PAGE') {
        query.skip((page - 1) * size).limit(size);
        data = yield query.exec();
        totalrecords = yield Model.where(cond).countDocuments();
        totalpages = Math.ceil(totalrecords / size);
      } else if (range === 'ALL') {
        data = yield query.exec();
        totalrecords = data.length;
      }

      ctx.status = 200;
      ctx.body = {
        cond,
        page,
        size,
        sort,
        project,
        populate,
        totalpages,
        totalrecords,
        data
      };
    } catch (error) {
      console.error(error);
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
      const data = ctx.request.body;
      const items = is.array(data) ? data : [data];
      const Model = mgo.model(name);
      const ret = yield Model.create(items);
      ctx.status = 200;
      ctx.body = ret;
    } catch (error) {
      console.error(error);
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
      const {
        cond,
        doc,
        muti
      } = ctx.request.body;
      let ret;
      const Model = mgo.model(name);

      if (muti) {
        ret = yield Model.deleteMany(cond, {
          $set: doc
        });
      } else {
        ret = yield Model.deleteOne(cond, {
          $set: doc
        });
      }

      ctx.status = 200;
      ctx.body = ret;
    } catch (error) {
      console.error(error);
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
      const {
        cond,
        doc,
        muti
      } = ctx.request.body;
      let ret;
      const Model = mgo.model(name);

      if (muti) {
        ret = yield Model.updateMany(cond, {
          $set: doc
        });
      } else {
        ret = yield Model.updateOne(cond, {
          $set: doc
        });
      }

      ctx.status = 200;
      ctx.body = ret;
    } catch (error) {
      console.error(error);
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