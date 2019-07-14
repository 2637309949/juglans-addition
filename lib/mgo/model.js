// Copyright (c) 2018-2020 Double.  All rights reserved.
// Use of this source code is governed by a MIT style
// license that can be found in the LICENSE file.

module.exports = {
  createdAt: {
    type: Date,
    displayName: '创建时间',
    require: true
  },
  updatedAt: {
    type: Date,
    displayName: '修改时间',
    remark: 'UNIX时间戳'
  },
  deletedAt: {
    type: Date,
    displayName: '删除时间',
    remark: 'UNIX时间戳'
  }
}
