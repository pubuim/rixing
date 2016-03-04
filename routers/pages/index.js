'use strict'

const router = require('koa-router')()

router.get('/', function* (next) {
  this.render('h1 Hello from RiXing', null, { fromString: true })

  yield next
})

module.exports = router
