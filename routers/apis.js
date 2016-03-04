'use strict'

const loader = require('../libs/stack-loader')
const router = require('koa-router')({
  prefix: '/v1'
})

loader(__dirname, './apis').forEach(r => {
  router.use(r.routes())
  router.use(r.allowedMethods())
})

module.exports = router
