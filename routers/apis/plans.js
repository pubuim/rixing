'use strict'

const router = require('koa-router')()
const Plan = require('../../models/plan')

router.post('/get/:date', function* () {
  const date = this.params.date
  const channelId = this.request.body.channel_id
  const userId = this.request.body.user_id

  const oneHour = 24 * 60 * 60 * 1000

  let timeStart, timeEnd

  switch (date) {
    case 'today':
      timeStart = new Date()
    case 'yesterday':
      timeStart = new Date(Date.now() - oneHour)
      break
    default:
      timeStart = new Date(timeStart)
  }

  timeStart.setHours(0)
  timeStart.setMinutes(0)
  timeStart.setSeconds(0)

  timeEnd = new Date(timeStart.getTime() + oneHour)

  const plan = Plan.findOne({
    channel: channelId,
    user: userId,
    created: {
      $gte: timeStart,
      $lt: timeEnd
    }
  })

  this.body = {
    text: plan.tasks.map(task => {
      if (task.comment) {
        return `${task.text}（${task.comment}）\r\n`
      } else {
        return `${task.text}\r\n`
      }
    })
  }
})

module.exports = router
