'use strict'

const router = require('koa-router')()

router.get('/set_hooks', function* (next) {
  this.body = {}

  yield next
})

module.exports = router
