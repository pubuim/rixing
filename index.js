'use strict'

require('node-extensions')

const less = require('koa-less')
const serve = require('koa-static')
const koa = require('koa')
const app = koa()
const config = require('config')

app.use(less('./public'))

app.use(serve('./public'))

app.listen(config.port)
