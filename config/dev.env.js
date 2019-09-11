'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  BASE_API: '"http://193.112.178.245:8080"',
  // BASE_API: '"http://192.168.1.100:8080"',
})
