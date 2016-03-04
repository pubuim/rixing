'use strict'

const router = require('koa-router')()
const PubuHelper = require('../../libs/pubu-helper')
const Section = require('../../models/section')

const setHook = function* (next) {
  let params = this.pickBody('team_id', 'channel_id', 'text', true)

  let section = yield Section.findOne({ team: params.team_id, channel: params.channel_id })
  if (!section) { section = new Section() }
  section.webhook = params.text
  yield section.save()

  this.body = PubuHelper.createMessage(`webhook updated: ${section.webhook}`)
  yield next
}

const setSchedule = function* (next) {
  let params = this.pickBody('team_id', 'channel_id', 'text', true)

  let matched = params.text.match(/(\d{2}:?\d{2})[ \/\\\|\-](\d{2}:?\d{2})/)
  if (!matched) { throw new Error('invalid schedule expression') }

  let section = yield Section.findOne({ team: params.team_id, channel: params.channel_id })
  if (!section) { throw new Error('section no not inited') }

  section.scheduleStart = matched[0] + matched[1]
  section.scheduleEnd = matched[2] + matched[3]
  yield section.save()

  this.body = PubuHelper.createMessage(`schedule updated: ${section.scheduleStart}~${section.scheduleEnd}`)
  yield next
}

router.post('/set_hook', setHook)
router.put('/set_hook', setHook)

router.post('/set_schedule', setSchedule)
router.put('/set_schedule', setSchedule)

module.exports = router
