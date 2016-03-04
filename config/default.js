'use strict'

const config = {
  debug: process.env.NODE_ENV === 'development',

  port: process.env.PORT || 3000,

  session: {
    key: 'rx',
    httpOnly: true,
    maxAge: 86400 * 30 // 1 month
  },

  cmdKeys: {
    botKey: 'hank',

    listPrefix: [/^\s*(?:\-|\+)?\s*$/],
    stateDonePrefix: ['√', '[x]', 'done', 'ok'],
    statePendingPrefix: [/^\.{1,3}(?:pending)?$/, '[-]'],
    stateQueuedPrefix: ['x', '[ ]', 'queued', 'no', '✖'],
    commentPrefix: [/1`/],

    listKey: ['show', 'list', 'ls', 'l', ''],
    vacationKey: ['vacation', 'vcn', 'v', 'pause', 'p', 'skip'],
    registerKey: ['register', 'reg', 'r', 'signup', 'add', 'a', 'new'],
    clearKey: ['clear', 'clean', 'clr', 'c', 'k']
  }
}


module.exports = config
