var httpClient = require('../lib/httpClient')
  , httpMethod = require('../lib/httpMethod')

module.exports = httpClient.extend({
  
  path: 'payouts',
  
  includeBasic: [],

  methods: {

    view: httpMethod({
      method: 'GET',
      path: '{PayOutId}',
      params: {
          'PayOutId': { required: true }
      }
    })
    
  }
})