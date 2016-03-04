'use strict'

const mongoose = require('mongoose')

const schema = new mongoose.Schema({
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

schema.statics.mapData = function (data) {
  const result = {}

  if (!data) {
    return result
  }

  if (data.team_id) {
    result.team = data.team_id
  }

  if (data.channel_id) {
    result.channel = data.channel_id
  }

  if (data.user_id) {
    result.oid = data.user_id
  }

  if (data.user_name) {
    result.name = data.user_name
  }

  if (data.user_avatar) {
    result.avatar = data.user_avatar
  }

  return result
}

schema.statics.new = function (data) {
  const User = mongoose.model('User')

  if (!data) {
    return new User()
  }

  data = User.mapData(data)

  if (!String.isString(data.team)) {
    throw new Error('team_id must be a string')
  }

  if (!String.isString(data.channel)) {
    throw new Error('channel_id must be a string')
  }

  if (!String.isString(data.user)) {
    throw new Error('user_id must be a string')
  }

  if (!String.isString(data.name)) {
    throw new Error('user_name must be a string')
  }

  if (!String.isString(data.avatar)) {
    throw new Error('avatar must be a string')
  }

  return new User(data)
}

const User = mongoose.model('User', schema)



module.exports = User
