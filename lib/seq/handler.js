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
    const q = Query(ctx.query).build({ model: Model })
    q.cond = await opts.routeHooks.one.cond(_.assign(q.cond, { id, deletedAt: null }), {name})
    const cond = { where: q.cond }
    if (q.project.length > 0) {
      cond.attributes = q.project
    }
    cond.include = q.populate
    ctx.status = 200
    ctx.body = await Model.findOne(cond)
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
    let totalpages
    let totalrecords
    const Model = ext.Model(name)
    const q = Query(ctx.query).build({ model: Model })
    q.cond = _.assign(q.cond, { deletedAt: null })
    const match = { where: q.operators }
    match.where = await opts.routeHooks.list.cond(_.assign(match.where, { deletedAt: null }), {name})
    if (q.project.length > 0) {
      match.attributes = q.project
    }
    if (q.populate.length > 0) {
      match.include = q.populate
    }
    if (q.range === 'PAGE') {
      match.offset = (q.page - 1) * q.size
      match.limit = q.size
    }
    const list = await Model.findAll(match)
    totalrecords = await Model.count(_.omit(match, ['attributes']))
    if (q.range === 'PAGE') {
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
        list
      }
    } else {
      ctx.status = 200
      ctx.body = {
        cond: q.cond,
        sort: q.sort,
        project: q.project,
        populate: q.populate,
        totalrecords,
        list
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
    form.docs = form.docs.map(doc => {
      doc.createdAt = new Date()
      return doc
    })
    form = await opts.routeHooks.create.form(form, {name})
    ctx.status = 200
    ctx.body = await Model.bulkCreate(form.docs)
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
    let form = ctx.request.body
    for (let index = 0; index < form.docs.length; index++) {
      const doc = form.docs[index]
      if (doc['id'] === undefined || doc['id'] === '' || doc['id'] === null) {
        ctx.body = {
          message: 'no id found'
        }
        return
      }
    }
    form = await opts.routeHooks.delete.form(form, {name})
    const results = []
    for (const doc of form.docs) {
      doc.deletedAt = new Date()
      const cond = await opts.routeHooks.delete.cond(_.pick(doc, ['id']), ctx, {name})
      const ret = await Model.update(_.pick(doc, ['deletedAt']), { where: cond })
      results.push(ret)
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
    const Model = ext.Model(name)
    let form = ctx.request.body
    for (let index = 0; index < form.docs.length; index++) {
      const doc = form.docs[index]
      if (doc['id'] === undefined || doc['id'] === '' || doc['id'] === null) {
        ctx.body = {
          message: 'no id found'
        }
        return
      }
    }
    form = await opts.routeHooks.update.form(form, {name})
    const results = []
    for (const doc of form.docs) {
      const cond = await opts.routeHooks.update.cond(_.pick(doc, ['id']), ctx, {name})
      doc.updatedAt = new Date()
      const ret = await Model.update(doc, { where: cond, fields: Object.keys(doc) })
      results.push(ret)
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
