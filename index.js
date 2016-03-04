'use strict'

require('node-extensions')

const config = require('config')

const koa = require('koa')
const app = koa()

const session = require('koa-session')
app.use(session(config.session, app))

const Jade = require('koa-jade')
new Jade({
  viewPath: './views',
  debug: config.debug,
  app: app
})

const less = require('koa-less')
app.use(less('./public'))

const serve = require('koa-static')
app.use(serve('./public'))

const router = require('./routers')
app.use(router.routes())
app.use(router.allowedMethods())

app.listen(config.port)
