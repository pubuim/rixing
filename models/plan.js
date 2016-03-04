'use strict'

const mongoose = require('mongoose')
const Moment = require('moment')
const Schema = mongoose.Schema

const taskSchema = new Schema({
  text: {
    type: String,
    required: true
  },
  comment: {
    type: String
  },
  status: {
    type: String,
    enum: ['-1', '0', '1'], // -1 未完成, 0 进行中, 1 已完成
    required: true,
    default: -1
  }
})

const planSchema = new Schema({
  tasks: [taskSchema],
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
    required: true,
    default: Date.now
  }
})

planSchema.statics.findByDate = function* (userId, date) {
  const Plan = mongoose.model('Plan')
  let today = new Moment(date).startOf('day')
  let tomorrow = today.clone().add(1, 'day')
  let plan = yield Plan.findOne({ user: userId, created: { $gte: today.toDate(), $lt: tomorrow.toDate() } })
  return plan
}

planSchema.statics.listTodayTask = function* (section, user) {
  const Plan = mongoose.model('Plan')
  let team = section.team
  let channel = section.channel
  let cursor = new Moment().startOf('day')
  let today = cursor.clone()
  let tomorrow = cursor.add(1, 'day')
  let plan = yield Plan.findOne({ user: user.oid, team, channel, created: { $gte: today.toDate(), $lt: tomorrow.toDate() } })
  if (!plan) { return [] }
  return plan.tasks
}

planSchema.statics.toStatusColor = function* (status) {
  if (status === '1') { return 'success' }
  if (status === '-1') { return 'error' }
  return 'info'
}

module.exports = mongoose.model('Plan', planSchema)
