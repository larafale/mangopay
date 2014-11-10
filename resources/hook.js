var httpClient = require('../lib/httpClient')
  , httpMethod = require('../lib/httpMethod')
  , error = require('../lib/error')
  , utils = require('../lib/utils')

var https = require('https')
var qs = require('querystring')
var Url = require('url')

module.exports = httpClient.extend({
  
  path: 'hooks',
  
  includeBasic: [ 'list', 'fetch', 'update'],

  methods: {

    create: httpMethod({
      method: 'POST',
      path: '',
      params: {
          'Url': { required: true }
        , 'EventType': { required: true }
      }
    }),
  }
})

