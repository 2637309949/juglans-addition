// Copyright (c) 2018-2020 Double.  All rights reserved.
// Use of this source code is governed by a MIT style
// license that can be found in the LICENSE file.

const Redis = require('ioredis')

// Connect defined for connect redis server
module.exports.Connect = function Connect (uri, opts, cb = () => {}) {
  opts.lazyConnect = true
  const conn = new Redis(uri, opts)
  conn.connect(cb)
  return conn
}

// export Redis
module.exports.Redis = Redis
