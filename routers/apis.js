'use strict'

const loader = require('../libs/stack-loader')
const body = require('koa-body')
const router = require('koa-router')({
  prefix: '/v1'
})

loader(__dirname, './apis').forEach(r => {
  r.use(body())
  router.use(r.routes())
  router.use(r.allowedMethods())
})

module.exports = router
