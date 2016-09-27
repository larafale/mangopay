
var httpClient = require('../lib/httpClient')
  , httpMethod = require('../lib/httpMethod')
  , error = require('../lib/error')
  , utils = require('../lib/utils')

var https = require('https')
var qs = require('querystring')
var Url = require('url')

module.exports = httpClient.extend({

  path: 'cardregistrations',

  includeBasic: [ ],

  methods: {

    initRegistration: httpMethod({
      method: 'POST',
      path: '',
      params: {
          'UserId': { required: true }
        , 'Currency': { required: true, default: 'EUR' }
      }
    }),

    create: httpMethod({
      method: 'POST',
      path: '',
      params: {
          'UserId': { required: true }
        , 'Currency': { required: true, default: 'EUR' }
        , 'CardNumber': { required: true, default: '4970100000000154' }
        , 'CardExpirationDate': { required: true, default: '0216' }
        , 'CardCvx': { required: true, default: '123' }
      }
    }, function(err, body, res, params, next){
        var self = this

        if(err)
          return next(err, null, res)

        // after obtaining a cardRegistration object
        // we send the card details to the PSP (payline) url
        var cardDetails = {
          data: body.PreregistrationData,
          accessKeyRef: body.AccessKey,
          cardNumber: params.CardNumber,
          cardExpirationDate: params.CardExpirationDate,
          cardCvx: params.CardCvx
        }

        this.sendCardDetails.call(self, body, cardDetails, next)
      }
    ),

    sendCardDetails: function(cardRegistration, cardDetails, next){
      var self = this

      // parse CardRegistrationURL & urlencode cardDetails
      var url = Url.parse(cardRegistration.CardRegistrationURL)
      cardDetails = utils.stringifyRequestData(cardDetails || {})

      // prepare outside HTTP call
      var req = https.request({
        host: url.host,
        port: url.port,
        path: url.path,
        method: 'POST'
      })

      var curl = "curl"
      curl += " -X POST"
      curl += " 'https://"+url['host']+url.path+"'"
      curl += " -d '"+cardDetails+"'"
      //console.log(curl)

      req.on('response', function(res){
        var body = ''
        res.setEncoding('utf8')
        res.on('data', function(chunk){ body += chunk })
        res.on('end', function(){

          body = qs.parse(body)

          if(body.errorCode)
            return next.call(self, error(body.errorCode))

          self.completeRegistration.call(self, {
            Id: cardRegistration.Id,
            RegistrationData: qs.stringify(body) // data=hashkey
          }, next)

        })
      })

      req.on('error', function(err){
        next.call(self, err, null)
      })

      req.on('socket', function(socket){
        socket.on('secureConnect', function(){
          req.write(cardDetails)
          req.end()
        })
      })

    },

    completeRegistration: httpMethod({
      method: 'POST',
      path: '{Id}',
      params: {
          'Id': { required: true }
        , 'RegistrationData': { required: true }
      }
    })

  },

  preAuthorization: httpMethod({
      method: 'POST',
      path: '../preauthorizations/card/direct',
      params: {
        "AuthorId": { required: true },
        "DebitedFunds": { required: true },
        "SecureMode": { default: 'DEFAULT' },
        "CardId": { required: true },
        "SecureModeReturnURL": { required: true }
      }
  }),

  fetch: httpMethod({
      method: 'GET',
      path: '../cards/{Id}',
      params: {
          'Id': { required: true }
      }
  }),

  update: httpMethod({
      method: 'PUT',
      path: '../cards/{Id}',
      params: {
          'Id': { required: true }
      }
  })


})
