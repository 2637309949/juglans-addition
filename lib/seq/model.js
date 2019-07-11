// Copyright (c) 2018-2020 Double.  All rights reserved.
// Use of this source code is governed by a MIT style
// license that can be found in the LICENSE file.

const Sequelize = require('sequelize')

module.exports = {
  createdAt: {
    type: Sequelize.DATE,
    comment: '创建时间'
  },
  deletedAt: {
    type: Sequelize.DATE,
    comment: '删除时间'
  },
  updatedAt: {
    type: Sequelize.DATE,
    comment: '更新时间'
  }
}
