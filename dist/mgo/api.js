"use strict";

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

// Copyright (c) 2018-2020 Double.  All rights reserved.
// Use of this source code is governed by a MIT style
// license that can be found in the LICENSE file.
const is = require('is');

const merge = require('deepmerge');

const moment = require('moment');

const _ = require('lodash');

const hook = require('./hook');

const handler = require('./handler');

const repo = module.exports;

repo.Api = function (_ref) {
  let {
    ext
  } = _ref;
  let opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  if (!(this instanceof repo.Api)) {
    return new repo.Api({
      ext
    }, opts);
  }

  this.ext = ext;
  this.opts = merge.all([repo.Api.defaultOpts, opts]);
};

repo.Api.prototype.setApiOpts = function () {
  let opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  this.opts = merge.all([this.opts, opts]);
  return this;
};

repo.Api.prototype.Feature = function () {
  let opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {
    featurePrefix: '/feature'
  };

  if (is.string(opts)) {
    opts = {
      featurePrefix: `/${opts}`
    };
  }

  opts.featurePrefix = `${this.opts.featurePrefix}${opts.featurePrefix}`;
  return repo.Api({
    ext: this.ext
  }, opts);
};

repo.Api.prototype.Name = function (name) {
  this.opts = merge.all([this.opts, {
    featurePrefix: `/${name}`
  }]);
  return this;
};

repo.Api.prototype.One = function (router, name) {
  const profile = this.ext.Profile(name);
  const {
    routePrefixs,
    routeHooks
  } = merge.all([this.opts, _.get(profile, 'opts', {})]);
  const optHook = routeHooks.one;
  const h = hook.Hook({
    pre: optHook.pre,
    post: optHook.post,
    auth: optHook.auth,
    handler: ctx => handler.one(name, ctx, {
      ext: this.ext,
      routePrefixs,
      routeHooks
    })
  });

  for (var _len = arguments.length, middles = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
    middles[_key - 2] = arguments[_key];
  }

  middles.push(h.R);
  router.get.apply(router, [routePrefixs.one(name, this.opts)].concat(middles));
  return h;
};

repo.Api.prototype.List = function (router, name) {
  const profile = this.ext.Profile(name);
  const {
    routePrefixs,
    routeHooks
  } = merge.all([this.opts, _.get(profile, 'opts', {})]);
  const optHook = routeHooks.list;
  const h = hook.Hook({
    pre: optHook.pre,
    post: optHook.post,
    auth: optHook.auth,
    handler: ctx => handler.list(name, ctx, {
      ext: this.ext,
      routePrefixs,
      routeHooks
    })
  });

  for (var _len2 = arguments.length, middles = new Array(_len2 > 2 ? _len2 - 2 : 0), _key2 = 2; _key2 < _len2; _key2++) {
    middles[_key2 - 2] = arguments[_key2];
  }

  middles.push(h.R);
  router.get.apply(router, [routePrefixs.list(name, this.opts)].concat(middles));
  return h;
};

repo.Api.prototype.Create = function (router, name) {
  const profile = this.ext.Profile(name);
  const {
    routePrefixs,
    routeHooks
  } = merge.all([this.opts, _.get(profile, 'opts', {})]);
  const optHook = routeHooks.create;
  const h = hook.Hook({
    pre: optHook.pre,
    post: optHook.post,
    auth: optHook.auth,
    handler: ctx => handler.create(name, ctx, {
      ext: this.ext,
      routePrefixs,
      routeHooks
    })
  });

  for (var _len3 = arguments.length, middles = new Array(_len3 > 2 ? _len3 - 2 : 0), _key3 = 2; _key3 < _len3; _key3++) {
    middles[_key3 - 2] = arguments[_key3];
  }

  middles.push(h.R);
  router.post.apply(router, [routePrefixs.create(name, this.opts)].concat(middles));
  return h;
};

repo.Api.prototype.Update = function (router, name) {
  const profile = this.ext.Profile(name);
  const {
    routePrefixs,
    routeHooks
  } = merge.all([this.opts, _.get(profile, 'opts', {})]);
  const optHook = routeHooks.update;
  const h = hook.Hook({
    pre: optHook.pre,
    post: optHook.post,
    auth: optHook.auth,
    handler: ctx => handler.update(name, ctx, {
      ext: this.ext,
      routePrefixs,
      routeHooks
    })
  });

  for (var _len4 = arguments.length, middles = new Array(_len4 > 2 ? _len4 - 2 : 0), _key4 = 2; _key4 < _len4; _key4++) {
    middles[_key4 - 2] = arguments[_key4];
  }

  middles.push(h.R);
  router.put.apply(router, [routePrefixs.update(name, this.opts)].concat(middles));
  return h;
};

