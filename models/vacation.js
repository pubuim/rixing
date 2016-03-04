'use strict'

const mongoose = require('mongoose')
const Moment = require('moment')

const Vacation = mongoose.model('Vacation', {
  date: {
    type: String, // 20000101 > 2000~01~01
    required: true
  },
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
  }
})

Vacation.virtual('text').get(function () {
  return new Moment(this.date, 'YYYYMMDD').format('YYYY 年 MM 月 DD 日')
})

Vacation.statics.add = function* (section, user, moment) {
  let team = section.team
  let channel = section.channel
  let date = new Moment(moment).format('YYYYMMDD')
  yield Vacation.create({ team, channel, user, date })
}

module.exports = Vacation
