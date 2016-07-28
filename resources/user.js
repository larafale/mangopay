
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
    signup: function(user, callback){
      var self = this

      var createWallet = function(err, user){
        if(err) return callback(err)

        self._root.wallet.create({ Owners: [user.Id] }, function(err, wallet){
          // return user & wallet
          callback(err, user, wallet)
        })
      }

      this.create(user, createWallet)
    },

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

    // Legal User
    createLegal: httpMethod({
      method: 'POST',
      path: 'legal',
      params: {
          'Email': { required: true }
        , 'Name': { required: true }
        , 'LegalPersonType': { required: true }
        , 'LegalRepresentativeFirstName': { required: true }
        , 'LegalRepresentativeLastName': { required: true }
        , 'LegalRepresentativeBirthday': { required: true }
        , 'LegalRepresentativeNationality': { required: true, default: 'FR' }
        , 'LegalRepresentativeCountryOfResidence': { required: true, default: 'FR' }
      }
    }),

    fetchLegal: httpMethod({
      method: 'GET',
      path: 'legal/{Id}',
      params: { 'Id': { required: true } }
    }),

    updateLegal: httpMethod({
      method: 'PUT',
      path: 'legal/{Id}',
      params: { 'Id': { required: true } }
    }),

    cards: httpMethod({
      method: 'GET',
      path: '{UserId}/cards?per_page={per_page}&page={page}',
      params: {
         'UserId': { required: true },
         'per_page': { required: false, default: '10' },
         'page': { required: false, default: '0' } 
        }
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
