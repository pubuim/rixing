'use strict'

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

  botKey: 'hank',
  cmdKeys: {
    // help: ['help', '?', ''],
    list: ['show', 'list', 'ls', 'l'],
    vacation: ['vacation', 'vcn', 'v', 'pause', 'p', 'skip'],
    schedule: ['schedule', 'sche', 's'],
    register: ['register', 'reg', 'r', 'signup', 'add', 'a', 'new'],
    clear: ['clear', 'clean', 'clr', 'c', 'k'],
    hook: ['webhook', 'hook', 'h']
  },
  outPrefixes: {
    list: ['-', '+'],
    stateDone: ['√', '[x]', 'done', 'ok'],
    statePending: ['[-]', '[..]', '[...]', 'pending'],
    stateQueued: ['x', '[ ]', 'queued'],
    comment: ['|', '//', '::'],
  }
}

module.exports = config