repo.Api.prototype.Delete = function (router, name) {
  const profile = this.ext.Profile(name);
  const {
    routePrefixs,
    routeHooks
  } = merge.all([this.opts, _.get(profile, 'opts', {})]);
  const optHook = routeHooks.delete;
  const h = hook.Hook({
    pre: optHook.pre,
    post: optHook.post,
    auth: optHook.auth,
    handler: ctx => handler.delete(name, ctx, {
      ext: this.ext,
      routePrefixs,
      routeHooks
    })
  });

  for (var _len5 = arguments.length, middles = new Array(_len5 > 2 ? _len5 - 2 : 0), _key5 = 2; _key5 < _len5; _key5++) {
    middles[_key5 - 2] = arguments[_key5];
  }

  middles.push(h.R);
  router.delete.apply(router, [routePrefixs.delete(name, this.opts)].concat(middles));
  return h;
};

repo.Api.prototype.ALL = function (router, name) {
  var _this = this;

  const profile = this.ext.Profile(name);
  const {
    routePrefixs,
    routeHooks
  } = merge.all([this.opts, _.get(profile, 'opts', {})]);
  const h = hook.Hook({});

  for (var _len6 = arguments.length, middles = new Array(_len6 > 2 ? _len6 - 2 : 0), _key6 = 2; _key6 < _len6; _key6++) {
    middles[_key6 - 2] = arguments[_key6];
  }

  router.get.apply(router, [routePrefixs.one(name, this.opts)].concat(middles, [
  /*#__PURE__*/
  function () {
    var _ref2 = _asyncToGenerator(function* (ctx) {
      const optHook = routeHooks.one;
      const h1 = hook.Hook({
        pre: optHook.pre,
        post: optHook.post,
        auth: optHook.auth,
        handler: ctx => handler.one(name, ctx, {
          ext: _this.ext,
          routePrefixs,
          routeHooks
        })
      });
      h1.Pre(h.pre);
      h1.Post(h.post);
      h1.Auth(h.auth);
      yield h1.R(ctx);
    });

    return function (_x) {
      return _ref2.apply(this, arguments);
    };
  }()]));
  router.get.apply(router, [routePrefixs.list(name, this.opts)].concat(middles, [
  /*#__PURE__*/
  function () {
    var _ref3 = _asyncToGenerator(function* (ctx) {
      const optHook = routeHooks.list;
      const h1 = hook.Hook({
        pre: optHook.pre,
        post: optHook.post,
        auth: optHook.auth,
        handler: ctx => handler.list(name, ctx, {
          ext: _this.ext,
          routePrefixs,
          routeHooks
        })
      });
      h1.Pre(h.pre);
      h1.Post(h.post);
      h1.Auth(h.auth);
      yield h1.R(ctx);
    });

    return function (_x2) {
      return _ref3.apply(this, arguments);
    };
  }()]));
  router.post.apply(router, [routePrefixs.create(name, this.opts)].concat(middles, [
  /*#__PURE__*/
  function () {
    var _ref4 = _asyncToGenerator(function* (ctx) {
      const optHook = routeHooks.create;
      const h1 = hook.Hook({
        pre: optHook.pre,
        post: optHook.post,
        auth: optHook.auth,
        handler: ctx => handler.create(name, ctx, {
          ext: _this.ext,
          routePrefixs,
          routeHooks
        })
      });
      h1.Pre(h.pre);
      h1.Post(h.post);
      h1.Auth(h.auth);
      yield h1.R(ctx);
    });

    return function (_x3) {
      return _ref4.apply(this, arguments);
    };
  }()]));
  router.put.apply(router, [routePrefixs.update(name, this.opts)].concat(middles, [
  /*#__PURE__*/
  function () {
    var _ref5 = _asyncToGenerator(function* (ctx) {
      const optHook = routeHooks.update;
      const h1 = hook.Hook({
        pre: optHook.pre,
        post: optHook.post,
        auth: optHook.auth,
        handler: ctx => handler.update(name, ctx, {
          ext: _this.ext,
          routePrefixs,
          routeHooks
        })
      });
      h1.Pre(h.pre);
      h1.Post(h.post);
      h1.Auth(h.auth);
      yield h1.R(ctx);
    });

    return function (_x4) {
      return _ref5.apply(this, arguments);
    };
  }()]));
  router.delete.apply(router, [routePrefixs.delete(name, this.opts)].concat(middles, [
  /*#__PURE__*/
  function () {
    var _ref6 = _asyncToGenerator(function* (ctx) {
      const optHook = routeHooks.delete;
      const h1 = hook.Hook({
        pre: optHook.pre,
        post: optHook.post,
        auth: optHook.auth,
        handler: ctx => handler.delete(name, ctx, {
          ext: _this.ext,
          routePrefixs,
          routeHooks
        })
      });
      h1.Pre(h.pre);
      h1.Post(h.post);
      h1.Auth(h.auth);
      yield h1.R(ctx);
    });

    return function (_x5) {
      return _ref6.apply(this, arguments);
    };
  }()]));
  return h;
}; // default params


