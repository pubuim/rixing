'use strict'

const mongoose = require('mongoose')
const Promise = require('bluebird')
const config = require('config')

mongoose.Promise = Promise

mongoose.connect(config.database.dsn, config.database.options)
