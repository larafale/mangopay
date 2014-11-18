
var httpClient = require('../lib/httpClient')
  , httpMethod = require('../lib/httpMethod')


module.exports = httpClient.extend({
  
  path: 'users',
  
  methods: {

    // Notice that this method return the document as 
    // the first arg of the callback. There are no err arg.
    // Gotta check why ?
    create: httpMethod(
      {
        method: 'POST',
        path: '{UserId}/KYC/documents',
        requiredParams: ['UserId', 'Type', 'File'],
        defaultParams: {
          Type: 'IDENTIY_PROOF'
        }
      }, 
      function(err, body, response, params, next){
        var self = this

        if(body.status != 'CREATED')
          return next(body || err || true, null)

        self.createPage.call(self, {
          UserId: params.userId, 
          DocumentId: body.Id, 
          File: params.File
        }, next)

      }
    ),

    createPage: httpMethod({
      method: 'POST',
      path: '{UserId}/KYC/documents/{Id}/pages',
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
