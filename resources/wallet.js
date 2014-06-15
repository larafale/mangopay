
var httpClient = require('../lib/httpClient')
  , httpMethod = require('../lib/httpMethod')

module.exports = httpClient.extend({
  
  path: 'wallets',
  
  includeBasic: [ 'fetch' ],

  methods: {

    create: httpMethod({
      method: 'POST',
      path: '',
      requiredParams: ['Owners','Description','Currency'],
      defaultParams: {
        Description: 'user wallet',
        Currency: 'EUR'
      }
    }),

    transfer: httpMethod({
      method: 'POST',
      path: '../transfers',
      requiredParams: ['AuthorId','DebitedFunds','Fees','DebitedWalletID','CreditedWalletID'],
      defaultParams: {
        Fees: { Currency: 'EUR', Amount: 0 }
      }
    }),

    payin: httpMethod({
      method: 'POST',
      path: '../payins/card/direct',
      requiredParams: ['AuthorId','CreditedUserId','DebitedFunds','Fees','CreditedWalletID','SecureModeReturnURL','CardId'],
      defaultParams: {
        Fees: { Currency: 'EUR', Amount: 0 },
        SecureModeReturnURL: '',
        SecureMode: 'DEFAULT'
      }
    }),

    transactions: httpMethod({
      method: 'GET',
      path: '{Id}/transactions',
      requiredParams: ['Id']
    })

  }

})
