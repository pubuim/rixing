'use strict'

const mongoose = require('mongoose')

const Section = mongoose.model('Section', {
  channel: {
    type: String,
    required: true
  },
  team: {
    type: String,
    required: true
  },
  scheduleStart: {
    type: String,
    required: true,
    default: '1030' // 10:30
  },
  scheduleEnd: {
    type: String,
    required: true,
    default: '1730' // 17:30
  },
  created: {
    type: Date,
    required: true,
    default: Date.now
  }
})

module.exports = Section
