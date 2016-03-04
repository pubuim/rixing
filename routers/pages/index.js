'use strict'

const router = require('koa-router')()

router.get('/', function* (next) {
  this.render('index', null, {})

  yield next
})

module.exports = router
