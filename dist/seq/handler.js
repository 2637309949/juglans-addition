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
      const id = ctx.params.id;
      const Model = ext.Model(name);
      const q = Query(ctx.query);
      const project = q.buildProject();
      const populate = q.buildPopulate();
      const cond = yield routeHooks.one.cond({
        _id: id
      }, {
        name
      }); // const query = Model.findByPk(id)
      // for (const pop of populate) {
      //   query.populate(pop)
      // }

      const ret = yield Model.findByPk(id);
      ctx.status = 200;
      ctx.body = ret;
    } catch (error) {
      logger.error(error.stack || error.message);
      ctx.status = 500;
      ctx.body = {
        message: error.message
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
      const q = Query(ctx.query);
      const cond = q.buildCond();
      const sort = q.buildSort();
      const project = q.buildProject();
      const populate = q.buildPopulate();
      const Model = ext.Model(name);
      let totalpages;
      let totalrecords;
      let data;
      const where = yield routeHooks.list.cond(cond, {
        name
      });
      data = yield Model.findAll();
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
        data // for (const pop of populate) {
        //   query.populate(pop)
        // }
        // if (q.range === 'PAGE') {
        //   query.skip((q.page - 1) * q.size).limit(q.size)
        //   data = await query.exec()
        //   totalrecords = await Model.where(where).countDocuments()
        //   totalpages = Math.ceil(totalrecords / q.size)
        //   ctx.status = 200
        //   ctx.body = {
        //     cond,
        //     page: q.page,
        //     size: q.size,
        //     sort,
        //     project,
        //     populate,
        //     totalpages,
        //     totalrecords,
        //     data
        //   }
        // } else if (q.range === 'ALL') {
        //   data = await query.exec()
        //   totalrecords = data.length
        //   ctx.status = 200
        //   ctx.body = {
        //     cond,
        //     sort,
        //     project,
        //     populate,
        //     totalrecords,
        //     data
        //   }
        // }

      };
    } catch (error) {
      logger.error(error.stack || error.message);
      ctx.status = 500;
      ctx.body = {
        message: error.message
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
      mongoose,
      defaultAPI
    } = _ref5;

    try {
      const Model = mongoose.model(name);
      const routeHooks = mongoose.ext.routeHooks(name, defaultAPI); // eslint-disable-next-line no-unused-vars

      const {
        docs,
        category
      } = yield routeHooks.create.body(ctx.request.body, {
        name
      });
      const ret = yield Model.create(docs);
      ctx.status = 200;
      ctx.body = ret;
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
      mongoose,
      defaultAPI
    } = _ref7;

    try {
      // eslint-disable-next-line no-unused-vars
      const {
        docs,
        category
      } = ctx.request.body;
      const Model = mongoose.model(name);
      const routeHooks = mongoose.ext.routeHooks(name, defaultAPI);
      const update = yield routeHooks.delete.update({}, {
        name
      });
      const ret = yield Model.bulkWrite(docs.map(x => {
        return {
          updateOne: {
            filter: {
              _id: x._id
            },
            update: {
              $set: update
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
        message: error.message
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
      mongoose,
      defaultAPI
    } = _ref9;

    try {
      const routeHooks = mongoose.ext.routeHooks(name, defaultAPI); // eslint-disable-next-line no-unused-vars

      const {
        docs,
        category
      } = yield routeHooks.update.body(ctx.request.body, {
        name
      });
      const Model = mongoose.model(name);
      const ret = yield Model.bulkWrite(docs.map(x => {
        return {
          updateOne: {
            filter: {
              _id: x._id,
              _dr: false
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
        message: error.message
      };
    }
  });

  return function (_x13, _x14, _x15) {
    return _ref10.apply(this, arguments);
  };
}();