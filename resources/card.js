
var httpClient = require('../lib/httpClient')
  , httpMethod = require('../lib/httpMethod')
  , utils = require('../lib/utils')

var https = require('https')
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

        // after obtaining a cardRegistration object
        // we send the card details to the PSP (payline) url
        var cardDetails = {
          data: data.PreregistrationData,
          accessKeyRef: data.AccessKey,
          cardNumber: urlData.CardNumber,
          cardExpirationDate: urlData.CardExpirationDate,
          cardCvx: urlData.CardCvx
        }

        response.statusCode != 200
          ? next(data || err || true, null)
          : this.sendCardDetails.call(self, data, cardDetails, next)
      }
    }),

    sendCardDetails: function(cardRegistration, cardDetail, next){
      var self = this

      // parse CardRegistrationURL & urlencode cardDetail
      url = Url.parse(cardRegistration.CardRegistrationURL)
      cardDetail = utils.stringifyRequestData(cardDetail || {})

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

          // todo: handle error

          self.completeRegistration.call(self, {
            Id: cardRegistration.Id,
            RegistrationData: body
          }, next)

        })
      })

      req.on('error', function(err){
        next.call(self, err, null)
      })

      req.on('socket', function(socket){
        socket.on('secureConnect', function(){
          req.write(cardDetail)
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
