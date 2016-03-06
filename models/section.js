'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema
const Moment = require('moment')

const schema = new Schema({
  channel: {
    type: String,
    required: true
  },
  team: {
    type: String,
    required: true
  },
  webhook: {
    type: String
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

schema.statics.load = function* (team, channel) {
  const Section = mongoose.model('Section')
  let section = yield Section.findOne({ team, channel })
  if (!section) {
    section = new Section({ team, channel })
    yield section.save()
  }
  return section
}

schema.methods.setSchedule = function (schedule) {
  let mathced = schedule.match(/(\d{2}):?(\d{2})[\/|\-~](\d{2}):?(\d{2})/)
  this.scheduleStart = mathced[1] + mathced[2]
  this.scheduleEnd = mathced[3] + mathced[4]
}

schema.methods.findAvailableUsersWhen = function (date) {
  const Vacation = mongoose.model('Vacation')
  const User = mongoose.model('User')
  return Vacation.find({ team: this.team, channel: this.channel, date }, { user: 1 })
    .then(vacations => {
      let vuids = vacations.pluck('user')
      return User.find({ team: this.team, channel: this.channel, oid: { $nin: vuids } }, { oid: 1, name: 1 })
    })
}

schema.virtual('scheduleText').get(function () {
  return this.scheduleStart[0] + this.scheduleStart[1] + ':' + this.scheduleStart[2] + this.scheduleStart[3] +
            ' ~ ' +
        this.scheduleEnd[0] + this.scheduleEnd[1] + ':' + this.scheduleEnd[2] + this.scheduleEnd[3]
})

schema.statics.toScheduleHintTime = function (time) {
  return new Moment(time, 'HHmm').add(1, 'hour').format('HHmm')
}

schema.virtual('scheduleHintTime').get(function () {
  return schema.statics.toScheduleHintTime(this.scheduleEnd)
})

module.exports = mongoose.model('Section', schema)
