'use strict'

const router = require('koa-router')()

const setHooks = function* (next) {
  this.body = this.request.body

  yield next
}

router.post('/set_hooks', setHooks)
router.put('/set_hooks', setHooks)

module.exports = router
