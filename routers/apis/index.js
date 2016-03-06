'use strict'

const router = require('koa-router')()
const PubuHelper = require('../../libs/pubu-helper')
const KeyChecker = require('../../libs/key-checker')
const swearwordsGenerator = require('../../libs/swearwords-generator')
const Section = require('../../models/section')
const Plan = require('../../models/plan')
const User = require('../../models/user')
const Vacation = require('../../models/vacation')
const debug = require('debug')('app:route:idx')
const config = require('config')
const moment = require('moment')

router.post('/command', function* () {
  let params = this.pickBody('team_id', 'channel_id', 'user_id', 'user_name', 'user_avatar', true)
  params.text = this.request.body.text || ''

  let args = params.text.split(' ').compact()
  let cmd = args.shift() || 'list'
  cmd = KeyChecker.matchCommandKey(cmd)
  debug(`Invoke command <${cmd}> with [${args}]`)

  let section = yield Section.load(params.team_id, params.channel_id)
  let user = yield User.load(params.user_id)

  switch (cmd) {
    case 'list':
      if (!user) { throw new Error('user not registered') }
      let tasks = yield Plan.listTodayTask(section, user)
      if (!tasks.length) { return this.body = PubuHelper.createMessage('You have no tasks today') }
      return this.body = PubuHelper.createMessage(`You have ${tasks.length} tasks today`, tasks.map(t => {
        return { title: t.text, description: t.comment, color: Plan.toStatusColor(t.status) }
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
      if (!args.length) { throw new Error('Param "date" is required') }
      const schedule = args.first
      section.setSchedule(schedule)
      yield section.save()
      return this.body = PubuHelper.createMessage(`schedule set as: ${section.scheduleText}`)
    case 'hook':
      let webhook = args.first
      if (!webhook) { throw new Error('Param "webhook" is required') }
      section.webhook = webhook
      yield section.save()
      return this.body = PubuHelper.createMessage(`webhook set as: ${section.webhook}`)
    case 'fuck':
      return this.body = PubuHelper.createMessage(swearwordsGenerator())
    case 'help':
    default:
      const toDesription = (key, value) => {
        return `
  **+** **${key}:**
    **-** **description:** ${value.description}
    **-** **usage:** \`/${config.botKey} ${key} ${value.params || ''}\`
    **-** **alias:** \`${value.alias.join(', ')}\``
      }
      const text = `\`\`\`
${Object.keys(config.cmdKeys).map(key => toDesription(key, config.cmdKeys[key]))}
\`\`\``
      return this.body = PubuHelper.createMessage(text)
  }
})

router.post('/outgoing', function* () {
  const params = this.pickBody('team_id', 'text', 'channel_id', 'user_id', 'user_name', 'user_avatar', true)

  const lines = KeyChecker.translatePlan(params.text)

  let now = moment()

  const section = yield Section.findOne({
    channel: params.channel_id
  })

  if (now.format('HHmm') < section.scheduleStart) {
    now = now.add(-1, 'day')
  }

  let plan = yield Plan.findByDate(params.user_id, now)

  if (plan) {
    if (!plan.tasks) plan.tasks = []

    lines.forEach((line, i) => {
      let task = plan.tasks[i] || {}

      if (line.text) task.text = line.text
      if (line.status !== 'undefined') task.status = line.status
      if (line.comment) task.comment = line.comment

      if (!plan.tasks[i]) plan.tasks.push(task)
    })

    plan.updated = new Date()
  } else {
    plan = new Plan({
      tasks: lines.map(line => ({
        text: line.text,
        status: line.status,
        comment: line.comment
      })),
      user: params.user_id,
      channel: params.channel_id,
      team: params.team_id,
      created: now,
      updated: now
    })
  }

  yield plan.save()

  this.body = PubuHelper.createMessage(`You tasks updated`, plan.tasks.map(t => {
    return { title: t.text, description: t.comment, color: Plan.toStatusColor(t.status) }
  }))
})

module.exports = router
