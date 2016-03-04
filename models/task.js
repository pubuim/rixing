'use strict'

const mongoose = require('mongoose')

const Task = mongoose.model('Task', {
  index: {
    type: Number,
    required: true
  },
  text: {
    type: String,
    required: true
  },
  comment: {
    type: String
  },
  status: {
    type: Number,
    enum: [-1, 0, 1], // -1 未完成, 0 进行中, 1 已完成
    required: true,
    default: -1
  },
  channel: {
    type: String,
    required: true
  },
  team: {
    type: String,
    required: true
  },
  created: {
    type: Date,
    required: true,
    default: Date.now
  },
  updated: {
    type: Date,
    required: true
  }
})

module.exports = Task
