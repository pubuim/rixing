'use strict'

const router = require('koa-router')()
const moment = require('moment')
const config = require('config')

const Plan = require('../../models/plan')
const User = require('../../models/user')

router.get('/:channel/:date?', function* (next) {
  const channelId = this.params.channel
  const date = this.params.date

  if (!date) return this.redirect(`/${channelId}/${moment().format('YYYY-MM-DD')}`)

  let momentDate = moment(date)

  momentDate = momentDate.isValid(momentDate) ? momentDate : moment()

  const plans = yield Plan.find({
    channel: channelId,
    created: {
      $gte: momentDate.clone().startOf('day').toDate(),
      $lt: momentDate.clone().startOf('day').add(1, 'day').toDate()
    }
  })

  const plansColumns = [[], [], []]

  const users = yield plans.map(plan => User.findOne({ oid: plan.user }))

  plans.forEach(function (plan, i) {
    const user = users[i]
    plansColumns[Math.floor(i % 3)].push({
      username: user.name,
      avatar: `${config.avatar.prefix}/${user.avatar}?imageView2/1/w/74/h/74`,
      tasks: plan.tasks
    })
  })

  this.render('index', {
    date: momentDate,
    plansColumns: plansColumns
  })

  yield next
})

module.exports = router
