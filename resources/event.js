var httpClient = require('../lib/httpClient')
  , httpMethod = require('../lib/httpMethod')
  , error = require('../lib/error')
  , utils = require('../lib/utils')

var https = require('https')
var qs = require('querystring')
var Url = require('url')

module.exports = httpClient.extend({
  
  path: 'events',
  
  includeBasic: [ 'list'],
    
})

