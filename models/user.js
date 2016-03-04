'use strict'

const mongoose = require('mongoose')

const User = mongoose.model('User', {
  oid: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  avatar: {
    type: String,
    required: true
  },
  channel: {
    type: String,
    required: true
  },
  team: {
    type: String,
    required: true
  },
  join: {
    type: Date,
    required: true,
    default: Date.now
  }
})

module.exports = User
