
const winston = require('winston')
const { combine, timestamp, printf, colorize } = winston.format
const path = require('path')

const repo = module.exports

const format = combine(
  colorize(),
  timestamp(),
  printf(({ level, message, label, timestamp }) => {
    return `${timestamp} ${level}: ${message}`
  })
)

//
// - Write to all logs with level `info` and below to `combined.log`
// - Write all logs error (and below) to `error.log`.
//
repo.createLogger = ({ logger: { service, maxsize, path: _path } }) => {
  return winston.createLogger({
    level: 'info',
    format,
    defaultMeta: { service },
    transports: [
      new winston.transports.File({ filename: path.join(_path, 'error.log'), level: 'error' }),
      new winston.transports.File({ filename: path.join(_path, 'combined.log'), maxsize }),
      new winston.transports.Console({ format })
    ]
  })
}

//
// - Write to all logs with level `info` and below to `combined.log`
// - Write all logs error (and below) to `error.log`.
//
repo.createHttpLogger = ({ logger: { service, maxsize, path: _path } }) => {
  winston.addColors({
    'http': 'cyan'
  })
  return winston.createLogger({
    level: 'http',
    format,
    defaultMeta: { service },
    transports: [
      new winston.transports.File({ filename: path.join(_path, 'http.log'), level: 'http', maxsize }),
      new winston.transports.File({ filename: path.join(_path, 'combined.log'), maxsize }),
      new winston.transports.Console({ format })
    ]
  })
}

//
// - Write to all logs with level `info` and below to `combined.log`
// - Write all logs error (and below) to `error.log`.
//
repo.createConsoleLogger = () => {
  return winston.createLogger({
    level: 'info',
    format,
    transports: [
      new winston.transports.Console({ format })
    ]
  })
}
