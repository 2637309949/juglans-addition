// Copyright (c) 2018-2020 Double.  All rights reserved.
// Use of this source code is governed by a MIT style
// license that can be found in the LICENSE file.

const moment = require('moment')
const logger = require('../logger')
const Query = require('./query')

const repo = module.exports

repo.one = async function (name, mgo, ctx) {
  try {
    const id = ctx.params.id
    const Model = mgo.model(name)
    const q = Query(ctx.query)
    const project = q.buildProject()
    const populate = q.buildPopulate()
    const query = Model.findOne({ _id: id, _dr: false }, project)
    for (const pop of populate) {
      query.populate(pop)
    }
    const ret = await query.exec()
    ctx.status = 200
    ctx.body = ret
  } catch (error) {
    logger.error(error)
    ctx.status = 500
    ctx.body = {
      message: error.message
    }
  }
}

repo.list = async function (name, mgo, ctx) {
  try {
    const q = Query(ctx.query)
    const cond = q.buildCond()
    const sort = q.buildSort()
    const project = q.buildProject()
    const populate = q.buildPopulate()

    let totalpages
    let totalrecords
    let data
    const Model = mgo.model(name)
    const query = Model.find({_dr: false, ...cond}, project).sort(sort)
    for (const pop of populate) {
      query.populate(pop)
    }
    if (q.range === 'PAGE') {
      query.skip((q.page - 1) * q.size).limit(q.size)
      data = await query.exec()
      totalrecords = await Model.where(cond).countDocuments()
      totalpages = Math.ceil(totalrecords / q.size)
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
    } else if (q.range === 'ALL') {
      data = await query.exec()
      totalrecords = data.length
      ctx.status = 200
      ctx.body = {
        cond,
        sort,
        project,
        populate,
        totalrecords,
        data
      }
    }
  } catch (error) {
    logger.error(error)
    ctx.status = 500
    ctx.body = {
      message: error.message
    }
  }
}

repo.create = async function (name, mgo, ctx) {
  try {
    // eslint-disable-next-line no-unused-vars
    const { docs, category } = ctx.request.body
    const Model = mgo.model(name)
    const ret = await Model.create(docs.map(x => ({
      ...x,
      _dr: false,
      _createdAt: moment().unix()
    })))
    ctx.status = 200
    ctx.body = ret
  } catch (error) {
    logger.error(error)
    ctx.status = 500
    ctx.body = {
      message: error.message
    }
  }
}

repo.delete = async function (name, mgo, ctx) {
  try {
    // eslint-disable-next-line no-unused-vars
    const { docs, category } = ctx.request.body
    const Model = mgo.model(name)
    const ret = await Model.bulkWrite(docs.map(x => {
      return {
        updateOne: {
          filter: { _id: x._id },
          update: { $set: { _dr: true, _modifiedAt: moment().unix() } },
          upsert: false
        }
      }
    }))
    ctx.status = 200
    ctx.body = ret
  } catch (error) {
    logger.error(error)
    ctx.status = 500
    ctx.body = {
      message: error.message
    }
  }
}

repo.update = async function (name, mgo, ctx) {
  try {
    // eslint-disable-next-line no-unused-vars
    const { docs, category } = ctx.request.body
    const Model = mgo.model(name)
    const ret = await Model.bulkWrite(docs.map(x => {
      return {
        updateOne: {
          filter: { _id: x._id, _dr: false },
          update: { $set: { ...x, _modifiedAt: moment().unix() } },
          upsert: false
        }
      }
    }))
    ctx.status = 200
    ctx.body = ret
  } catch (error) {
    logger.error(error)
    ctx.status = 500
    ctx.body = {
      message: error.message
    }
  }
}
