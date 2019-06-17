"use strict";

// Copyright (c) 2018-2020 Double.  All rights reserved.
// Use of this source code is governed by a MIT style
// license that can be found in the LICENSE file.
const mongoose = require('./mgo/mgo');

const Redis = require('./redis/redis');

const mailer = require('./mailer/mailer');

module.exports = {
  mongoose,
  mailer,
  Redis
};