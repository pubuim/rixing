'use strict'

const config = require('config')

exports.createMessage = function (text, items) {
  let msg = {
    text,
    username: config.cmdKeys.botKey,
    icon_url: config.icon || ''
  }
  if (items && items.length) {
    msg.attachments = items.compact().map(i => Object.pick(i, 'title', 'description', 'color'))
  }
  return msg
}
