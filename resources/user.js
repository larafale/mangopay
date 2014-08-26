
var httpClient = require('../lib/httpClient')
  , httpMethod = require('../lib/httpMethod')

module.exports = httpClient.extend({
  
  path: 'users',
  
  includeBasic: [ 'list' ],

  methods: {

    // By default we are in the "Natural User Context"
    create: httpMethod({
      method: 'POST',
      path: 'natural',
      params: {
          'Email': { required: true }
        , 'FirstName': { required: true }
        , 'LastName': { required: true }
        , 'Birthday': { required: true }
        , 'Nationality': { required: true, default: 'FR' }
        , 'CountryOfResidence': { required: true, default: 'FR' }
      }
    }),

    // Create a user and his wallet
    signup: httpMethod(
      {
        method: 'POST',
        path: 'natural',
        params:{
            'Email': { required: true }
          , 'FirstName': { required: true }
          , 'LastName': { required: true }
          , 'Birthday': { required: true }
          , 'Nationality': { required: true, default: 'FR' }
          , 'CountryOfResidence': { required: true, default: 'FR' }
        }
      },
      function(err, body, res, params, next){
        
        if(err)
          return next(err, null, res)

        this._root.wallet.create({ Owners: [body.Id] }, next)
      }
    ),

    fetch: httpMethod({
      method: 'GET',
      path: 'natural/{Id}',
      params: { 'Id': { required: true } }
    }),

    update: httpMethod({
      method: 'PUT',
      path: 'natural/{Id}',
      params: { 'Id': { required: true } }
    }),

    cards: httpMethod({
      method: 'GET',
      path: '{UserId}/cards',
      params: { 'UserId': { required: true } }
    }),

    wallets: httpMethod({
      method: 'GET',
      path: '{UserId}/wallets',
      params: { 'UserId': { required: true } }
    }),

    transactions: httpMethod({
      method: 'GET',
      path: '{UserId}/transactions',
      params: { 'UserId': { required: true } }
    }),

    banks: httpMethod({
      method: 'GET',
      path: '{UserId}/bankaccounts',
      params: { 'UserId': { required: true } }
    })

  }

})
