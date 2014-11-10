var utils = require('./lib/utils')


function Mango(options){

  if(!(this instanceof Mango))
    return new Mango(options)

  this._options = options || {}

  this._api = {
    auth: false,
    protocol: 'https',
    host: 'api.sandbox.mangopay.com',
    port: '',
    basePath: '/v2/' + this._options.username,
    timeout: 30 * 1000
  }

  if(this._options.production)
    this._api.host = 'api.mangopay.com'

  this.mount(this._options.mount || 'user|card|wallet|author|bank|document|payin|hook')
  this.setAuth(options)
}

Mango.prototype = {

  setAuth: function(key){
    if(utils.isAuthKey(key))
      this._api.auth = 'Basic ' + new Buffer(key.username + ':' + key.password).toString('base64')
    else
      throw Error('Provide credentials')
  },

  mount: function(resources){
    var self = this
    resources.split('|').forEach(function(resource){
      self[resource] = new (require('./resources/' + resource))(self)
    })
  }

}

module.exports = Mango