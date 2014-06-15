
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

    create: httpMethod({
      method: 'POST',
      path: '',
      requiredParams: ['UserId', 'Currency','CardNumber','CardExpirationDate','CardCvx'],
      defaultParams: {
        Currency: 'EUR',
        CardNumber: '4970100000000154',
        CardExpirationDate: '0216',
        CardCvx: '123',
      },
      middleware: function(err, data, response, urlData, next){
        var self = this

        if(response.statusCode != 200)
          return next(data || err || true, null)

        // after obtaining a cardRegistration object
        // we send the card details to the PSP (payline) url
        var cardDetails = {
          data: data.PreregistrationData,
          accessKeyRef: data.AccessKey,
          cardNumber: urlData.CardNumber,
          cardExpirationDate: urlData.CardExpirationDate,
          cardCvx: urlData.CardCvx
        }

        this.sendCardDetails.call(self, data, cardDetails, next)
      }
    }),

    sendCardDetails: function(cardRegistration, cardDetails, next){
      var self = this

      // parse CardRegistrationURL & urlencode cardDetails
      url = Url.parse(cardRegistration.CardRegistrationURL)
      cardDetails = utils.stringifyRequestData(cardDetails || {})

      // prepare outside HTTP call
      var req = https.request({
        host: url.host,
        port: url.port,
        path: url.path,
        method: 'POST'
      })

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
      requiredParams: ['Id','RegistrationData']
    })

  }

})
