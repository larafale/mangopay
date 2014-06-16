
var httpClient = require('../lib/httpClient')
  , httpMethod = require('../lib/httpMethod')

module.exports = httpClient.extend({
  
  path: 'preauthorizations',
  
  includeBasic: [ ],

  methods: {

    create: httpMethod({
      method: 'POST',
      path: 'card/direct',
      params: {
          'AuthorId': { required: true }
        , 'DebitedFunds': { required: true }
        , 'SecureMode': { required: true, default: 'DEFAULT' }
        , 'CardId': { required: true }
        , 'SecureModeReturnURL': { required: true }
      }
    })

  }

})
