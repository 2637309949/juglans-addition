// Copyright (c) 2018-2020 Double.  All rights reserved.
// Use of this source code is governed by a MIT style
// license that can be found in the LICENSE file.

const nodemailer = require('nodemailer')

const app = {}
module.exports = app

app.init = (config) => {
  app.config = config
  app.transporter = nodemailer.createTransport(config.smtp)
  return app.transporter
}

app.sendMail = (mailOptions, callback) => {
  if (!app.transporter) {
    throw new Error('No transporter found!')
  }
  mailOptions.from = app.config.emailFrom
  app.transporter.sendMail(mailOptions, callback)
}
