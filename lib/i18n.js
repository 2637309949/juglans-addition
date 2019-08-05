// Copyright (c) 2018-2020 Double.  All rights reserved.
// Use of this source code is governed by a MIT style
// license that can be found in the LICENSE file.

const is = require('is')
const assert = require('assert')
const deepmerge = require('deepmerge')

const SYS_JUGLANS_I18N_INIT = 'SYS_JUGLANS_I18N_INIT'

const EVENTS = {
  [SYS_JUGLANS_I18N_INIT]: SYS_JUGLANS_I18N_INIT
}

function I18N (opts = {}) {
  if (!(this instanceof I18N)) {
    return new I18N(opts)
  }
  this.locale = 'zh_CN'
  this.locales = I18N.defaultLocales
  this.opts = deepmerge.all([I18N.defaultOpts, opts])
}

I18N.prototype.pre = function () {
  if (this.opts.initFunc) {
    return this.opts.initFunc()
  }
}

I18N.prototype.plugin = function ({ router, httpProxy, events }) {
  const prefix = this.opts.prefix
  httpProxy.use(async (ctx, next) => {
    const locale = await this.opts.ctxLocale(ctx)
    if (locale) {
      this.locale = locale
    }
    await next()
  })
  router.get(`${prefix}`, async ctx => (ctx.body = this.locales))
  router.get(`${prefix}/:locale`, async ctx => (ctx.body = this.locales[ctx.params.locale]))
  events.on(EVENTS.SYS_JUGLANS_I18N_INIT, message => {
    if (this.opts.initFunc) {
      return this.opts.initFunc()
    }
  })
  return { i18n: this }
}

I18N.prototype.initLocal = async function (func) {
  assert.ok(is.function(func), 'params must be func')
  const initFunc = await func(this)
  assert.ok(is.function(initFunc), 'ret must be func')
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

const localeKey = 'locale'
I18N.defaultOpts = {
  prefix: '/i18n',
  async ctxLocale (ctx) {
    return ctx.query[localeKey] ||
          ctx.Request.body[localeKey] ||
          ctx.cookies.get(localeKey) ||
          ctx.get(localeKey)
  }
}

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
}

module.exports = I18N
