// Copyright (c) 2018-2020 Double.  All rights reserved.
// Use of this source code is governed by a MIT style
// license that can be found in the LICENSE file.

const _ = require('lodash')
const moment = require('moment')
const logger = require('../logger')
const Query = require('./query')
const utils = require('./utils')

const repo = module.exports

repo.one = async function (name, ctx, ext, opts) {
  try {
    const key = utils.findStringSubmatch(/:(.*)$/, opts.routePrefixs.one(name, opts))
    const id = ctx.params[key[0]]
    const Model = ext.Model(name)
    const q = Query(ctx.query).build()
    const cond = await opts.routeHooks.one.cond({ _id: id }, {name})
    const query = Model.findOne(cond, q.project)
    for (const pop of q.populate) {
      query.populate(pop)
    }
    const result = await query.exec()
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

repo.list = async function (name, ctx, ext, opts) {
  try {
    let totalpages
    let totalrecords
    let result
    const q = Query(ctx.query).build()
    const Model = ext.Model(name)
    const where = await opts.routeHooks.list.cond(q.cond, {name})
    let query = Model.find(where, q.project).sort(q.sort)
    for (const pop of q.populate) {
      query.populate(pop)
    }
    if (q.range === 'PAGE') {
      query = query.skip((q.page - 1) * q.size).limit(q.size)
      result = await query.exec()
      totalrecords = await Model.where(where).countDocuments()
      totalpages = Math.ceil(totalrecords / q.size)
      ctx.status = 200
      ctx.body = {
        cond: q.cond,
        page: q.page,
        size: q.size,
        sort: q.sort,
        project: q.project,
        populate: q.populate,
        totalpages,
        totalrecords,
        data: result
      }
    } else if (q.range === 'ALL') {
      result = await query.exec()
      totalrecords = result.length
      ctx.status = 200
      ctx.body = {
        cond: q.cond,
        sort: q.sort,
        project: q.project,
        populate: q.populate,
        totalrecords,
        data: result
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
    const result = await Model.create(docs)
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

repo.delete = async function (name, ctx, ext, opts) {
  try {
    const Model = ext.Model(name)
    const { docs } = await opts.routeHooks.delete.form(ctx.request.body, {name})
    const noid = _.find(docs, function (doc) {
      return doc['_id'] === undefined || doc['_id'] === '' || doc['_id'] === null
    })
    if (noid) {
      ctx.body = {
        message: 'no id found'
      }
      return
    }
    const result = await Model.bulkWrite(docs.map(x => {
      return {
        updateOne: {
          filter: { _id: x._id },
          update: { $set: { _deletedAt: moment().unix() } },
          upsert: false
        }
      }
    }))
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

repo.update = async function (name, ctx, ext, opts) {
  try {
    const { docs } = await opts.routeHooks.update.form(ctx.request.body, {name})
    const Model = ext.Model(name)
    const noid = _.find(docs, function (doc) {
      return doc['_id'] === undefined || doc['_id'] === '' || doc['_id'] === null
    })
    if (noid) {
      ctx.body = {
        message: 'no id found'
      }
      return
    }
    const ret = await Model.bulkWrite(docs.map(x => {
      return {
        updateOne: {
          filter: { _id: x._id },
          update: { $set: x },
          upsert: false
        }
      }
    }))
    ctx.status = 200
    ctx.body = ret
  } catch (error) {
    logger.error(error.stack || error.message)
    ctx.status = 500
    ctx.body = {
      message: 'Internal Server Error'
    }
  }
}
