'use strict'

const config = require('config')

exports.matchCommandKey = function () {
  let cmd = Array.from(arguments).compact().join(' ').toCamelCase()
  return Object.keys(config.cmdKeys).find(key => isKeyMatched(cmd, config.cmdKeys[key]))
}

exports.translatePlan = function (text) {
  if (!text) { return null }
  return text.split(/[\r\n]+/g)
    .map(s => s.trim())
    .compact()
    .filter(isList)
    .map(s => {
      let state = matchState(s)
      if (!state) { return null }
      let text = s.replace(state.prefix, '')
      if (!text) { return null }
      let item = { status: state.key, text }
      let comment = findComment(s)
      if (comment) {
        item.comment = comment
        item.text = item.text.replace(comment, '')
      }
      return item
    })
    .compact()
}

function isList (str) {
  return config.outPrefixes.list.some(s => str.startsWith(s))
}

function matchState (str) {
  let keyOfDone = config.outPrefixes.stateDone.find(s => str.startsWith(s))
  if (keyOfDone) { return { key: 'done', prefix: keyOfDone } }
  let keyOfPending = config.outPrefixes.statePending.find(s => str.startsWith(s))
  if (keyOfPending) { return { key: 'pending', prefix: keyOfPending } }
  let keyOfQueued = config.outPrefixes.stateQueued.find(s => str.startsWith(s))
  if (keyOfQueued) { return { key: 'queued', prefix: keyOfQueued } }
}

function findComment (str) {
  let keyOfComment = config.outPrefixes.comment.find(s => str.includes(s))
  if (keyOfComment) { return str.substring(str.indexOf(keyOfComment)) }
}

function isKeyMatched (exp, matcher) {
  if (!exp || !matcher) { return false }
  if (matcher === true) { return true }
  if (String.isString(matcher)) { return matcher === exp }
  if (matcher instanceof RegExp) { return matcher.test(exp) }
  if (Array.isArray(matcher)) { return matcher.some(m => isKeyMatched(exp, m)) }
}
