'use strict'

const loader = require('../libs/stack-loader')
const body = require('koa-body')
const router = require('koa-router')({
  prefix: '/v1'
})

router.use(function* (next) {
  try {
    yield next;
  } catch (err) {
    this.status = err.status || 500
    this.body = err.message
    this.app.emit('error', err, this)
  }
})
router.use(body())
router.use(function* (next) {
  this.pickBody = function () {
    let keys = Array.from(arguments).compact()
    if (!keys.length) { return {} }
    if (keys.last === true) {
      keys.pop()
      let notFounds = keys.filter(k => !this.request.body[k])
      if (notFounds.length) { throw new Error(`param: "${notFounds.join('", "')}" required`) }
    }
    return Object.pick(this.request.body, keys)
  }
  yield next
})

loader(__dirname, './apis').forEach(r => {
  router.use(r.routes())
  router.use(r.allowedMethods())
})

module.exports = router
