// Copyright (c) 2018-2020 Double.  All rights reserved.
// Use of this source code is governed by a MIT style
// license that can be found in the LICENSE file.

function API (opts = {}, ext) {
  ext = ext || this
  if (!(this instanceof API)) {
    return new API(opts, ext)
  }
  this.opts = opts
  this.ext = ext
}

API.prototype.plugin = function ({ router }) {
  this.ext.api.setAPI(this)
  for (const item of this.ext.m) {
    if (item.autoHook === true || item.autoHook === undefined) {
      this.ext.api.ALL(router, item.name)
    }
  }
}

module.exports = API
