var httpClient = require('../lib/httpClient')
  , httpMethod = require('../lib/httpMethod')

module.exports = httpClient.extend({
  
  path: 'disputes',
  
  //includeBasic: [ 'fetch', 'update' ],

  methods: {

    view: httpMethod({
      method: 'GET',
      path: '{DisputeId}',
      params: {
          'DisputeId': { required: true }
      }
    }),

    list_transactions: httpMethod({
      method: 'GET',
      path: '{DisputeId}/transactions',
      params: {
        'DisputeId': {required: true }
      }
    })
  }
})