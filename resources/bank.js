
var httpClient = require('../lib/httpClient')
  , httpMethod = require('../lib/httpMethod')

module.exports = httpClient.extend({
  
  path: 'users',
  
  includeBasic: [ ],

  methods: {

    create: httpMethod({
      method: 'POST',
      path: '{UserId}/bankaccounts/{Type}',
      requiredParams: ['UserId','OwnerName','UserId','Type','OwnerAddress','IBAN','BIC'],
      defaultParams: {
        Type: 'IBAN'
      }
    }),

    fetch: httpMethod({
      method: 'GET',
      path: '{UserId}/bankaccounts/{BankId}',
      requiredParams: ['UserId','BankId']
    }),

    wire: httpMethod({
      method: 'POST',
      path: '../payouts/bankwire',
      requiredParams: ['AuthorId','DebitedWalletId','DebitedFunds','Fees','BankAccountId'],
      defaultParams: {
        Fees: { Currency: 'EUR', Amount: 0 }
      }
    }),

    fetchWire: httpMethod({
      method: 'GET',
      path: '../payouts/{Id}',
      requiredParams: ['Id']
    })

  }

})
