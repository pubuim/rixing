'use strict'

const config = require('config')

exports.matchCommandKey = function () {
  let cmd = Array.from(arguments).compact().join(' ').toCamelCase()
  return Object.keys(config.cmdKeys).find(key => isKeyMatched(cmd, config.cmdKeys[key].alias))
}

exports.translatePlan = function (text) {
  if (!text) { return null }

  return text.split(/[\r\n]+/g)
    .map(s => s.trim())
    .compact()
    .map(s => {
      let prefix = matchList(s)
      if (!prefix) { return }
      return s.replace(prefix, '').trim()
    })
    .compact()
    .map(s => {
      let state = matchState(s)
      let text = s.replace(state.prefix, '')
      let item = { status: state.status, text: text.trim() }
      let mark = findComment(s)
      if (mark) {
        let pieces = item.text.split(mark)
        item.text = pieces.shift().trim()
        item.comment = pieces.join(mark).trim()
      }
      return item
    })
}

function matchList (str) {
  return config.outPrefixes.list.find(s => str.startsWith(s))
}

function matchState (str) {
  let keyOfDone = config.outPrefixes.stateDone.find(s => str.startsWith(s))
  if (keyOfDone) { return { status: '1', prefix: keyOfDone } }
  let keyOfPending = config.outPrefixes.statePending.find(s => str.startsWith(s))
  if (keyOfPending) { return { status: '0', prefix: keyOfPending } }
  let keyOfQueued = config.outPrefixes.stateQueued.find(s => str.startsWith(s))
  if (keyOfQueued) { return { status: '-1', prefix: keyOfQueued } }
  return { status: '-1', prefix: '' }
}

function findComment (str) {
  let keyOfComment = config.outPrefixes.comment.find(s => str.includes(s))
  if (keyOfComment) { return keyOfComment }
}

function isKeyMatched (exp, matcher) {
  if (!exp || !matcher) { return false }
  if (matcher === true) { return true }
  if (String.isString(matcher)) { return matcher === exp }
  if (matcher instanceof RegExp) { return matcher.test(exp) }
  if (Array.isArray(matcher)) { return matcher.some(m => isKeyMatched(exp, m)) }
}
