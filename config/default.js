'use strict'

const config = {
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

config.port = process.env.PORT || 3000


module.exports = config
