"use strict";

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

// Copyright (c) 2018-2020 Double.  All rights reserved.
// Use of this source code is governed by a MIT style
// license that can be found in the LICENSE file.
const logger = require('../logger');

const Query = require('./query');

const repo = module.exports;

repo.one =
/*#__PURE__*/
function () {
  var _ref2 = _asyncToGenerator(function* (name, ctx, _ref) {
    let {
      ext,
      routeHooks
    } = _ref;

    try {
      let data;
      const id = ctx.params.id;
      const Model = ext.Model(name);
      const q = Query(ctx.query);
      const project = q.buildProject();
      const populate = q.buildPopulate(Model);
      const cond = {
        where: {
          id
        }
      };
      cond.where = yield routeHooks.one.cond(cond.where, {
        name
      });

      if (project.length > 0) {
        cond.attributes = project;
      }

      cond.include = populate;
      data = yield Model.findOne(cond);
      ctx.status = 200;
      ctx.body = data;
    } catch (error) {
      logger.error(error.stack || error.message);
      ctx.status = 500;
      ctx.body = {
        message: 'Internal Server Error'
      };
    }
  });

  return function (_x, _x2, _x3) {
    return _ref2.apply(this, arguments);
  };
}();

repo.list =
/*#__PURE__*/
function () {
  var _ref4 = _asyncToGenerator(function* (name, ctx, _ref3) {
    let {
      ext,
      routeHooks
    } = _ref3;

    try {
      let data;
      let totalpages;
      let totalrecords;
      const Model = ext.Model(name);
      const q = Query(ctx.query);
      const cond = q.buildCond();
      const sort = q.buildSort();
      const project = q.buildProject();
      const populate = q.buildPopulate(Model);
      const match = {
        where: cond
      };
      match.where = yield routeHooks.list.cond(match.where, {
        name
      });

      if (project.length > 0) {
        match.attributes = project;
      }

      if (populate.length > 0) {
        match.include = populate;
      }

      if (q.range === 'PAGE') {
        match.offset = (q.page - 1) * q.size;
        match.limit = q.size;
      }

      data = yield Model.findAll(match);
      totalrecords = yield Model.count(match);
      totalpages = Math.ceil(totalrecords / q.size);

      if (q.range === 'PAGE') {
        ctx.status = 200;
        ctx.body = {
          cond,
          page: q.page,
          size: q.size,
          sort,
          project,
          populate: populate,
          totalpages,
          totalrecords,
          data
        };
      } else {
        ctx.status = 200;
        ctx.body = {
          cond,
          sort,
          project,
          populate: populate,
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

  return function (_x4, _x5, _x6) {
    return _ref4.apply(this, arguments);
  };
}();

repo.create =
/*#__PURE__*/
function () {
  var _ref6 = _asyncToGenerator(function* (name, ctx, _ref5) {
    let {
      ext,
      routeHooks
    } = _ref5;

    try {
      const Model = ext.Model(name); // eslint-disable-next-line no-unused-vars

      const {
        docs,
        category
      } = yield routeHooks.create.body(ctx.request.body, {
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

  return function (_x7, _x8, _x9) {
    return _ref6.apply(this, arguments);
  };
}();

repo.delete =
/*#__PURE__*/
function () {
  var _ref8 = _asyncToGenerator(function* (name, ctx, _ref7) {
    let {
      ext,
      routeHooks
    } = _ref7;

    try {
      // eslint-disable-next-line no-unused-vars
      const {
        docs,
        category
      } = ctx.request.body;
      const Model = ext.Model(name);
      const results = [];

      for (const item of docs) {
        const update = yield routeHooks.delete.update({
          id: item.id
        }, {
          name
        });
        const result = yield Model.update(update, {
          where: {
            id: item.id
          },
          fields: Object.keys(update)
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

  return function (_x10, _x11, _x12) {
    return _ref8.apply(this, arguments);
  };
}();

repo.update =
/*#__PURE__*/
function () {
  var _ref10 = _asyncToGenerator(function* (name, ctx, _ref9) {
    let {
      ext,
      routeHooks
    } = _ref9;

    try {
      // eslint-disable-next-line no-unused-vars
      const {
        docs,
        category
      } = yield routeHooks.update.body(ctx.request.body, {
        name
      });
      const Model = ext.Model(name);
      const results = [];

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

  return function (_x13, _x14, _x15) {
    return _ref10.apply(this, arguments);
  };
}();