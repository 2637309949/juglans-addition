// Copyright (c) 2018-2020 Double.  All rights reserved.
// Use of this source code is governed by a MIT style
// license that can be found in the LICENSE file.

const repo = module.exports

const authFailed = ctx => {
  ctx.status = 403
  ctx.body = {
    message: 'Access Denied, you don\'t have permission.'
  }
}

repo.Hook = function ({ handler }) {
  if (!(this instanceof repo.Hook)) {
    return new repo.Hook({ handler })
  }
  this.R = this.route()
  this.pre = null
  this.post = null
  this.auth = null
  this.handler = handler
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
  this.pre = pre
  return this
}

// Post hook for after exec spec model router
repo.Hook.prototype.Post = function (post) {
  this.post = post
  return this
}

// Auth hook for after exec spec model router
repo.Hook.prototype.Auth = function (auth) {
  this.auth = auth
  return this
}