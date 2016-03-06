'use strict'

require('node-extensions')

const mongoose = require('mongoose')
const Promise = require('bluebird')
const config = require('config')
const loader = require('./libs/stack-loader')

mongoose.connect(config.database.dsn, config.database.options)
mongoose.Promise = Promise

loader(__dirname, './models')
