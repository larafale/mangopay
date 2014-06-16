
var httpClient = require('../lib/httpClient')
  , httpMethod = require('../lib/httpMethod')

module.exports = httpClient.extend({
  
  path: 'wallets',
  
  includeBasic: [ 'fetch' ],

  methods: {

    create: httpMethod({
      method: 'POST',
      path: '',
      params: {
          'Owners': { required: true }
        , 'Description': { required: true, default: 'wallet' }
        , 'Currency': { required: true, default: 'EUR' }
      }
    }),

    transfer: httpMethod({
      method: 'POST',
      path: '../transfers',
      params: {
          'AuthorId': { required: true }
        , 'DebitedFunds': { required: true }
        , 'Fees': { required: true, default: { Currency: 'EUR', Amount: 0 } }
        , 'DebitedWalletID': { required: true }
        , 'CreditedWalletID': { required: true }
      }
    }),

    payin: httpMethod({
      method: 'POST',
      path: '../payins/card/direct',
      params: {
          'AuthorId': { required: true }
        , 'CreditedUserId': { required: true }
        , 'DebitedFunds': { required: true }
        , 'Fees': { required: true, default: { Currency: 'EUR', Amount: 0 } }
        , 'CreditedWalletID': { required: true }
        , 'SecureModeReturnURL': { required: true }
        , 'CardId': { required: true }
        , 'SecureMode': { default: 'DEFAULT' }
      }
    }),

    transactions: httpMethod({
      method: 'GET',
      path: '{Id}/transactions',
      params: {
          'Id': { required: true }
      }
    })

  }

})
