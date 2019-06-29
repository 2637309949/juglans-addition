// Copyright (c) 2018-2020 Double.  All rights reserved.
// Use of this source code is governed by a MIT style
// license that can be found in the LICENSE file.

const fsx = require('fs-extra')
const path = require('path')
const winston = require('winston')

let transports
let { JLOG_PATH = '', JLOG_SIZE = 10 } = process.env
let { combine, timestamp, printf, colorize } = winston.format

const format = combine(
  colorize(),
  timestamp(),
  printf(({ level, message, timestamp }) => {
    return `[${level}]: ${timestamp} ${message}`
  })
)

if (JLOG_PATH) {
  fsx.ensureDirSync(JLOG_PATH)
  JLOG_SIZE = parseInt(JLOG_SIZE)
  transports = [
    new winston.transports.File({ filename: path.join(JLOG_PATH, 'error.log'), level: 'error', maxsize: 1024 * JLOG_SIZE }),
    new winston.transports.File({ filename: path.join(JLOG_PATH, 'combined.log'), maxsize: 1024 * JLOG_SIZE }),
    new winston.transports.Console({ format })
  ]
} else {
  transports = [
    new winston.transports.Console({ format })
  ]
}

// just for juglans log
module.exports = winston.createLogger({
  level: 'info',
  format,
  transports
})

// create your project log by this ones
module.exports.winston = winston