repo.Api.defaultOpts = {
  prefix: '/mgo',
  featurePrefix: '',
  routePrefixs: {
    one: function (name) {
      let api = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      let prefix = '';

      if (api.prefix) {
        prefix = `${prefix}${api.prefix}`;
      }

      if (api.featurePrefix) {
        prefix = `${prefix}${api.featurePrefix}`;
      }

      return `${prefix}/${name}/:id`;
    },
    list: function (name) {
      let api = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      let prefix = '';

      if (api.prefix) {
        prefix = `${prefix}${api.prefix}`;
      }

      if (api.featurePrefix) {
        prefix = `${prefix}${api.featurePrefix}`;
      }

      return `${prefix}/${name}`;
    },
    create: function (name) {
      let api = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      let prefix = '';

      if (api.prefix) {
        prefix = `${prefix}${api.prefix}`;
      }

      if (api.featurePrefix) {
        prefix = `${prefix}${api.featurePrefix}`;
      }

      return `${prefix}/${name}`;
    },
    update: function (name) {
      let api = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      let prefix = '';

      if (api.prefix) {
        prefix = `${prefix}${api.prefix}`;
      }

      if (api.featurePrefix) {
        prefix = `${prefix}${api.featurePrefix}`;
      }

      return `${prefix}/${name}`;
    },
    delete: function (name) {
      let api = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      let prefix = '';

      if (api.prefix) {
        prefix = `${prefix}${api.prefix}`;
      }

      if (api.featurePrefix) {
        prefix = `${prefix}${api.featurePrefix}`;
      }

      return `${prefix}/${name}`;
    }
  },
  routeHooks: {
    one: {
      cond: function () {
        var _ref7 = _asyncToGenerator(function* (_cond) {
          return _objectSpread({}, _cond, {
            _dr: {
              $ne: true
            }
          });
        });

        return function cond(_x6) {
          return _ref7.apply(this, arguments);
        };
      }()
    },
    list: {
      cond: function () {
        var _ref8 = _asyncToGenerator(function* (_cond2) {
          return _objectSpread({}, _cond2, {
            _dr: {
              $ne: true
            }
          });
        });

        return function cond(_x7) {
          return _ref8.apply(this, arguments);
        };
      }()
    },
    create: {
      body: function () {
        var _ref9 = _asyncToGenerator(function* (_body) {
          return {
            docs: _body.docs.map(x => _objectSpread({}, x, {
              _dr: false,
              _createdAt: moment().unix()
            })),
            category: _body.category
          };
        });

        return function body(_x8) {
          return _ref9.apply(this, arguments);
        };
      }()
    },
    delete: {
      update: function () {
        var _ref10 = _asyncToGenerator(function* (set) {
          return _objectSpread({}, set, {
            _dr: true,
            _modifiedAt: moment().unix()
          });
        });

        return function update(_x9) {
          return _ref10.apply(this, arguments);
        };
      }()
    },
    update: {
      body: function () {
        var _ref11 = _asyncToGenerator(function* (_body2) {
          return {
            docs: _body2.docs.map(x => _objectSpread({}, x, {
              _dr: false,
              _modifiedAt: moment().unix()
            })),
            category: _body2.category
          };
        });

        return function body(_x10) {
          return _ref11.apply(this, arguments);
        };
      }()
    }
  }
};