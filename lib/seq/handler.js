// Copyright (c) 2018-2020 Double.  All rights reserved.
// Use of this source code is governed by a MIT style
// license that can be found in the LICENSE file.

const logger = require('../logger')
const Query = require('./query')

const repo = module.exports

repo.one = async function (name, ctx, { ext, routeHooks }) {
  try {
    const id = ctx.params.id
    const Model = ext.Model(name)
    const q = Query(ctx.query)
    const project = q.buildProject()
    const populate = q.buildPopulate()
    const cond = await routeHooks.one.cond({ _id: id }, {name})
    // const query = Model.findByPk(id)
    // for (const pop of populate) {
    //   query.populate(pop)
    // }
    const ret = await Model.findByPk(id)
    ctx.status = 200
    ctx.body = ret
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
    const q = Query(ctx.query)
    const cond = q.buildCond()
    const sort = q.buildSort()
    const project = q.buildProject()
    const populate = q.buildPopulate()

    const Model = ext.Model(name)

    let totalpages
    let totalrecords
    let data

    const where = await routeHooks.list.cond(cond, {name})
    data = await Model.findAll()
    ctx.status = 200
    ctx.body = {
      cond,
      page: q.page,
      size: q.size,
      sort,
      project,
      populate,
      totalpages,
      totalrecords,
      data
    }

    // for (const pop of populate) {
    //   query.populate(pop)
    // }
    // if (q.range === 'PAGE') {
    //   query.skip((q.page - 1) * q.size).limit(q.size)
    //   data = await query.exec()
    //   totalrecords = await Model.where(where).countDocuments()
    //   totalpages = Math.ceil(totalrecords / q.size)
    //   ctx.status = 200
    //   ctx.body = {
    //     cond,
    //     page: q.page,
    //     size: q.size,
    //     sort,
    //     project,
    //     populate,
    //     totalpages,
    //     totalrecords,
    //     data
    //   }
    // } else if (q.range === 'ALL') {
    //   data = await query.exec()
    //   totalrecords = data.length
    //   ctx.status = 200
    //   ctx.body = {
    //     cond,
    //     sort,
    //     project,
    //     populate,
    //     totalrecords,
    //     data
    //   }
    // }
  } catch (error) {
    logger.error(error.stack || error.message)
    ctx.status = 500
    ctx.body = {
      message: error.message
    }
  }
}

repo.create = async function (name, ctx, { mongoose, defaultAPI }) {
  try {
    const Model = mongoose.model(name)
    const routeHooks = mongoose.ext.routeHooks(name, defaultAPI)
    // eslint-disable-next-line no-unused-vars
    const { docs, category } = await routeHooks.create.body(ctx.request.body, {name})
    const ret = await Model.create(docs)
    ctx.status = 200
    ctx.body = ret
  } catch (error) {
    logger.error(error.stack || error.message)
    ctx.status = 500
    ctx.body = {
      message: error.message
    }
  }
}

repo.delete = async function (name, ctx, { mongoose, defaultAPI }) {
  try {
    // eslint-disable-next-line no-unused-vars
    const { docs, category } = ctx.request.body
    const Model = mongoose.model(name)
    const routeHooks = mongoose.ext.routeHooks(name, defaultAPI)
    const update = await routeHooks.delete.update({}, {name})
    const ret = await Model.bulkWrite(docs.map(x => {
      return {
        updateOne: {
          filter: { _id: x._id },
          update: { $set: update },
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
      message: error.message
    }
  }
}

repo.update = async function (name, ctx, { mongoose, defaultAPI }) {
  try {
    const routeHooks = mongoose.ext.routeHooks(name, defaultAPI)
    // eslint-disable-next-line no-unused-vars
    const { docs, category } = await routeHooks.update.body(ctx.request.body, {name})
    const Model = mongoose.model(name)
    const ret = await Model.bulkWrite(docs.map(x => {
      return {
        updateOne: {
          filter: { _id: x._id, _dr: false },
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
      message: error.message
    }
  }
}