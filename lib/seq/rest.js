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
  const id = ctx.params[key]
  const Model = ext.Model(name)
  const q = Query(ctx.query).build({ model: Model })
  q.cond = await opts.routeHooks.one.cond(_.assign(q.cond, { id, deletedAt: null }), ctx, {name})
  q.toOperators()
  const cond = { where: q.operators }
  if (q.project.length > 0) {
    cond.attributes = q.project
  }
  cond.include = q.preload
  const one = await Model.findOne(cond)
  ctx.status = 200
  ctx.body = one
}

repo.list = async function (name, ctx, ext, opts) {
  let totalpages
  let totalrecords
  const Model = ext.Model(name)
  const q = Query(ctx.query).build({ model: Model })
  q.cond = await opts.routeHooks.list.cond(_.assign(q.cond, { deletedAt: null }), ctx, {name})
  q.toOperators()
  const match = { where: q.operators }
  if (q.project.length > 0) {
    match.attributes = q.project
  }
  if (q.preload.length > 0) {
    match.include = q.preload
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
      data: list
    }
  } else {
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
  form.docs = form.docs.map(doc => {
    doc.createdAt = new Date()
    return doc
  })
  form = await opts.routeHooks.create.form(form, ctx, {name})
  ctx.status = 200
  const ret = await Model.bulkCreate(form.docs)
  ctx.body = ret
}

repo.delete = async function (name, ctx, ext, opts) {
  const Model = ext.Model(name)
  let form = ctx.request.body
  for (let index = 0; index < form.docs.length; index++) {
    const doc = form.docs[index]
    if (doc['id'] === undefined || doc['id'] === '' || doc['id'] === null) {
      throw new Error('no id found')
    }
  }
  form = await opts.routeHooks.delete.form(form, {name})
  const rets = []
  for (const doc of form.docs) {
    doc.deletedAt = new Date()
    const cond = await opts.routeHooks.delete.cond(_.pick(doc, ['id']), ctx, {name})
    const ret = await Model.update(_.pick(doc, ['deletedAt']), { where: cond })
    rets.push(ret)
  }
  ctx.status = 200
  ctx.body = rets
}

repo.update = async function (name, ctx, ext, opts) {
  const Model = ext.Model(name)
  let form = ctx.request.body
  for (let index = 0; index < form.docs.length; index++) {
    const doc = form.docs[index]
    if (doc['id'] === undefined || doc['id'] === '' || doc['id'] === null) {
      throw new Error('no id found')
    }
  }
  form = await opts.routeHooks.update.form(form, {name})
  const rets = []
  for (const doc of form.docs) {
    const cond = await opts.routeHooks.update.cond(_.pick(doc, ['id']), ctx, {name})
    doc.updatedAt = new Date()
    const ret = await Model.update(doc, { where: cond, fields: Object.keys(doc) })
    rets.push(ret)
  }
  ctx.status = 200
  ctx.body = rets
}
