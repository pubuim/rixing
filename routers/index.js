'use strict'

const loader = require('../libs/stack-loader')
const router = require('koa-router')()

loader(__dirname, './pages').forEach(r => {
  router.use(r.routes())
  router.use(r.allowedMethods())
})

const API = require('./apis')
router.use(API.routes())
router.use(API.allowedMethods())

module.exports = router
