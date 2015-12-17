
var httpClient = require('../lib/httpClient')
  , httpMethod = require('../lib/httpMethod')

module.exports = httpClient.extend({
  
  path: 'payins',
  
  includeBasic: [],

  methods: {

    createByToken: httpMethod({
      method: 'POST',
      path: '/card/direct',
      params: {
          'AuthorId': { required: true }
        , 'CreditedUserId': { required: true }
        , 'DebitedFunds': { required: true }
        , 'Fees': { required: true, default: { Currency: 'EUR', Amount: 0 } }
        , 'CreditedWalletId': { required: true }
        , 'SecureModeReturnURL': { required: true }
        , 'CardId': { required: true }
        , 'SecureMode': { default: 'DEFAULT' }
      }
    }),

    createByWire: httpMethod({
      method: 'POST',
      path: '/bankwire/direct',
      params: {
          'AuthorId': { required: true }
        , 'CreditedUserId': { required: true }
        , 'DeclaredDebitedFunds': { required: true }
        , 'DeclaredFees ': { required: true, default: { Currency: 'EUR', Amount: 0 } }
        , 'CreditedWalletId': { required: true }
      }
    }),

    createByCard: httpMethod({
      method: 'POST',
      path: '/card/web',
      params: {
          'AuthorId': { required: true }
        , 'DebitedFunds': { required: true }
        , 'DeclaredFees ': { required: true, default: { Currency: 'EUR', Amount: 0 } }
        , 'CreditedWalletId': { required: true }
        , 'ReturnURL': { required: true }
        , 'Culture': { required: true }
        , 'CardType': { required: true }
        , 'Tag': { required: false }
      }
    }),

    fetch: httpMethod({
      method: 'GET',
      path: '/{Id}',
      params: {
        'Id': { required: true }
      }
    }), 
    
    createRefund: httpMethod({
      method: 'POST',
      path: '/{Id}/refunds',
      params: {
          'Id': { required: true }
        , 'AuthorId': { required: true }
        , 'DebitedFunds': { required: false }
        , 'Fees': { required: false }
      }
    }),        

    fetchRefund: httpMethod({
      method: 'GET',
      path: '../refunds/{Id}',
      params: {
          'Id': { required: true }
      }
    })    
    
  }

})
