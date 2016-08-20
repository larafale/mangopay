
var httpClient = require('../lib/httpClient')
  , httpMethod = require('../lib/httpMethod')


module.exports = httpClient.extend({
  // The document resource fetches documents based on UserId.
  // But sometimes, you want to fetch documents by their Id, without UserId.
  // That's why this 'kyc' resource exists.
  path: 'kyc/documents',
      
  includeBasic: [ 'list' ], // See: https://docs.mangopay.com/endpoints/v2.01/kyc-documents#e217_list-all-kyc-documents
  
  methods: {

    /*
      See: https://docs.mangopay.com/endpoints/v2.01/kyc-documents#e207_view-a-kyc-document
    */
    fetch: httpMethod({
      method: 'GET',
      path: '{Id}',
      requiredParams: ['Id'],
    })

  }

})
