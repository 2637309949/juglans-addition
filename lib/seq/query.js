// Copyright (c) 2018-2020 Double.  All rights reserved.
// Use of this source code is governed by a MIT style
// license that can be found in the LICENSE file.

const is = require('is')
const utils = require('./utils')

function Query ({ cond = '%7B%7D', sort = '-_createdAt', project = '', populate = '', page = 1, size = 20, range = 'PAGE' }) {
  if (!(this instanceof Query)) {
    return new Query({ cond, sort, project, populate, page, size, range })
  }
  this.cond = cond
  this.condMap = {}
  this.sort = sort
  this.project = project
  this.populate = populate
  this.page = parseInt(page)
  this.size = parseInt(size)
  this.range = range === 'ALL' ? 'ALL' : 'PAGE'
}

Query.prototype.buildCond = function () {
  try {
    if (is.string(this.cond)) {
      let cond = JSON.parse(decodeURIComponent(this.cond))
      this.condMap = cond
      cond = utils.toOperators(cond)
      return cond
    }
    return {}
  } catch (error) {
    console.error('parse cond error!')
    throw error
  }
}

Query.prototype.buildSort = function () {
  if (!this.sort || !this.sort.trim()) return {}
  return this.sort
    .trim()
    .split(',')
    .filter(x => !!x)
    .map(x => x.trim())
    .reduce((acc, curr) => {
      let order = 1
      if (curr.startsWith('-')) {
        curr = curr.substr(1)
        order = -1
      }
      acc[curr] = order
      return acc
    }, {})
}

Query.prototype.buildProject = function () {
  if (!this.project || !this.project.trim()) return []
  return this.project
    .trim()
    .split(',')
    .filter(x => !!x)
    .map(x => x.trim())
}

Query.prototype.buildPopulate = function (model) {
  const associations = utils.associations(model)
  if (!this.populate || !this.populate.trim()) return []
  let populate = this.populate
    .trim()
    .split(',')
    .filter(x => !!x)
    .map(x => x.trim())
  populate = populate.map(x => {
    const assoc = associations.find(as => as.foreignKey === x)
    return assoc
  }).filter(x => !!x).map(x => ({
    model: x.model,
    as: x.as
  }))
  return populate
}

module.exports = Query
