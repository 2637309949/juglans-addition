"use strict";

// Copyright (c) 2018-2020 Double.  All rights reserved.
// Use of this source code is governed by a MIT style
// license that can be found in the LICENSE file.
const Redis = require('ioredis');
/**
 * a function for connect redis server
 * retry retryCount if connect failture
 */


Redis.retryConnect = function (uri, opts) {
  let cb = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : () => {};
  let retryCount = opts.retryCount || 5;
  opts.lazyConnect = true;

  const retryStrategy = function () {
    const redis = new Redis(uri, opts);
    redis.connect((err, data) => {
      cb(err, data);

      if (err) {
        retryCount -= 1;
        if (retryCount >= 0) setTimeout(retryStrategy, 3000);
      }
    });
    return redis;
  };

  return retryStrategy();
};

module.exports = Redis;