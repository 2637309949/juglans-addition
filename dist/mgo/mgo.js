"use strict";

/**
 * @author [Double]
 * @email [2637309949@qq.com]
 * @create date 2019-01-05 14:31:34
 * @modify date 2019-01-05 14:31:34
 * @desc [mongoose Instance]
 */
const mongoose = require('mongoose');

const assert = require('assert');

const is = require('is');

const api = require('./api'); // Model detailed list


mongoose.m = [];
mongoose.api = api.Api({
  mgo: mongoose
}); // Connect mongo with retry tactics

mongoose.retryConnect = function (uri, opts, cb) {
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
}; // Register model


mongoose.Register = function () {
  let carte = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  assert.ok(is.string(carte.name), 'name can not be empty!');
  assert.ok(is.object(carte.schema), 'schema can not be empty!');
  mongoose.m.push(carte);
  return mongoose.model(carte.name, carte.schema);
};

mongoose.AutoHook = function (_ref) {
  let {
    router,
    roles
  } = _ref;

  for (const item of mongoose.m) {
    if (item.autoHook === true || item.autoHook === undefined) {
      mongoose.api.ALL(router, item.name);
    }
  }
};

module.exports = mongoose;