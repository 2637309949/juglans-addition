// Copyright (c) 2018-2020 Double.  All rights reserved.
// Use of this source code is governed by a MIT style
// license that can be found in the LICENSE file.

const logger = require('../logger')
const Query = require('./query')

const repo = module.exports

repo.one = async function (name, ctx, { ext, routeHooks }) {
  try {
    let data
    const id = ctx.params.id
    const Model = ext.Model(name)
    const q = Query(ctx.query)
    const project = q.buildProject()
    const populate = q.buildPopulate(Model)

    const cond = { where: { id } }
    const where = await routeHooks.list.cond(cond, {name})
    if (project.length > 0) {
      cond.attributes = project
    }
    if (populate.length > 0) {
      cond.include = populate
    }
    data = await Model.findOne(cond)
    console.log(data)
    ctx.status = 200
    ctx.body = data
  } catch (error) {
    logger.error(error.stack || error.message)
    ctx.status = 500
    ctx.body = {
      message: error.message
    }
  }
}

repo.list = async function (name, ctx, { ext, routeHooks }) {
  try {
    const Model = ext.Model(name)
    const q = Query(ctx.query)
    const cond = q.buildCond()
    const sort = q.buildSort()
    const project = q.buildProject()
    const populate = q.buildPopulate(Model)

    const match = { where: cond }
    let totalpages
    let totalrecords
    let data

    const where = await routeHooks.list.cond(cond, {name})
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
    totalpages = Math.ceil(totalrecords / q.size)
    if (q.range === 'PAGE') {
      ctx.status = 200
      ctx.body = {
        cond,
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
      message: error.message
    }
  }
}

repo.create = async function (name, ctx, { ext, routeHooks }) {
  try {
    const Model = ext.Model(name)
    // eslint-disable-next-line no-unused-vars
    const { docs, category } = await routeHooks.create.body(ctx.request.body, {name})
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

repo.delete = async function (name, ctx, { ext, routeHooks }) {
  try {
    // eslint-disable-next-line no-unused-vars
    const { docs, category } = ctx.request.body
    const Model = ext.Model(name)
    const update = await routeHooks.delete.update({}, {name})
    const results = []
    for (const item of docs) {
      const result = await Model.destroy({ where: { id: item.id } })
      results.push(result)
    }
    ctx.status = 200
    ctx.body = results
  } catch (error) {
    logger.error(error.stack || error.message)
    ctx.status = 500
    ctx.body = {
      message: error.message
    }
  }
}

repo.update = async function (name, ctx, { ext, routeHooks }) {
  try {
    // eslint-disable-next-line no-unused-vars
    const { docs, category } = ctx.request.body
    const Model = ext.Model(name)
    const update = await routeHooks.delete.update({}, {name})
    const results = []
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
      message: error.message
    }
  }
}
