
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
        , 'SecureModeReturnURL': { required: true, default: 'http://www.domain.tld' }
      }
    }),

    capture: httpMethod({
      method: 'POST',
      path: '../payins/PreAuthorized/direct',
      params: {
          'AuthorId': { required: true }
        , 'CreditedUserId': { required: true }
        , 'DebitedFunds': { required: true }
        , 'Fees': { required: true, default: { Currency: 'EUR', Amount: 0 } }
        , 'CreditedWalletID': { required: true }
        , 'PreauthorizationId': { required: true }
      }
    })

  }

})
