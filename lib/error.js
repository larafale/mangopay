function mangoError(error){
  this.name = 'MangoPayError'
  this.message = error
}

mangoError.prototype = new Error()
mangoError.prototype.constructor = mangoError


module.exports = function(err, body, res){

  var code = /[0-9]/.test(''+err) ? err : (body && body.ResultCode) || false

  if(err && !code)
    return new mangoError(err)

  if(code && code != '000000'){
    var error = new mangoError(module.exports.codes[code] || 'Unknow error code')
    error.code = code
    return error
  }
  
  // dont return an error if 204 to avoid returning Json Parse error (204 is No Content)
  if(res.statusCode != 200 && res.statusCode != 204)
    return new mangoError(err || body || { statusCode: res.statusCode })
}

module.exports.codes = {

  // Operation failed
    '001999':'Generic Operation error'
  , '001001':'Unsufficient wallet balance'
  , '001002':'Author is not the wallet owner'
  , '001011':'Transaction amount is higher than maximum permitted amount'
  , '001012':'Transaction amount is lower than minimum permitted amount'
  
  // Refund transaction error
  , '001401':'Transaction has already been successfully refunded'
  , '005403':'The refund cannot exceed initial transaction amount'
  , '005404':'The refunded fees cannot exceed initial fee amount'
  , '005405':'Balance of client fee wallet insufficient'
  , '005407':'Duplicated operation: you cannot refund the same amount more than once for a transaction during the same day. '
  
  // Card input error
  , '105101':'Invalid card number'
  , '105102':'Invalid cardholder name'
  , '105103':'Invalid PIN code'
  , '105104':'Invalid PIN format'
  
  // Token input Error
  , '105299':'Token input Error'
  , '105202':'Card number: invalid format'
  , '105203':'Expiry date: missing or invalid format'
  , '105204':'CVV: missing or invalid format'
  , '105205':'Callback URL: Invalid format'
  , '105206':'Registration data : Invalid format'
  
  // Generic transaction Error
  , '101001':'The user does not complete transaction'
  , '101002':'The transaction has been cancelled by the user'
  
  // Transaction refused
  , '101101':'Transaction refused by the bank (Do not honor)'
  , '101102':'Transaction refused by the bank (Amount limit)'
  , '101103':'Transaction refused by the terminal'
  , '101104':'Transaction refused by the bank (card limit reached)'
  , '101106':'The card is inactive'
  , '101410':'The card is not active' // payline
  , '101111':'Maximum number of attempts reached'
  , '101112':'Maximum amount exceeded'
  , '101115':'Debit limit exceeded'
  , '101119':'Debit limit exceeded'
  
  // Secure mode / 3DSecure error
  , '101399':'Secure mode: 3DSecure authentication is not available'
  
  // Tokenization / Card registration error
  , '001599':'Token processing error'
  
  // KYC error
  , '002999':'Blocked due to the KYC limitation'
  
  // Fraud issue
  , '008999':'Fraud policy error'
  , '008001':'Counterfeit Card'
  , '008002':'Lost Card'
  , '008004':'Card bin not authorized'
  , '008005':'Security violation'
  , '008006':'Fraud suspected by the bank'
  , '008007':'Opposition on bank account (Temporary)'
  , '008500':'Transaction blocked by Fraud Policy'
  , '008600':'Wallet blocked by Fraud policy'
  , '008700':'User blocked by Fraud policy'
  
  // Technical error
  , '009199':'PSP technical error'
  , '009499':'Bank technical error'
  , '009999':'Technical error'

  // Tokenisation server error codes
  , '09101': 'Username/Password is incorrect'
  , '09102': 'Account is locked or inactive'
  , '09104': 'Client certificate is disabled'
  , '09201': 'You do not have permissions to make this API call'

  // Tokenization server error code (while card registration)
  , '02625': 'Invalid card number'
  , '02626': 'Invalid date. Use mmdd format'
  , '02627': 'Invalid CCV number'

}