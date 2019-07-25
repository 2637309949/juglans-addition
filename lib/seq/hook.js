// Copyright (c) 2018-2020 Double.  All rights reserved.
// Use of this source code is governed by a MIT style
// license that can be found in the LICENSE file.
const assert = require('assert')
const is = require('is')
const repo = module.exports

const authFailed = ctx => {
  ctx.status = 403
  ctx.body = {
    message: 'Access Denied, you don\'t have permission.'
  }
}

repo.Hook = function ({ handler, pre, post, auth, routeHooks }) {
  if (!(this instanceof repo.Hook)) {
    return new repo.Hook({ handler, pre, post, auth, routeHooks })
  }
  this.R = this.route()
  this.pre = pre
  this.post = post
  this.auth = auth
  this.handler = handler
  this.routeHooks = routeHooks
}

// Wrap spec model router with pre and post hooks
repo.Hook.prototype.route = function () {
  return async ctx => {
    if (this.pre) {
      await this.pre(ctx)
    }
    if (this.handler) {
      if (this.auth) {
        const ret = await this.auth(ctx)
        if (ret) {
          await this.handler(ctx)
        } else {
          authFailed(ctx)
        }
      } else {
        await this.handler(ctx)
      }
    }
    if (this.post) {
      await this.post(ctx)
    }
  }
}

// Pre hook for after exec spec model router
repo.Hook.prototype.Pre = function (pre) {
  if (is.function(pre)) {
    this.pre = pre
  }
  return this
}

// Post hook for after exec spec model router
repo.Hook.prototype.Post = function (post) {
  if (is.function(post)) {
    this.post = post
  }
  return this
}

// Auth hook for after exec spec model router
repo.Hook.prototype.Auth = function (auth) {
  if (is.function(auth)) {
    this.auth = auth
  }
  return this
}

// Auth hook for after exec spec model router
repo.Hook.prototype.RouteHooks = function (hooks) {
  assert.ok(is.object(hooks), 'hooks can not be empty!')
  if (this.routeHooks) {
    this.routeHooks(hooks)
  }
  return this
}
