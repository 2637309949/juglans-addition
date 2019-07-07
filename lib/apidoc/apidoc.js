// Copyright (c) 2018-2020 Double.  All rights reserved.
// Use of this source code is governed by a MIT style
// license that can be found in the LICENSE file.

const fsx = require('fs-extra')
const assert = require('assert')
const send = require('koa-send')
const path = require('path')

function ApiDoc ({ prefix, mgoExt, seqExt }) {
  if (!(this instanceof ApiDoc)) {
    return new ApiDoc({ prefix, mgoExt, seqExt })
  }

  assert(prefix, 'prefix is required to serve files')
  this.prefix = prefix
  this.mgoExt = mgoExt
  this.seqExt = seqExt

  fsx.copyFile(path.join(__dirname, 'template', 'api_data_backup.js'), path.join(__dirname, 'template', 'api_data.js'))
  fsx.copyFile(path.join(__dirname, 'template', 'api_data_backup.json'), path.join(__dirname, 'template', 'api_data.json'))

  fsx.copyFile(path.join(__dirname, 'template', 'api_data_sys_backup.js'), path.join(__dirname, 'template', 'api_data_sys.js'))
  fsx.copyFile(path.join(__dirname, 'template', 'api_data_sys_backup.json'), path.join(__dirname, 'template', 'api_data_sys.json'))

  fsx.copyFile(path.join(__dirname, 'template', 'api_project_backup.js'), path.join(__dirname, 'template', 'api_project.js'))
  fsx.copyFile(path.join(__dirname, 'template', 'api_project_backup.json'), path.join(__dirname, 'template', 'api_project.json'))
}

ApiDoc.prototype.doc = function (dir) {
  fsx.copyFile(path.join(dir, 'api_data.js'), path.join(__dirname, 'template', 'api_data.js'))
  fsx.copyFile(path.join(dir, 'api_project.js'), path.join(__dirname, 'template', 'api_project.js'))
  return this
}

ApiDoc.prototype.writeSysDoc = function (docs) {
  const apilist = `define({ "api": ${JSON.stringify(docs)} })`
  fsx.writeFileSync(path.join(__dirname, 'template', 'api_data_sys.js'), apilist)
}

ApiDoc.prototype.plugin = function ({ httpProxy }) {
  let docs = []
  if (this.mgoExt) {
    docs = docs.concat(this.mgoExt.Docs())
  }
  if (this.seqExt) {
    docs = docs.concat(this.seqExt.Docs())
  }
  this.writeSysDoc(docs)

  httpProxy.use(async (ctx, next) => {
    const urlPath = ctx.path
    if (urlPath.startsWith(this.prefix)) {
      if (ctx.method !== 'HEAD' && ctx.method !== 'GET') return
      if (ctx.body != null || ctx.status !== 404) return
      try {
        await send(ctx, urlPath.replace(this.prefix, ''), { index: 'index.html', root: path.join(__dirname, 'template') })
      } catch (err) {
        if (err.status !== 404) {
          throw err
        }
      }
    }
  })
}

module.exports = ApiDoc
