const Juglans = require('../../juglans')

const mongoose = require('../').mongoose
const Redis = require('../').Redis

mongoose.retryConnect('mongodb://127.0.0.1:27017/test?authSource=admin', {
  useCreateIndex: true,
  useNewUrlParser: true,
  poolSize: 1000,
  reconnectTries: Number.MAX_VALUE
}, function (err) {
  if (err) {
    console.log(`Mongodb:'mongodb://127.0.0.1:27017/test?authSource=admin' connect failed!`)
    console.error(err)
  } else {
    console.log(`Mongodb:'mongodb://127.0.0.1:27017/test?authSource=admin' connect successfully!`)
  }
})

const redis = Redis.retryConnect('redis://127.0.0.1:6379', {
  maxRetriesPerRequest: 3,
  retryStrategy: function (times) {
    return null
  }
}, function (err) {
  if (err) {
    console.log(`Redis:'redis://127.0.0.1:6379' connect failed!`)
    console.error(err)
  } else {
    console.log(`Redis:'redis://127.0.0.1:6379' connect successfully!`)
  }
})

const Schema = mongoose.Schema

const defineSchema = new Schema(Object.assign({}, {
  nickname: {
    type: String,
    displayName: '车型外号'
  },
  price: {
    type: Number,
    displayName: '车型价格'
  }
}))
mongoose.model('Car', defineSchema)

const app = new Juglans()
app.Use(function ({ router }) {
  router.get('/addition/mgo', async ctx => {
    try {
      const Car = mongoose.model('Car')
      await Car.create([{ nickname: '玛莎拉提', price: 3890000 }])
      await mongoose.hooks.list('Car')(ctx)
    } catch (error) {
      console.error(error)
      ctx.status = 500
      ctx.body = {
        message: error.message
      }
    }
  })
  router.get('/addition/rds', async ctx => {
    await redis.set('mashalati', 'Welcome to mashalati store')
    const ret = await redis.get('mashalati')
    ctx.body = {
      data: ret
    }
  })
})
app.Run(function (err, config) {
  if (!err) {
    console.log(`App:${config.name}`)
    console.log(`App:runing on Port:${config.port}`)
  } else {
    console.error(err)
  }
})
