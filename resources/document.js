
var httpClient = require('../lib/httpClient')
  , httpMethod = require('../lib/httpMethod')


module.exports = httpClient.extend({
  
  path: 'users',
  
  methods: {

    // create a document and add a file (page) directly to it
    // as binding a page does not return any body (204 NO Content), we return the document body instead
    create: httpMethod({
      method: 'POST',
      path: '{UserId}/KYC/documents',
      requiredParams: ['UserId', 'Type'],
      defaultParams: {
        Type: 'IDENTIY_PROOF'
      }
    }),

    // create a document and add a file (page) directly to it
    // as binding a page does not return any body (204 NO Content), we return the document body instead
    createWithFile: httpMethod({
      method: 'POST',
      path: '{UserId}/KYC/documents',
      requiredParams: ['UserId', 'Type', 'File'],
      defaultParams: {
        Type: 'IDENTIY_PROOF'
      }
    }, function(err, body, response, params, next){
      var self = this
        , finalBody = body

      if(!body || body && body.Status != 'CREATED')
        return next(err, body, response, params)

      this.addFile({
        UserId: params.UserId, 
        DocumentId: body.Id, 
        File: params.File
      }, function(err, body, response, params){
        return next(err, finalBody, response, params)
      })

    }),

    addFile: httpMethod({
      method: 'POST',
      path: '{UserId}/KYC/documents/{DocumentId}/pages',
      requiredParams: ['UserId', 'File'],
    }),

    fetch: httpMethod({
      method: 'GET',
      path: '{UserId}/KYC/documents/{Id}',
      requiredParams: ['UserId','Id'],
    }),

    update: httpMethod({
      method: 'PUT',
      path: '{UserId}/KYC/documents/{Id}',
      requiredParams: ['UserId','Id'],
    })

  }

})
