// Copyright (c) 2018-2020 Double.  All rights reserved.
// Use of this source code is governed by a MIT style
// license that can be found in the LICENSE file.

const is = require('is')
const utils = require('./utils')
const repo = module.exports

repo.one = async function (name, mgo, ctx) {
  try {
    const id = ctx.params.id
    const Model = mgo.model(name)
    const ret = await Model.findById(id)
    ctx.status = 200
    ctx.body = ret
  } catch (error) {
    console.error(error)
    ctx.status = 500
    ctx.body = {
      message: error.message
    }
  }
}

repo.list = async function (name, mgo, ctx) {
  try {
    const page = parseInt(ctx.query.page) || 1
    const size = parseInt(ctx.query.size) || 20
    const range = ctx.query.range === 'ALL' ? ctx.query.range.toUpperCase() : 'PAGE'

    const cond = utils.toCond(ctx.query.cond)
    const sort = utils.toSort(ctx.query.sort)
    const project = utils.toProject(ctx.query.project)
    const populate = utils.toPopulate(ctx.query.populate)

    let totalpages
    let totalrecords
    let data
    const Model = mgo.model(name)
    const query = Model.find(cond, project).sort(sort)
    utils.popModel(query, populate)
    if (range === 'PAGE') {
      query.skip((page - 1) * size).limit(size)
      data = await query.exec()
      totalrecords = await Model.where(cond).countDocuments()
      totalpages = Math.ceil(totalrecords / size)
    } else if (range === 'ALL') {
      data = await query.exec()
      totalrecords = data.length
    }
    ctx.status = 200
    ctx.body = {
      cond,
      page,
      size,
      sort,
      project,
      populate,
      totalpages,
      totalrecords,
      data
    }
  } catch (error) {
    console.error(error)
    ctx.status = 500
    ctx.body = {
      message: error.message
    }
  }
}

repo.create = async function (name, mgo, ctx) {
  try {
    const data = ctx.request.body
    const items = is.array(data) ? data : [data]
    const Model = mgo.model(name)
    const ret = await Model.create(items)
    ctx.status = 200
    ctx.body = ret
  } catch (error) {
    console.error(error)
    ctx.status = 500
    ctx.body = {
      message: error.message
    }
  }
}

repo.delete = async function (name, mgo, ctx) {
  try {
    const { cond, doc, muti } = ctx.request.body
    let ret
    const Model = mgo.model(name)
    if (muti) {
      ret = await Model.deleteMany(cond, { $set: doc })
    } else {
      ret = await Model.deleteOne(cond, { $set: doc })
    }
    ctx.status = 200
    ctx.body = ret
  } catch (error) {
    console.error(error)
    ctx.status = 500
    ctx.body = {
      message: error.message
    }
  }
}

repo.update = async function (name, mgo, ctx) {
  try {
    const { cond, doc, muti } = ctx.request.body
    let ret
    const Model = mgo.model(name)
    if (muti) {
      ret = await Model.updateMany(cond, { $set: doc })
    } else {
      ret = await Model.updateOne(cond, { $set: doc })
    }
    ctx.status = 200
    ctx.body = ret
  } catch (error) {
    console.error(error)
    ctx.status = 500
    ctx.body = {
      message: error.message
    }
  }
}
