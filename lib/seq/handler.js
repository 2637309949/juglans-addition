// Copyright (c) 2018-2020 Double.  All rights reserved.
// Use of this source code is governed by a MIT style
// license that can be found in the LICENSE file.

const _ = require('lodash')
const logger = require('../logger')
const Query = require('./query')
const utils = require('./utils')

const repo = module.exports

repo.one = async function (name, ctx, ext, opts) {
  try {
    const key = utils.findStringSubmatch(/:(.*)$/, opts.routePrefixs.one(name, opts))
    const id = ctx.params[key]
    const Model = ext.Model(name)
    const q = Query(ctx.query)
    const project = q.buildProject()
    const populate = q.buildPopulate(Model)
    const cond = { where: { id } }
    cond.where = await opts.routeHooks.one.cond(cond.where, {name})
    if (project.length > 0) {
      cond.attributes = project
    }
    cond.include = populate
    const result = await Model.findOne(cond)
    ctx.status = 200
    ctx.body = result
  } catch (error) {
    logger.error(error.stack || error.message)
    ctx.status = 500
    ctx.body = {
      message: 'Internal Server Error'
    }
  }
}

repo.list = async function (name, ctx, ext, opts) {
  try {
    let data
    let totalpages
    let totalrecords
    const Model = ext.Model(name)
    const q = Query(ctx.query)
    const cond = q.buildCond()
    const sort = q.buildSort()
    const project = q.buildProject()
    const populate = q.buildPopulate(Model)
    const match = { where: cond }
    match.where = await opts.routeHooks.list.cond(match.where, {name})

    if (project.length > 0) {
      match.attributes = project
    }
    if (populate.length > 0) {
      match.include = populate
    }
    if (q.range === 'PAGE') {
      match.offset = (q.page - 1) * q.size
      match.limit = q.size
    }
    data = await Model.findAll(match)
    totalrecords = await Model.count(match)

    if (q.range === 'PAGE') {
      totalpages = Math.ceil(totalrecords / q.size)
      ctx.status = 200
      ctx.body = {
        cond: q.condMap,
        page: q.page,
        size: q.size,
        sort,
        project,
        populate: populate,
        totalpages,
        totalrecords,
        data
      }
    } else {
      ctx.status = 200
      ctx.body = {
        cond,
        sort,
        project,
        populate: populate,
        totalrecords,
        data
      }
    }
  } catch (error) {
    logger.error(error.stack || error.message)
    ctx.status = 500
    ctx.body = {
      message: 'Internal Server Error'
    }
  }
}

repo.create = async function (name, ctx, ext, opts) {
  try {
    const Model = ext.Model(name)
    const { docs } = await opts.routeHooks.create.form(ctx.request.body, {name})
    const result = await Model.bulkCreate(docs)
    ctx.status = 200
    ctx.body = result
  } catch (error) {
    logger.error(error.stack || error.message)
    ctx.status = 500
    ctx.body = {
      message: error.message
    }
  }
}

repo.delete = async function (name, ctx, ext, opts) {
  try {
    const Model = ext.Model(name)
    const { docs } = await opts.routeHooks.delete.form(ctx.request.body, {name})
    const noid = _.find(docs, function (doc) {
      return doc['id'] === undefined || doc['id'] === '' || doc['id'] === null
    })
    if (noid) {
      ctx.body = {
        message: 'no id found'
      }
      return
    }
    const results = []
    for (const item of docs) {
      const result = await Model.update({ deletedAt: new Date() }, { where: { id: item.id } })
      results.push(result)
    }
    ctx.status = 200
    ctx.body = results
  } catch (error) {
    logger.error(error.stack || error.message)
    ctx.status = 500
    ctx.body = {
      message: 'Internal Server Error'
    }
  }
}

repo.update = async function (name, ctx, ext, opts) {
  try {
    const { docs } = await opts.routeHooks.update.form(ctx.request.body, {name})
    const Model = ext.Model(name)
    const results = []
    const noid = _.find(docs, function (doc) {
      return doc['id'] === undefined || doc['id'] === '' || doc['id'] === null
    })
    if (noid) {
      ctx.body = {
        message: 'no id found'
      }
      return
    }
    for (const item of docs) {
      const result = await Model.update(item, { where: { id: item.id }, fields: Object.keys(item) })
      results.push(result)
    }
    ctx.status = 200
    ctx.body = results
  } catch (error) {
    logger.error(error.stack || error.message)
    ctx.status = 500
    ctx.body = {
      message: 'Internal Server Error'
    }
  }
}
