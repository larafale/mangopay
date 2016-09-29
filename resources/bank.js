
var httpClient = require('../lib/httpClient')
  , httpMethod = require('../lib/httpMethod')

module.exports = httpClient.extend({
  
  path: 'users',
  
  includeBasic: [ ],

  methods: {

    create: httpMethod({
      method: 'POST',
      path: '{UserId}/bankaccounts/{Type}',
      params: {
          'OwnerName': { required: true }
        , 'Type': { required: true, default: 'IBAN' }
        , 'OwnerAddress': { required: true }
      }
    }),

    fetch: httpMethod({
      method: 'GET',
      path: '{UserId}/bankaccounts/{BankId}',
      params: {
          'UserId': { required: true }
        , 'BankId': { required: true }
      }
    }),

    wire: httpMethod({
      method: 'POST',
      path: '../payouts/bankwire',
      params: {
          'AuthorId': { required: true }
        , 'DebitedWalletId': { required: true }
        , 'DebitedFunds': { required: true }
        , 'Fees': { required: true, default: { Currency: 'EUR', Amount: 0 } }
        , 'BankAccountId': { required: true }
      }
    }),

    fetchWire: httpMethod({
      method: 'GET',
      path: '../payouts/{Id}',
      params: { 'Id': { required: true } }
    }),

    update: httpMethod({
      method: 'PUT',
      path: '{UserId}/bankaccounts/{BankId}',
      params: {
          'UserId': { required: true }
        , 'BankId': { required: true }
      }
    })

  }

})
