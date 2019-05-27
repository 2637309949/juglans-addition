/**
 * @author [Double]
 * @email [2637309949@qq.com]
 * @create date 2019-01-05 14:31:34
 * @modify date 2019-01-05 14:31:34
 * @desc [mongoose Hook]
 */

const repo = module.exports

repo.Hook = function ({ mgo, handler }) {
  if (!(this instanceof repo.Hook)) {
    return new repo.Hook({ mgo, handler })
  }
  this.R = this.route()
  this.handler = handler
  this.mgo = mgo
}

// Wrap spec model router with pre and post hooks
repo.Hook.prototype.route = function () {
  return async ctx => {
    if (this.pre != null) {
      await this.pre(ctx)
    }
    if (this.handler != null) {
      await this.handler(ctx)
    }
    if (this.post != null) {
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
