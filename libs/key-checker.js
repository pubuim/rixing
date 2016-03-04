'use strict'

const config = require('config')

exports.isOk = function () {
  let exp = Array.from(arguments).compact().join(' ').toCamelCase()
  return exports.isMatched(exp, config[exp])
}

exports.isMatched = function (exp, matcher) {
  if (!exp || !matcher) { return false }
  if (matcher === true) { return true }
  if (String.isString(matcher) { return matcher === exp })
  if (matcher instanceof RegExp) { return matcher.test(exp) }
  if (Array.isArray(matcher)) { return matcher.some(m => exports.isMatched(exp, m)) }
}
