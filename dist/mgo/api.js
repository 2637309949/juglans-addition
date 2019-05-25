"use strict";

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

const hook = require('./hook');

const handler = require('./handler');

const repo = module.exports;

repo.Api = function (_ref) {
  let {
    mgo
  } = _ref;

  if (!(this instanceof repo.Api)) {
    return new repo.Api({
      mgo
    });
  }

  this.mgo = mgo;
};

repo.Api.prototype.One = function (router, name) {
  function middle(_x) {
    return _middle.apply(this, arguments);
  }

  function _middle() {
    _middle = _asyncToGenerator(function* (ctx) {
      yield handler.one(name, this.mgo, ctx);
    });
    return _middle.apply(this, arguments);
  }

  const h = hook.Hook({
    mgo: this.mgo,
    handler: middle
  });
  router.get(`/${name}/:id`, h.R);
  return h;
};

repo.Api.prototype.List = function (router, name) {
  function middle(_x2) {
    return _middle2.apply(this, arguments);
  }

  function _middle2() {
    _middle2 = _asyncToGenerator(function* (ctx) {
      yield handler.list(name, this.mgo, ctx);
    });
    return _middle2.apply(this, arguments);
  }

  const h = hook.Hook({
    mgo: this.mgo,
    handler: middle
  });
  router.get(`/${name}`, h.R);
  return h;
};

repo.Api.prototype.Create = function (router, name) {
  function middle(_x3) {
    return _middle3.apply(this, arguments);
  }

  function _middle3() {
    _middle3 = _asyncToGenerator(function* (ctx) {
      yield handler.create(name, this.mgo, ctx);
    });
    return _middle3.apply(this, arguments);
  }

  const h = hook.Hook({
    mgo: this.mgo,
    handler: middle
  });
  router.post(`/${name}`, h.R);
  return h;
};

repo.Api.prototype.Update = function (router, name) {
  function middle(_x4) {
    return _middle4.apply(this, arguments);
  }

  function _middle4() {
    _middle4 = _asyncToGenerator(function* (ctx) {
      yield handler.update(name, this.mgo, ctx);
    });
    return _middle4.apply(this, arguments);
  }

  const h = hook.Hook({
    mgo: this.mgo,
    handler: middle
  });
  router.put(`/${name}`, h.R);
  return h;
};

repo.Api.prototype.Delete = function (router, name) {
  function middle(_x5) {
    return _middle5.apply(this, arguments);
  }

  function _middle5() {
    _middle5 = _asyncToGenerator(function* (ctx) {
      yield handler.delete(name, this.mgo, ctx);
    });
    return _middle5.apply(this, arguments);
  }

  const h = hook.Hook({
    mgo: this.mgo,
    handler: middle
  });
  router.put(`/${name}`, h.R);
  return h;
};

repo.Api.prototype.ALL = function (router, name) {
  var _this = this;

  router.get(`/${name}/:id`,
  /*#__PURE__*/
  function () {
    var _ref2 = _asyncToGenerator(function* (ctx) {
      yield handler.one(name, _this.mgo, ctx);
    });

    return function (_x6) {
      return _ref2.apply(this, arguments);
    };
  }());
  router.get(`/${name}`,
  /*#__PURE__*/
  function () {
    var _ref3 = _asyncToGenerator(function* (ctx) {
      yield handler.list(name, _this.mgo, ctx);
    });

    return function (_x7) {
      return _ref3.apply(this, arguments);
    };
  }());
  router.post(`/${name}`,
  /*#__PURE__*/
  function () {
    var _ref4 = _asyncToGenerator(function* (ctx) {
      yield handler.create(name, _this.mgo, ctx);
    });

    return function (_x8) {
      return _ref4.apply(this, arguments);
    };
  }());
  router.put(`/${name}`,
  /*#__PURE__*/
  function () {
    var _ref5 = _asyncToGenerator(function* (ctx) {
      yield handler.update(name, _this.mgo, ctx);
    });

    return function (_x9) {
      return _ref5.apply(this, arguments);
    };
  }());
  router.delete(`/${name}`,
  /*#__PURE__*/
  function () {
    var _ref6 = _asyncToGenerator(function* (ctx) {
      yield handler.delete(name, _this.mgo, ctx);
    });

    return function (_x10) {
      return _ref6.apply(this, arguments);
    };
  }());
};