
var httpClient = require('../lib/httpClient')
  , httpMethod = require('../lib/httpMethod')
  , error = require('../lib/error')
  , utils = require('../lib/utils')

var https = require('https')
var qs = require('querystring')
var Url = require('url')

module.exports = httpClient.extend({

  path: 'cardregistrations',

  includeBasic: [ ],

  methods: {

    initRegistration: httpMethod({
      method: 'POST',
      path: '',
      params: {
          'UserId': { required: true }
        , 'Currency': { required: true, default: 'EUR' }
      }
    }),

    completeRegistration: httpMethod({
      method: 'POST',
      path: '{Id}',
      params: {
          'Id': { required: true }
        , 'RegistrationData': { required: true }
      }
    })

  },

  preAuthorization: httpMethod({
      method: 'POST',
      path: '../preauthorizations/card/direct',
      params: {
        "AuthorId": { required: true },
        "DebitedFunds": { required: true },
        "SecureMode": { default: 'DEFAULT' },
        "CardId": { required: true },
        "SecureModeReturnURL": { required: true }
      }
  }),

  fetch: httpMethod({
      method: 'GET',
      path: '../cards/{Id}',
      params: {
          'Id': { required: true }
      }
  }),

  update: httpMethod({
      method: 'PUT',
      path: '../cards/{Id}',
      params: {
          'Id': { required: true }
      }
  })


})
