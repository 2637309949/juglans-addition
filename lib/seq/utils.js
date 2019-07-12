// Copyright (c) 2018-2020 Double.  All rights reserved.
// Use of this source code is governed by a MIT style
// license that can be found in the LICENSE file.

const repo = module.exports
const _ = require('lodash')
const is = require('is')
const Sequelize = require('sequelize')
const Op = Sequelize.Op

repo.associations = function (model) {
  const associations = Object.values(model.associations)
  return associations.map(arr => Object.values(arr)).map(arr => {
    const [, model, {as, foreignKey}] = arr
    return {
      model,
      as,
      foreignKey
    }
  })
}

// findStringSubmatch defined regex matcher
repo.findStringSubmatch = function findStringSubmatch (matcher, content) {
  const re = new RegExp(matcher)
  const r = content.match(re)
  if (r) {
    return r.slice(1)
  }
  return null
}

function toOperators (where) {
  if (is.object(where)) {
    _.keys(where).forEach(key => {
      const k = key
      const v = toOperators(where[key])
      if (k[0] === '$') {
        const op = k.slice(1)
        if (Op[op]) {
          delete where[k]
          where[Op[op]] = v
        }
      }
    })
  } else if (is.array(where)) {
    return where.map(v => toOperators(v))
  }
  return where
}

repo.toOperators = function (where) {
  return toOperators(_.cloneDeep(where))
}
