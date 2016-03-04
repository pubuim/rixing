'use strict'

const mongoose = require('mongoose')
const Moment = require('moment')

const Task = mongoose.model('Task', {
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
  }
})

const Plan = mongoose.model('Plan', {
  tasks: [Task],
  user: {
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

Plan.statics.listTodayTask = function* (section, user) {
  let team = section.team
  let channel = section.channel
  let today = new Moment().startOf('day')
  let tomorrow = today.add(1, 'day')
  let plan = yield Plan.findOne({ user: user.oid, team, channel, created: { $gte: today.toDate(), $lt: tomorrow.toDate() } })
  if (!plan) { return [] }
  return plan.tasks
}

Plan.statics.toStatusColor = function* (status) {
  if (status === 1) { return 'success' }
  if (status === -1) { return 'error' }
  return 'info'
}

module.exports = Plan
