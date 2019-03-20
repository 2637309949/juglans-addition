
const mailer = require('../').mailer

const config = {
  smtp: {
    host: 'smtp.ym.163.com',
    port: 25,
    tls: {
      rejectUnauthorized: false
    },
    auth: {
      user: 'xxx',
      pass: 'xxx'
    }
  },
  emailFrom: 'xxx'
}

mailer.init(config)
mailer.sendMail({
  to: '2637309949@qq.com',
  subject: '测试',
  html: '<h1>测试</h1>'
})
