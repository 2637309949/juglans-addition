const repo = module.exports

repo.Hook = function ({ mgo, handler }) {
  if (!(this instanceof repo.Hook)) {
    return new repo.Hook({ mgo, handler })
  }
  this.R = this.route()
  this.handler = handler
  this.mgo = mgo
}

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

repo.Hook.prototype.Pre = function (pre) {
  this.pre = pre
  return this
}

repo.Hook.prototype.Post = function (post) {
  this.post = post
  return this
}
