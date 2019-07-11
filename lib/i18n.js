// Copyright (c) 2018-2020 Double.  All rights reserved.
// Use of this source code is governed by a MIT style
// license that can be found in the LICENSE file.

const is = require('is')
const assert = require('assert')
const deepmerge = require('deepmerge')

function I18N (opts = {}) {
  if (!(this instanceof I18N)) {
    return new I18N(opts)
  }
  this.locales = {
    'zh_CN': {
      'sys_hello': '你好'
    },
    'en_US': {
      'sys_hello': 'hello'
    },
    'zh_TW': {
      'sys_hello': '妳好'
    }
  }
  this.locale = 'zh_CN'
  this.opts = deepmerge.all([I18N.defaultOpts, opts])
}

I18N.prototype.pre = function () {
  if (this.opts.initFunc) {
    return this.opts.initFunc()
  }
}

I18N.prototype.plugin = function ({ router, httpProxy }) {
  const prefix = this.opts.prefix
  httpProxy.use(async (ctx, next) => {
    this.locale = await this.opts.ctxLocale(ctx)
    await next()
  })
  router.get(`${prefix}`, async ctx => {
    ctx.body = this.locales
  })
  router.get(`${prefix}/:locale`, async ctx => {
    ctx.body = this.locales[ctx.params.locale]
  })
  return {
    i18n: this
  }
}

I18N.prototype.initLocal = async function (func) {
  assert.ok(is.function(func), 'must provide func')
  const initFunc = await func(this)
  assert.ok(is.function(initFunc), 'must return func')
  this.opts.initFunc = initFunc
  return this
}

I18N.prototype.addLocale = function (locale, kv = {}) {
  this.locales[locale] = kv
  return this
}

I18N.prototype.addLocales = function (locales) {
  this.locales = locales
  return this
}

I18N.prototype.getLocale = function (locale) {
  return this.locales[locale] || {}
}

I18N.prototype.buildI18nKey = function (mod, str) {
  return `${mod}_${str}`
}

I18N.prototype.i18nLocale = function (str) {
  return this.getLocale(this.locale)[str] || str
}

I18N.defaultOpts = {
  prefix: '/i18n',
  async ctxLocale (ctx) {
    return ctx.query.locale
  }
}

module.exports = I18N
