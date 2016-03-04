'use strict'

const requere = require('requere')
const User = requere('models/user')

const router = require('koa-router')({ prefix: '/users' })

router.post('/create', function* (next) {
  const body = this.request.body

  const user = User.new(body)
  yield user.save()

  this.body = user

  yield next
})

router.post('/update', function* (next) {
  const body = this.request.body

  const data = User.mapData(body)
  let user

  if (!data.oid || !(user = yield User.findOne({ oid: data.oid }))) {
    throw new Error('User not exist')
  }

  Object.assign(user, data)
  yield user.save()

  this.body = user

  yield next
})

router.post('/delete', function* (next) {
  const body = this.request.body

  let user = body.user_id && (yield User.findOne({ oid: body.user_id }))

  if (!user) {
    yield user.remove()
  }

  this.body = user

  yield next
})

module.exports = router
