'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema

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

module.exports = mongoose.model('section', schema)
