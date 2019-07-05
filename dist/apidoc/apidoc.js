"use strict";

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

// Copyright (c) 2018-2020 Double.  All rights reserved.
// Use of this source code is governed by a MIT style
// license that can be found in the LICENSE file.
const fsx = require('fs-extra');

const assert = require('assert');

const send = require('koa-send');

const path = require('path');

function ApiDoc(_ref) {
  let {
    prefix
  } = _ref;

  if (!(this instanceof ApiDoc)) {
    return new ApiDoc({
      prefix
    });
  }

  assert(prefix, 'prefix is required to serve files');
  this.prefix = prefix;
  fsx.copyFile(path.join(__dirname, 'template', 'api_data_backup.js'), path.join(__dirname, 'template', 'api_data.js'));
  fsx.copyFile(path.join(__dirname, 'template', 'api_data_backup.json'), path.join(__dirname, 'template', 'api_data.json'));
  fsx.copyFile(path.join(__dirname, 'template', 'api_data_sys_backup.js'), path.join(__dirname, 'template', 'api_data_sys.js'));
  fsx.copyFile(path.join(__dirname, 'template', 'api_data_sys_backup.json'), path.join(__dirname, 'template', 'api_data_sys.json'));
  fsx.copyFile(path.join(__dirname, 'template', 'api_project_backup.js'), path.join(__dirname, 'template', 'api_project.js'));
  fsx.copyFile(path.join(__dirname, 'template', 'api_project_backup.json'), path.join(__dirname, 'template', 'api_project.json'));
}

ApiDoc.prototype.doc = function (dir) {
  fsx.copyFile(path.join(dir, 'api_data.js'), path.join(__dirname, 'template', 'api_data.js'));
  fsx.copyFile(path.join(dir, 'api_project.js'), path.join(__dirname, 'template', 'api_project.js'));
  return this;
};

ApiDoc.prototype.plugin = function (_ref2) {
  var _this = this;

  let {
    httpProxy
  } = _ref2;
  httpProxy.use(
  /*#__PURE__*/
  function () {
    var _ref3 = _asyncToGenerator(function* (ctx, next) {
      const urlPath = ctx.path;

      if (urlPath.startsWith(_this.prefix)) {
        if (ctx.method !== 'HEAD' && ctx.method !== 'GET') return;
        if (ctx.body != null || ctx.status !== 404) return;

        try {
          yield send(ctx, urlPath.replace(_this.prefix, ''), {
            index: 'index.html',
            root: path.join(__dirname, 'template')
          });
        } catch (err) {
          if (err.status !== 404) {
            throw err;
          }
        }
      }
    });

    return function (_x, _x2) {
      return _ref3.apply(this, arguments);
    };
  }());
};

module.exports = ApiDoc;