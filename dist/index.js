"use strict";

/**
 * @author [Double]
 * @email [2637309949@qq.com]
 * @create date 2019-01-09 17:15:40
 * @modify date 2019-01-09 17:15:40
 * @desc [mudule export]
 */
const mongoose = require('./mgo');

const Redis = require('./redis');

const mailer = require('./mailer');

const logger = require('./logger');

module.exports = {
  mongoose,
  mailer,
  Redis,
  logger
};