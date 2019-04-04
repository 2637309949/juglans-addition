"use strict";

const winston = require('winston');

const {
  combine,
  timestamp,
  printf,
  colorize
} = winston.format;

const path = require('path');

const repo = module.exports;
const format = combine(colorize(), timestamp(), printf((_ref) => {
  let {
    level,
    message,
    label,
    timestamp
  } = _ref;
  return `${timestamp} ${level}: ${message}`;
})); //
// - Write to all logs with level `info` and below to `combined.log`
// - Write all logs error (and below) to `error.log`.
//

repo.createLogger = (_ref2) => {
  let {
    logger: {
      service,
      maxsize,
      path: _path
    }
  } = _ref2;
  return winston.createLogger({
    level: 'info',
    format,
    defaultMeta: {
      service
    },
    transports: [new winston.transports.File({
      filename: path.join(_path, 'error.log'),
      level: 'error'
    }), new winston.transports.File({
      filename: path.join(_path, 'combined.log'),
      maxsize
    }), new winston.transports.Console({
      format
    })]
  });
}; //
// - Write to all logs with level `info` and below to `combined.log`
// - Write all logs error (and below) to `error.log`.
//


repo.createHttpLogger = (_ref3) => {
  let {
    logger: {
      service,
      maxsize,
      path: _path
    }
  } = _ref3;
  winston.addColors({
    'http': 'cyan'
  });
  return winston.createLogger({
    level: 'http',
    format,
    defaultMeta: {
      service
    },
    transports: [new winston.transports.File({
      filename: path.join(_path, 'http.log'),
      level: 'http',
      maxsize
    }), new winston.transports.File({
      filename: path.join(_path, 'combined.log'),
      maxsize
    }), new winston.transports.Console({
      format
    })]
  });
}; //
// - Write to all logs with level `info` and below to `combined.log`
// - Write all logs error (and below) to `error.log`.
//


repo.createConsoleLogger = () => {
  return winston.createLogger({
    level: 'info',
    format,
    transports: [new winston.transports.Console({
      format
    })]
  });
};