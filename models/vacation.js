'use strict'

const mongoose = require('mongoose')
const Moment = require('moment')
const Schema = mongoose.Schema

const schema = new Schema({
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

schema.virtual('text').get(function () {
  return new Moment(this.date, 'YYYYMMDD').format('YYYY 年 MM 月 DD 日')
})

schema.statics.add = function* (section, user, moment) {
  const Vacation = mongoose.model('Vacation')
  let team = section.team
  let channel = section.channel
  let date = new Moment(moment).format('YYYYMMDD')
  yield Vacation.create({ team, channel, user, date })
}

module.exports = mongoose.model('Vacation', schema)
