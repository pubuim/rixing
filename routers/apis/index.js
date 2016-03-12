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
      if (!user) { throw new Error('你还没有注册，请先执行 reg 命令') }
      let tasks = yield Plan.listTodayTask(section, user)
      if (!tasks.length) { return this.body = PubuHelper.createMessage('你今天还没有计划') }
      return this.body = PubuHelper.createMessage(`你今天有 ${tasks.length} 条计划`, tasks.map(t => {
        return { title: t.text, description: t.comment, color: Plan.toStatusColor(t.status) }
      }))
    case 'vacation':
      if (!user) { throw new Error('你还没有注册，请先执行 reg 命令') }
      let date = args.first
      if (!date) { throw new Error('需要参数 date') }
      let vacation = yield Vacation.add(section, user, date)
      return this.body = PubuHelper.createMessage(`添加了假期 ${vacation.text}`)
    case 'register':
      if (user) { throw new Error('你已经注册过了') }
      user = User.new(params)
      yield user.save()
      return this.body = PubuHelper.createMessage('注册成功！')
    case 'clear':
      if (!user) { throw new Error('你还没有注册，请先执行 reg 命令') }
      yield user.remove()
      return this.body = PubuHelper.createMessage('注销成功')
    case 'schedule':
      if (!user) { throw new Error('你还没有注册，请先执行 reg 命令') }
      if (!args.length) { throw new Error('需要参数 date') }
      const schedule = args.first
      section.setSchedule(schedule)
      yield section.save()
      return this.body = PubuHelper.createMessage(`工作时间段已设置为: ${section.scheduleText}`)
    case 'hook':
      let webhook = args.first
      if (!webhook) { throw new Error('需要参数 webhook') }
      section.webhook = webhook
      yield section.save()
      return this.body = PubuHelper.createMessage(`webhook 已设置为: ${section.webhook}`)
    case 'fuck':
      return this.body = PubuHelper.createMessage(swearwordsGenerator())
    case 'creators':
      return this.body = PubuHelper.createMessage(`
**总监督：**Kuro
**Logo：**Annie
**设计：**Remy
**网页**：Kuro
**架构：**Chris
**核心：**Gordomium
**部署：**Trigged Tang`)
    case 'help':
    default:
      const toDesription = (key, value) => {
        return `
  **+** **${key}:**
    **-** **描述：** ${value.description}
    **-** **用法：** \`/${config.botKey} ${key} ${value.params || ''}\`
    **-** **别名：** \`${value.alias.join(', ')}\``
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

  this.body = PubuHelper.createMessage(
    `@[${params.user_name}](user:${params.user_id}) 今日计划更新成功`,
    plan.tasks.map(t => {
      return {
        title: t.text,
        description: t.comment,
        color: Plan.toStatusColor(t.status)
      }
    })
  )
})

module.exports = router
