"use strict";

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

// Copyright (c) 2018-2020 Double.  All rights reserved.
// Use of this source code is governed by a MIT style
// license that can be found in the LICENSE file.
const is = require('is');

const merge = require('deepmerge');

const doc = require('./doc');

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
  const opts = merge.all([this.opts, _.get(profile, 'opts', {})]);
  const optHook = opts.routeHooks.one;
  const h = hook.Hook({
    pre: optHook.pre,
    post: optHook.post,
    auth: optHook.auth,
    handler: ctx => handler.one(name, ctx, this.ext, opts)
  });

  for (var _len = arguments.length, middles = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
    middles[_key - 2] = arguments[_key];
  }

  middles.push(h.R);
  router.get.apply(router, [opts.routePrefixs.one(name, opts)].concat(middles));
  profile.docs = profile.docs.concat(doc.GenDoc({
    profile,
    opts,
    apis: ['one']
  }));
  return h;
};

repo.Api.prototype.List = function (router, name) {
  const profile = this.ext.Profile(name);
  const opts = merge.all([this.opts, _.get(profile, 'opts', {})]);
  const optHook = opts.routeHooks.list;
  const h = hook.Hook({
    pre: optHook.pre,
    post: optHook.post,
    auth: optHook.auth,
    handler: ctx => handler.list(name, ctx, this.ext, opts)
  });

  for (var _len2 = arguments.length, middles = new Array(_len2 > 2 ? _len2 - 2 : 0), _key2 = 2; _key2 < _len2; _key2++) {
    middles[_key2 - 2] = arguments[_key2];
  }

  middles.push(h.R);
  router.get.apply(router, [opts.routePrefixs.list(name, opts)].concat(middles));
  profile.docs = profile.docs.concat(doc.GenDoc({
    profile,
    opts,
    apis: ['list']
  }));
  return h;
};

repo.Api.prototype.Create = function (router, name) {
  const profile = this.ext.Profile(name);
  const opts = merge.all([this.opts, _.get(profile, 'opts', {})]);
  const optHook = opts.routeHooks.create;
  const h = hook.Hook({
    pre: optHook.pre,
    post: optHook.post,
    auth: optHook.auth,
    handler: ctx => handler.create(name, ctx, this.ext, opts)
  });

  for (var _len3 = arguments.length, middles = new Array(_len3 > 2 ? _len3 - 2 : 0), _key3 = 2; _key3 < _len3; _key3++) {
    middles[_key3 - 2] = arguments[_key3];
  }

  middles.push(h.R);
  router.post.apply(router, [opts.routePrefixs.create(name, opts)].concat(middles));
  profile.docs = profile.docs.concat(doc.GenDoc({
    profile,
    opts,
    apis: ['create']
  }));
  return h;
};

repo.Api.prototype.Update = function (router, name) {
  const profile = this.ext.Profile(name);
  const opts = merge.all([this.opts, _.get(profile, 'opts', {})]);
  const optHook = opts.routeHooks.update;
  const h = hook.Hook({
    pre: optHook.pre,
    post: optHook.post,
    auth: optHook.auth,
    handler: ctx => handler.update(name, ctx, this.ext, opts)
  });

  for (var _len4 = arguments.length, middles = new Array(_len4 > 2 ? _len4 - 2 : 0), _key4 = 2; _key4 < _len4; _key4++) {
    middles[_key4 - 2] = arguments[_key4];
  }

  middles.push(h.R);
  router.put.apply(router, [opts.routePrefixs.update(name, opts)].concat(middles));
  profile.docs = profile.docs.concat(doc.GenDoc({
    profile,
    opts,
    apis: ['update']
  }));
  return h;
};

repo.Api.prototype.Delete = function (router, name) {
  const profile = this.ext.Profile(name);
  const opts = merge.all([this.opts, _.get(profile, 'opts', {})]);
  const optHook = opts.routeHooks.delete;
  const h = hook.Hook({
    pre: optHook.pre,
    post: optHook.post,
    auth: optHook.auth,
    handler: ctx => handler.delete(name, ctx, this.ext, opts)
  });

  for (var _len5 = arguments.length, middles = new Array(_len5 > 2 ? _len5 - 2 : 0), _key5 = 2; _key5 < _len5; _key5++) {
    middles[_key5 - 2] = arguments[_key5];
  }

  middles.push(h.R);
  router.delete.apply(router, [opts.routePrefixs.delete(name, opts)].concat(middles));
  profile.docs = profile.docs.concat(doc.GenDoc({
    profile,
    opts,
    apis: ['delete']
  }));
  return h;
};

