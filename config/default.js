'use strict'

const cmd = function (alias, description, params) {
  let item = { alias }
  if (description) { item.description = description }
  if (params) { item.params = params }
  return item
}

const config = {
  debug: process.env.NODE_ENV === 'development',

  port: process.env.PORT || 3000,

  session: {
    key: 'rx',
    httpOnly: true,
    maxAge: 86400 * 30 // 1 month
  },

  database: {
    dsn: process.env.DB_DSN || 'mongodb://localhost/rixing',
    options: {
      server: {auto_reconnect: true}
    }
  },

  siteUrl: 'http://localhost:4000',

  icon: 'http://f.pubu.im/sunshine/avatar.png',
  botKey: 'hank',
  cmdKeys: {
    help: cmd(['help', '?'],
      '显示命令帮助'),
    list: cmd(['show', 'list', 'ls', 'l'],
      '列出你今天的任务'),
    vacation: cmd(['vacation', 'vcn', 'v', 'pause', 'p', 'skip'],
      '请假',
        'date # moment date pattern'),
    schedule: cmd(['schedule', 'sche', 's'],
      '设置上班时间段',
        'datefield # HHmm-HHmm'),
    register: cmd(['register', 'reg', 'r', 'signup', 'add', 'a', 'new'],
      '注册'),
    clear: cmd(['clear', 'clean', 'clr', 'c', 'k'],
      '注销'),
    hook: cmd(['webhook', 'hook', 'h'],
      '设置 Webhook URL.',
        'url # standard url pattern'),
    fuck: cmd(['fuck', 'fucku', 'fuckya', 'hell', 'fck', 'wtf'], '日')
  },
  outPrefixes: {
    list: ['-', '+'],
    stateDone: ['√', '[x]', 'done', 'ok'],
    statePending: ['[-]', '[..]', '[...]', 'pending'],
    stateQueued: ['x', '[ ]', 'queued'],
    comment: ['|', '//', '::', '#', '--'],
  },

  avatar: {
    prefix: 'https://dn-facecdn.qbox.me'
  }
}

module.exports = config
