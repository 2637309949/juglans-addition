"use strict";

// Copyright (c) 2018-2020 Double.  All rights reserved.
// Use of this source code is governed by a MIT style
// license that can be found in the LICENSE file.
const mongoose = require('mongoose');

const assert = require('assert');

const is = require('is');

const merge = require('deepmerge');

const api = require('./api');

const model = require('./model');

const DefaultAPI = require('./plugin');

mongoose.ext = {};
mongoose.ext.m = [];
mongoose.ext.api = api.Api({
  mongoose
});

mongoose.ext.retryConnect = function (uri, opts, cb) {
  let retryCount = opts.retryCount || 5;

  const retryStrategy = function () {
    mongoose.connect(uri, opts, (err, data) => {
      cb(err, data);

      if (err) {
        retryCount -= 1;
        assert.ok(retryCount < 0, 'retryConnect clear!');
        setTimeout(retryStrategy, 3000);
      }
    });
    return mongoose;
  };

  return retryStrategy();
};

mongoose.ext.routeHooks = function (name, defaultAPI) {
  const profile = mongoose.ext.m.find(x => x.name === name);
  return merge.all([profile.routeHooks || {}, defaultAPI.routeHooks]);
}; // Register model


mongoose.ext.Register = function () {
  let schema = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  assert.ok(is.string(schema.name), 'name can not be empty!');
  assert.ok(is.object(schema.schema), 'schema can not be empty!');
  mongoose.ext.m.push(schema);
  return mongoose.model(schema.name, schema.schema);
};

DefaultAPI.mongoose = mongoose;
mongoose.ext.DefaultAPI = DefaultAPI;
mongoose.ext.CommonFields = model;
module.exports = mongoose;