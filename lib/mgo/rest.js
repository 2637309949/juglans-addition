// Copyright (c) 2018-2020 Double.  All rights reserved.
// Use of this source code is governed by a MIT style
// license that can be found in the LICENSE file.

const _ = require('lodash')
// const logger = require('../logger')
const Query = require('./query')
const utils = require('./utils')

const repo = module.exports

repo.one = async function (name, ctx, ext, opts) {
  const key = utils.findStringSubmatch(/:(.*)$/, opts.routePrefixs.one(name, opts))
  const id = ctx.params[key[0]]
  const Model = ext.Model(name)
  const q = Query(ctx.query).build()
  const cond = await opts.routeHooks.one.cond(_.assign(q.cond, { _id: id, deletedAt: null }), ctx, {name})
  const query = Model.findOne(cond, q.project)
  q.populate.forEach(pop => {
    query.populate(pop)
  })
  ctx.status = 200
  const one = await query.exec()
  ctx.body = one
}

repo.list = async function (name, ctx, ext, opts) {
  let totalpages
  let totalrecords
  let list
  const q = Query(ctx.query).build()
  const Model = ext.Model(name)
  const cond = await opts.routeHooks.list.cond(_.assign(q.cond, { deletedAt: null }), ctx, {name})
  let query = Model.find(cond, q.project).sort(q.sort)
  q.populate.forEach(pop => {
    query.populate(pop)
  })
  if (q.range === 'PAGE') {
    query = query.skip((q.page - 1) * q.size).limit(q.size)
    list = await query.exec()
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
      data: list
    }
  } else if (q.range === 'ALL') {
    list = await query.exec()
    totalrecords = list.length
    ctx.status = 200
    ctx.body = {
      cond: q.cond,
      sort: q.sort,
      project: q.project,
      populate: q.populate,
      totalrecords,
      data: list
    }
  }
}

repo.create = async function (name, ctx, ext, opts) {
  const Model = ext.Model(name)
  let form = ctx.request.body
  form.docs = form.docs.map(x => {
    x.createdAt = new Date()
    return x
  })
  form = await opts.routeHooks.create.form(form, ctx, {name})
  ctx.status = 200
  const ret = await Model.create(form.docs)
  ctx.body = ret
}

repo.delete = async function (name, ctx, ext, opts) {
  const Model = ext.Model(name)
  let form = ctx.request.body
  for (let index = 0; index < form.docs.length; index++) {
    const doc = form.docs[index]
    if (doc['_id'] === undefined || doc['_id'] === '' || doc['_id'] === null) {
      throw new Error('no id found')
    }
  }
  form = await opts.routeHooks.delete.form(form, {name})
  const docs = await Promise.all(form.docs.map(async doc => {
    const cond = await opts.routeHooks.delete.cond(_.pick(doc, ['_id']), ctx, {name})
    doc.deletedAt = new Date()
    return {
      updateOne: {
        filter: cond,
        update: { $set: _.pick(doc, ['deletedAt']) },
        upsert: false
      }
    }
  }))
  const ret = await Model.bulkWrite(docs)
  ctx.status = 200
  ctx.body = ret
}

repo.update = async function (name, ctx, ext, opts) {
  let form = ctx.request.body
  for (let index = 0; index < form.docs.length; index++) {
    const doc = form.docs[index]
    if (doc['_id'] === undefined || doc['_id'] === '' || doc['_id'] === null) {
      throw new Error('no id found')
    }
  }
  form = await opts.routeHooks.update.form(form, {name})
  const Model = ext.Model(name)
  ctx.status = 200
  const docs = await Promise.all(form.docs.map(async x => {
    const cond = await opts.routeHooks.update.cond(_.pick(x, ['_id']), ctx, {name})
    x.updatedAt = new Date()
    return {
      updateOne: {
        filter: cond,
        update: { $set: x },
        upsert: false
      }
    }
  }))
  const ret = await Model.bulkWrite(docs)
  ctx.body = ret
}
