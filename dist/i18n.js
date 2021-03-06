"use strict";

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

// Copyright (c) 2018-2020 Double.  All rights reserved.
// Use of this source code is governed by a MIT style
// license that can be found in the LICENSE file.
const is = require('is');

const assert = require('assert');

const deepmerge = require('deepmerge');

const SYS_JUGLANS_I18N_INIT = 'SYS_JUGLANS_I18N_INIT';
const EVENTS = {
  [SYS_JUGLANS_I18N_INIT]: SYS_JUGLANS_I18N_INIT
};

function I18N() {
  let opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  if (!(this instanceof I18N)) {
    return new I18N(opts);
  }

  this.locale = 'zh_CN';
  this.locales = I18N.defaultLocales;
  this.opts = deepmerge.all([I18N.defaultOpts, opts]);
}

I18N.prototype.pre = function () {
  if (this.opts.initFunc) {
    return this.opts.initFunc();
  }
};

I18N.prototype.plugin = function (_ref) {
  var _this = this;

  let {
    router,
    httpProxy,
    events
  } = _ref;
  const prefix = this.opts.prefix;
  httpProxy.use(
  /*#__PURE__*/
  function () {
    var _ref2 = _asyncToGenerator(function* (ctx, next) {
      const locale = yield _this.opts.ctxLocale(ctx);

      if (locale) {
        _this.locale = locale;
      }

      yield next();
    });

    return function (_x, _x2) {
      return _ref2.apply(this, arguments);
    };
  }());
  router.get(`${prefix}`,
  /*#__PURE__*/
  function () {
    var _ref3 = _asyncToGenerator(function* (ctx) {
      return ctx.body = _this.locales;
    });

    return function (_x3) {
      return _ref3.apply(this, arguments);
    };
  }());
  router.get(`${prefix}/:locale`,
  /*#__PURE__*/
  function () {
    var _ref4 = _asyncToGenerator(function* (ctx) {
      return ctx.body = _this.locales[ctx.params.locale];
    });

    return function (_x4) {
      return _ref4.apply(this, arguments);
    };
  }());
  events.on(EVENTS.SYS_JUGLANS_I18N_INIT, message => {
    if (this.opts.initFunc) {
      return this.opts.initFunc();
    }
  });
  return {
    i18n: this
  };
};

I18N.prototype.initLocal =
/*#__PURE__*/
function () {
  var _ref5 = _asyncToGenerator(function* (func) {
    assert.ok(is.function(func), 'params must be func');
    const initFunc = yield func(this);
    assert.ok(is.function(initFunc), 'ret must be func');
    this.opts.initFunc = initFunc;
    return this;
  });

  return function (_x5) {
    return _ref5.apply(this, arguments);
  };
}();

I18N.prototype.addLocale = function (locale) {
  let kv = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  this.locales[locale] = kv;
  return this;
};

I18N.prototype.addLocales = function (locales) {
  this.locales = locales;
  return this;
};

I18N.prototype.getLocale = function (locale) {
  return this.locales[locale] || {};
};

I18N.prototype.buildI18nKey = function (mod, key) {
  return `${mod}_${key}`;
};

I18N.prototype.i18nLocale = function (key, init) {
  return this.getLocale(this.locale)[key] || init;
};

const localeKey = 'locale';
I18N.defaultOpts = {
  prefix: '/i18n',

  ctxLocale(ctx) {
    return _asyncToGenerator(function* () {
      return ctx.query[localeKey] || ctx.Request.body[localeKey] || ctx.cookies.get(localeKey) || ctx.get(localeKey);
    })();
  }

};
I18N.defaultLocales = {
  'zh_CN': {
    'sys_hello': '你好'
  },
  'en_US': {
    'sys_hello': 'hello'
  },
  'zh_TW': {
    'sys_hello': '妳好'
  }
};
module.exports = I18N;