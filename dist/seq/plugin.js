"use strict";

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

// Copyright (c) 2018-2020 Double.  All rights reserved.
// Use of this source code is governed by a MIT style
// license that can be found in the LICENSE file.
const moment = require('moment');

const merge = require('deepmerge');

function API() {
  let opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  let ext = arguments.length > 1 ? arguments[1] : undefined;
  ext = ext || this;

  if (!(this instanceof API)) {
    return new API(opts, ext);
  }

  opts = merge.all([API.defaultOpts, opts]);
  this.opts = opts;
  this.ext = ext;
}

API.prototype.plugin = function (_ref) {
  let {
    router
  } = _ref;
  this.ext.api.setAPI(this);

  for (const item of this.ext.m) {
    if (item.autoHook === true || item.autoHook === undefined) {
      this.ext.api.ALL(router, item.name);
    }
  }
}; // DefaultAPI defined a common interface api plugin


API.defaultOpts = {
  prefix: 'seq',
  routePrefixs: {
    one: function (name) {
      let opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      if (opts.prefix) {
        return `/${opts.prefix}/${name}/:id`;
      }

      return `/${name}/:id`;
    },
    list: function (name) {
      let opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      if (opts.prefix) {
        return `/${opts.prefix}/${name}`;
      }

      return `/${name}`;
    },
    create: function (name) {
      let opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      if (opts.prefix) {
        return `/${opts.prefix}/${name}`;
      }

      return `/${name}`;
    },
    update: function (name) {
      let opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      if (opts.prefix) {
        return `/${opts.prefix}/${name}`;
      }

      return `/${name}`;
    },
    delete: function (name) {
      let opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      if (opts.prefix) {
        return `/${opts.prefix}/${name}`;
      }

      return `/${name}`;
    }
  },
  routeHooks: {
    one: {
      cond: function () {
        var _ref2 = _asyncToGenerator(function* (_cond) {
          return _objectSpread({}, _cond, {
            _dr: {
              $ne: true
            }
          });
        });

        return function cond(_x) {
          return _ref2.apply(this, arguments);
        };
      }()
    },
    list: {
      cond: function () {
        var _ref3 = _asyncToGenerator(function* (_cond2) {
          return _objectSpread({}, _cond2, {
            _dr: {
              $ne: true
            }
          });
        });

        return function cond(_x2) {
          return _ref3.apply(this, arguments);
        };
      }()
    },
    create: {
      body: function () {
        var _ref4 = _asyncToGenerator(function* (_body) {
          return {
            docs: _body.docs.map(x => _objectSpread({}, x, {
              _dr: false,
              _createdAt: moment().unix()
            })),
            category: _body.category
          };
        });

        return function body(_x3) {
          return _ref4.apply(this, arguments);
        };
      }()
    },
    delete: {
      update: function () {
        var _ref5 = _asyncToGenerator(function* (set) {
          return _objectSpread({}, set, {
            _dr: true,
            _modifiedAt: moment().unix()
          });
        });

        return function update(_x4) {
          return _ref5.apply(this, arguments);
        };
      }()
    },
    update: {
      body: function () {
        var _ref6 = _asyncToGenerator(function* (_body2) {
          return {
            docs: _body2.docs.map(x => _objectSpread({}, x, {
              _dr: false,
              _modifiedAt: moment().unix()
            })),
            category: _body2.category
          };
        });

        return function body(_x5) {
          return _ref6.apply(this, arguments);
        };
      }()
    }
  }
};
module.exports = API;