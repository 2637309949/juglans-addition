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
    const id = ctx.params[key[0]]
    const Model = ext.Model(name)
    const q = Query(ctx.query).build()
    const cond = await opts.routeHooks.one.cond(_.assign(q.cond, { _id: id, deletedAt: null }), {name})
    const query = Model.findOne(cond, q.project)
    q.populate.forEach(pop => {
      query.populate(pop)
    })
    ctx.status = 200
    ctx.body = await query.exec()
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
    const cond = await opts.routeHooks.list.cond(_.assign(q.cond, { deletedAt: null }), {name})
    let query = Model.find(cond, q.project).sort(q.sort)
    q.populate.forEach(pop => {
      query.populate(pop)
    })
    if (q.range === 'PAGE') {
      query = query.skip((q.page - 1) * q.size).limit(q.size)
      result = await query.exec()
      totalrecords = await Model.where(cond).countDocuments()
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
    let form = ctx.request.body
    form.docs.forEach(doc => {
      delete doc.createdAt
      delete doc.updatedAt
    })
    form = await opts.routeHooks.create.form(form, {name})
    ctx.status = 200
    ctx.body = await Model.create(form.docs)
  } catch (error) {
    logger.error(error.stack)
    ctx.status = 500
    ctx.body = {
      message: 'Internal Server Error',
      stack: error.stack
    }
  }
}

repo.delete = async function (name, ctx, ext, opts) {
  try {
    const Model = ext.Model(name)
    let form = ctx.request.body
    for (let index = 0; index < form.docs.length; index++) {
      const doc = form.docs[index]
      if (doc['_id'] === undefined || doc['_id'] === '' || doc['_id'] === null) {
        ctx.body = {
          message: 'no id found'
        }
        return
      }
    }
    form.docs.forEach(doc => {
      delete doc.createdAt
      delete doc.updatedAt
      doc.deletedAt = new Date()
    })
    form = await opts.routeHooks.delete.form(form, {name})
    ctx.status = 200
    ctx.body = await Model.bulkWrite(form.docs.map(doc => {
      return {
        updateOne: {
          filter: _.pick(doc, ['_id']),
          update: { $set: _.pick(doc, ['deletedAt']) },
          upsert: false
        }
      }
    }))
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
    let form = ctx.request.body
    for (let index = 0; index < form.docs.length; index++) {
      const doc = form.docs[index]
      if (doc['_id'] === undefined || doc['_id'] === '' || doc['_id'] === null) {
        ctx.body = {
          message: 'no id found'
        }
        return
      }
    }
    form.docs.forEach(doc => {
      delete doc.createdAt
      delete doc.updatedAt
    })
    form = await opts.routeHooks.update.form(form, {name})
    const Model = ext.Model(name)
    ctx.status = 200
    ctx.body = await Model.bulkWrite(form.docs.map(x => {
      return {
        updateOne: {
          filter: { _id: x._id },
          update: { $set: x },
          upsert: false
        }
      }
    }))
  } catch (error) {
    logger.error(error.stack || error.message)
    ctx.status = 500
    ctx.body = {
      message: 'Internal Server Error'
    }
  }
}
