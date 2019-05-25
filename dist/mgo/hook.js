"use strict";

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

const repo = module.exports;

repo.Hook = function (_ref) {
  let {
    mgo,
    handler
  } = _ref;

  if (!(this instanceof repo.Hook)) {
    return new repo.Hook({
      mgo,
      handler
    });
  }

  this.R = this.route();
  this.handler = handler;
  this.mgo = mgo;
};

repo.Hook.prototype.route = function () {
  var _this = this;

  return (
    /*#__PURE__*/
    function () {
      var _ref2 = _asyncToGenerator(function* (ctx) {
        if (_this.pre != null) {
          yield _this.pre(ctx);
        }

        if (_this.handler != null) {
          yield _this.handler(ctx);
        }

        if (_this.post != null) {
          yield _this.post(ctx);
        }
      });

      return function (_x) {
        return _ref2.apply(this, arguments);
      };
    }()
  );
};

repo.Hook.prototype.Pre = function (pre) {
  this.pre = pre;
  return this;
};

repo.Hook.prototype.Post = function (post) {
  this.post = post;
  return this;
};