'use strict'

const router = require('koa-router')()
const PubuHelper = require('../../libs/pubu-helper')
const KeyChecker = require('../../libs/key-checker')
const Section = require('../../models/section')
const Plan = require('../../models/plan')
const User = require('../../models/user')
const Vacation = require('../../models/vacation')
const debug = require('debug')('app:route:idx')

router.post('/command', function* () {
  let params = this.pickBody('team_id', 'channel_id', 'user_id', 'user_name', 'user_avatar', 'text', true)

  let args = params.text.split(' ').compact()
  let cmd = KeyChecker.matchCommandKey(args.shift())
  debug(`Invoke command <${cmd}> with [${args}]`)

  let section = yield Section.load(params.team_id, params.channel_id)
  let user = yield User.load(params.user_id)

  switch (cmd) {
    case 'list':
      if (!user) { throw new Error('user not registered') }
      let tasks = yield Plan.listTodayTask(section, user)
      if (!tasks.length) { return this.body = PubuHelper.createMessage('You have no tasks today') }
      return this.body = PubuHelper.createMessage(`You have ${tasks.length} tasks today`, tasks.map(t => {
        return { text: t.text, color: Plan.toStatusColor(t.status) }
      }))
    case 'vacation':
      if (!user) { throw new Error('user not registered') }
      let date = args.first
      if (!date) { throw new Error('Param "date" is required') }
      let vacation = yield Vacation.add(section, user, date)
      return this.body = PubuHelper.createMessage(`vacation added at ${vacation.text}`)
    case 'register':
      if (user) { throw new Error('user already registered') }
      user = User.new(params)
      yield user.save()
      return this.body = PubuHelper.createMessage('registered !')
    case 'clear':
      if (!user) { throw new Error('user not registered') }
      yield user.remove()
      return this.body = PubuHelper.createMessage('removed ...')
    case 'schedule':
      if (!user) { throw new Error('user not registered') }
      let exp = args.first
      if (!exp) { throw new Error('Param "exp" is required') }
      section.setSchedule(exp)
      yield section.save()
      return this.body = PubuHelper.createMessage(`schedule set as: ${section.scheduleText}`)
    case 'hook':
      let webhook = args.first
      if (!webhook) { throw new Error('Param "webhook" is required') }
      section.webhook = webhook
      yield section.save()
      return this.body = PubuHelper.createMessage(`webhook set as: ${section.webhook}`)
    default:
      throw new Error(`unsupported command: ${cmd}`)
  }
})

router.post('/outgoing', function* () {
  const teamId = this.request.body.team_id
  const channelId = this.request.body.channel_id
  const userId = this.request.body.user_id
  const text = this.request.body.text
  const triggerWord = this.request.body.triggerWord

})

module.exports = router
