var httpClient = require('../lib/httpClient')
  , httpMethod = require('../lib/httpMethod')

module.exports = httpClient.extend({
  
  path: 'repudiations',
  
  //includeBasic: [ 'fetch', 'update' ],

  methods: {

    create: httpMethod({
      method: 'POST',
      path: '{RepudiationId}/settlementtransfer',
      params: {
          'AuthorId': { required: true }
        , 'DebitedFunds': { required: true }
        , 'Fees': { required: true  }
        , 'RepudiationId': { required: true }
      }
    })
  }
})