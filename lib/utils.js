// Copyright (c) 2018-2020 Double.  All rights reserved.
// Use of this source code is governed by a MIT style
// license that can be found in the LICENSE file.

const path = require('path')
const repo = module.exports

repo.formatLogArguments = function formatLogArguments (args) {
  args = Array.prototype.slice.call(args)
  var stackInfo = getStackInfo(1)

  if (stackInfo) {
    var calleeStr = '(' + stackInfo.relativePath + ':' + stackInfo.line + ')'
    if (typeof (args[0]) === 'string') {
      args[0] = calleeStr + ' ' + args[0]
    } else {
      args.unshift(calleeStr)
    }
  }
  return args
}

function getStackInfo (stackIndex) {
  var stacklist = (new Error()).stack.split('\n').slice(3)
  var stackReg = /at\s+(.*)\s+\((.*):(\d*):(\d*)\)/gi
  var stackReg2 = /at\s+()(.*):(\d*):(\d*)/gi

  var s = stacklist[stackIndex] || stacklist[0]
  var sp = stackReg.exec(s) || stackReg2.exec(s)

  if (sp && sp.length === 5) {
    return {
      method: sp[1],
      relativePath: path.relative(__filename, sp[2]),
      line: sp[3],
      pos: sp[4],
      file: path.basename(sp[2]),
      stack: stacklist.join('\n')
    }
  }
}
