"use strict";

// Copyright (c) 2018-2020 Double.  All rights reserved.
// Use of this source code is governed by a MIT style
// license that can be found in the LICENSE file.
const winston = require('winston');

const utils = require('./utils');

let {
  combine,
  timestamp,
  printf,
  colorize
} = winston.format;
const format = combine(colorize(), timestamp(), printf((_ref) => {
  let {
    level,
    message,
    timestamp
  } = _ref;
  return `[${level}]: ${timestamp} ${message}`;
})); // report to my git(2637309949@qq.com)
// wrap for log line number
// performance concerns, maybe

const logger = winston.createLogger({
  level: 'info',
  format,
  transports: [new winston.transports.Console({
    format
  })],
  exitOnError: false
});

logger.debug = function (debug) {
  return function () {
    debug.apply(logger, utils.formatLogArguments(arguments));
  };
}(logger.debug);

logger.info = function (info) {
  return function () {
    info.apply(logger, utils.formatLogArguments(arguments));
  };
}(logger.info);

logger.warn = function (warn) {
  return function () {
    warn.apply(logger, utils.formatLogArguments(arguments));
  };
}(logger.warn);

logger.error = function (error) {
  return function () {
    error.apply(logger, utils.formatLogArguments(arguments));
  };
}(logger.error);

module.exports = logger;
module.exports.winston = winston;