repo.Api.prototype.ALL = function (router, name) {
  var _this = this;

  const profile = this.ext.Profile(name);
  const opts = merge.all([this.opts, _.get(profile, 'opts', {})]);
  const h = hook.Hook({});

  for (var _len6 = arguments.length, middles = new Array(_len6 > 2 ? _len6 - 2 : 0), _key6 = 2; _key6 < _len6; _key6++) {
    middles[_key6 - 2] = arguments[_key6];
  }

  router.get.apply(router, [opts.routePrefixs.one(name, opts)].concat(middles, [
  /*#__PURE__*/
  function () {
    var _ref2 = _asyncToGenerator(function* (ctx) {
      const optHook = opts.routeHooks.one;
      const h1 = hook.Hook({
        pre: optHook.pre,
        post: optHook.post,
        auth: optHook.auth,
        handler: ctx => handler.one(name, ctx, _this.ext, opts)
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
  router.get.apply(router, [opts.routePrefixs.list(name, this.opts)].concat(middles, [
  /*#__PURE__*/
  function () {
    var _ref3 = _asyncToGenerator(function* (ctx) {
      const optHook = opts.routeHooks.list;
      const h1 = hook.Hook({
        pre: optHook.pre,
        post: optHook.post,
        auth: optHook.auth,
        handler: ctx => handler.list(name, ctx, _this.ext, opts)
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
  router.post.apply(router, [opts.routePrefixs.create(name, this.opts)].concat(middles, [
  /*#__PURE__*/
  function () {
    var _ref4 = _asyncToGenerator(function* (ctx) {
      const optHook = opts.routeHooks.create;
      const h1 = hook.Hook({
        pre: optHook.pre,
        post: optHook.post,
        auth: optHook.auth,
        handler: ctx => handler.create(name, ctx, _this.ext, opts)
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
  router.put.apply(router, [opts.routePrefixs.update(name, this.opts)].concat(middles, [
  /*#__PURE__*/
  function () {
    var _ref5 = _asyncToGenerator(function* (ctx) {
      const optHook = opts.routeHooks.update;
      const h1 = hook.Hook({
        pre: optHook.pre,
        post: optHook.post,
        auth: optHook.auth,
        handler: ctx => handler.update(name, ctx, _this.ext, opts)
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
  router.delete.apply(router, [opts.routePrefixs.delete(name, opts)].concat(middles, [
  /*#__PURE__*/
  function () {
    var _ref6 = _asyncToGenerator(function* (ctx) {
      const optHook = opts.routeHooks.delete;
      const h1 = hook.Hook({
        pre: optHook.pre,
        post: optHook.post,
        auth: optHook.auth,
        handler: ctx => handler.delete(name, ctx, _this.ext, opts)
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
  profile.docs = profile.docs.concat(doc.GenDoc({
    profile,
    opts,
    apis: ['one', 'list', 'create', 'update', 'delete']
  }));
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

      return `${prefix}/${name.toLowerCase()}/:id`;
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

      return `${prefix}/${name.toLowerCase()}`;
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

      return `${prefix}/${name.toLowerCase()}`;
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

      return `${prefix}/${name.toLowerCase()}`;
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

      return `${prefix}/${name.toLowerCase()}`;
    }
  },
  routeHooks: {
    one: {
      cond: function () {
        var _ref7 = _asyncToGenerator(function* (_cond, ctx, opts) {
          return _cond;
        });

        return function cond(_x6, _x7, _x8) {
          return _ref7.apply(this, arguments);
        };
      }()
    },
    list: {
      cond: function () {
        var _ref8 = _asyncToGenerator(function* (_cond2, ctx, opts) {
          return _cond2;
        });

        return function cond(_x9, _x10, _x11) {
          return _ref8.apply(this, arguments);
        };
      }()
    },
    create: {
      form: function () {
        var _ref9 = _asyncToGenerator(function* (_form, opts) {
          return _form;
        });

        return function form(_x12, _x13) {
          return _ref9.apply(this, arguments);
        };
      }()
    },
    delete: {
      form: function () {
        var _ref10 = _asyncToGenerator(function* (_form2, opts) {
          return _form2;
        });

        return function form(_x14, _x15) {
          return _ref10.apply(this, arguments);
        };
      }(),
      cond: function () {
        var _ref11 = _asyncToGenerator(function* (_cond3, ctx, opts) {
          return _cond3;
        });

        return function cond(_x16, _x17, _x18) {
          return _ref11.apply(this, arguments);
        };
      }()
    },
    update: {
      form: function () {
        var _ref12 = _asyncToGenerator(function* (_form3, opts) {
          return _form3;
        });

        return function form(_x19, _x20) {
          return _ref12.apply(this, arguments);
        };
      }(),
      cond: function () {
        var _ref13 = _asyncToGenerator(function* (_cond4, ctx, opts) {
          return _cond4;
        });

        return function cond(_x21, _x22, _x23) {
          return _ref13.apply(this, arguments);
        };
      }()
    }
  }
};