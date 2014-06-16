
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
      requiredParams: ['Email','FirstName','LastName','Birthday','Nationality','CountryOfResidence'],
      defaultParams: {
        Nationality: 'FR',
        CountryOfResidence: 'FR'
      }
    }),

    signup: httpMethod(
      {
        method: 'POST',
        path: 'natural',
        requiredParams: ['Email','FirstName','LastName','Birthday','Nationality','CountryOfResidence'],
        defaultParams: {
          Nationality: 'FR',
          CountryOfResidence: 'FR'
        }
      },
      function(err, body, response, params, next){
        if(err)
          return next(err, null)

        this._root.wallet.create({ Owners: [body.Id] }, next)
      }
    ),

    fetch: httpMethod({
      method: 'GET',
      path: 'natural/{Id}',
      requiredParams: ['Id']
    }),

    update: httpMethod({
      method: 'PUT',
      path: 'natural/{Id}',
      requiredParams: ['Id']
    }),

    cards: httpMethod({
      method: 'GET',
      path: '{UserId}/cards',
      requiredParams: ['UserId']
    }),

    wallets: httpMethod({
      method: 'GET',
      path: '{UserId}/wallets',
      requiredParams: ['UserId']
    }),

    transactions: httpMethod({
      method: 'GET',
      path: '{UserId}/transactions?status={status}',
      queryParams: ['status'],
      requiredParams: ['UserId']
    }),

    banks: httpMethod({
      method: 'GET',
      path: '{UserId}/bankaccounts',
      requiredParams: ['UserId']
    })

  }

})
