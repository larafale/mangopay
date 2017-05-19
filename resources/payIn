
var httpClient = require('../lib/httpClient')
  , httpMethod = require('../lib/httpMethod')

module.exports = httpClient.extend({
  
  path: 'payins',
  
  includeBasic: [ ],

  methods: {

    byTokenizedCard: httpMethod({
      method: 'POST',
      path: 'card/direct',
      params: {
          'AuthorId': { required: true }
        , 'DebitedFunds': { required: true }
        , 'Fees': { required: true }
        , 'CreditedWalletId': { required: true }
        , 'CardId': { required: true }
        , 'SecureModeReturnURL': { required: true, default: 'http://www.domain.tld' }
      }
    }),    

  }

})
