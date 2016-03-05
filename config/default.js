'use strict'

const cmd = function (alias, description, params) {
  let item = { alias, description }
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

  icon: 'http://f.pubu.im/sunshine/avatar.png',
  botKey: 'hank',
  cmdKeys: {
    help: cmd(['help', '?'],
      'Show the command help.'),
    list: cmd(['show', 'list', 'ls', 'l'],
      'List all your tasks today.'),
    vacation: cmd(['vacation', 'vcn', 'v', 'pause', 'p', 'skip'],
      'Add a vacation without auto-check mentions.',
        'date # moment date pattern'),
    schedule: cmd(['schedule', 'sche', 's'],
      'Set section auto-check mentions\' schedule.',
        'datefield # HHmm-HHmm'),
    register: cmd(['register', 'reg', 'r', 'signup', 'add', 'a', 'new'],
      'Register self for auto-check mention.'),
    clear: cmd(['clear', 'clean', 'clr', 'c', 'k'],
      'Unregister slef for auto-check mention.'),
    hook: cmd(['webhook', 'hook', 'h'],
      'Setup webhook url.',
        'url # standard url pattern')
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
