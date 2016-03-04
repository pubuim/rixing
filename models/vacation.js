'use strict'

const mongoose = require('mongoose')

const Vacation = mongoose.model('Vacation', {
  date: {
    type: Date,
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

module.exports = Vacation
