'use strict'

const router = require('koa-router')()
const PubuHelper = require('../../libs/pubu-helper')
const KeyChecker = require('../../libs/key-checker')
const Section = require('../../models/section')

// arams.text.match(/(\d{2}:?\d{2})[ \/\\\|\-](\d{2}:?\d{2})/)

router.post('/command', function* () {
  let params = this.pickBody('team_id', 'channel_id', 'user_id', 'user_name', 'user_avatar', 'text', true)

  let args = params.text.split(' ').compact()
  let cmd = args.shift()

  switch (KeyChecker.matchCommandKey(cmd)) {
    case 'list':
    case 'vacation':
    case 'register':
    case 'clear':
    case 'hook':
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
