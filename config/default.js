'use strict'

const config = {
  debug: process.env.NODE_ENV === 'development',

  port: process.env.PORT || 3000,

  session: {
    key: 'rx',
    httpOnly: true,
    maxAge: 86400 * 30 // 1 month
  }
}

module.exports = config
