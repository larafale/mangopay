
var httpClient = require('../lib/httpClient')
  , httpMethod = require('../lib/httpMethod')

module.exports = httpClient.extend({
  
  path: 'preauthorizations',
  
  includeBasic: [ ],

  methods: {

    create: httpMethod({
      method: 'POST',
      path: 'card/direct',
      requiredParams: ['AuthorId','DebitedFunds','SecureMode','CardId','SecureModeReturnURL'],
      defaultParams: {
        SecureMode: 'DEFAULT',
        SecureModeReturnURL: '???'
      }
    })

  }

})
