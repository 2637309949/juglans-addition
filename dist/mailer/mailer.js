"use strict";

/**
 * @author [double]
 * @email [2637309949@qq.com]
 * @create date 2019-03-20 11:35:41
 * @modify date 2019-03-20 11:35:41
 * @desc [description]
 */
const nodemailer = require('nodemailer');

const app = {};
module.exports = app;

app.init = config => {
  app.config = config;
  app.transporter = nodemailer.createTransport(config.smtp);
  return app.transporter;
};

app.sendMail = (mailOptions, callback) => {
  if (!app.transporter) {
    throw new Error('No transporter found!');
  }

  mailOptions.from = app.config.emailFrom;
  app.transporter.sendMail(mailOptions, callback);
};