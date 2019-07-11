// Copyright (c) 2018-2020 Double.  All rights reserved.
// Use of this source code is governed by a MIT style
// license that can be found in the LICENSE file.

module.exports = {
  _createdAt: {
    type: Number,
    displayName: '创建时间',
    require: true
  },
  _modifiedAt: {
    type: Number,
    displayName: '修改时间',
    remark: 'UNIX时间戳'
  },
  _deletedAt: {
    type: Number,
    displayName: '删除时间',
    remark: 'UNIX时间戳'
  }
}
