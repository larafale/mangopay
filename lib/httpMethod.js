
var utils = require('./utils')

/**
 * Create an API method from the declared spec.
 *
 * @param [spec.method='GET'] Request Method (POST, GET, DELETE, PUT)
 * @param [spec.path=''] Path to be appended to the API BASE_PATH, joined with 
 *  the instance's path (e.g. "charges" or "customers")
 * @param [spec.required=[]] Array of required arguments in the order that they
 *  must be passed by the consumer of the API. Subsequent optional arguments are
 *  optionally passed through a hash (Object) as the penultimate argument
 *  (preceeding the also-optional callback argument
 */
var httpMethod = module.exports = function httpMethod(spec){

  var commandPath = utils.makeURLInterpolator( spec.path || '' )
  var requestMethod = (spec.method || 'GET').toUpperCase()
  var requiredParams = spec.requiredParams || []
  var defaultParams = spec.defaultParams || {}
  var middleware = spec.middleware || null

  return function(){
  
    var self = this
    var args = [].slice.call(arguments)

    var callback = typeof args[args.length - 1] == 'function' && args.pop()
    var auth = args.length > requiredParams.length && utils.isAuthKey(args[args.length - 1]) ? args.pop() : null
    var data = utils.isObject(args[args.length - 1]) ? args.pop() : {}

    // merge default params values
    for (param in defaultParams){
      data[param] = data[param] || defaultParams[param]
    }

    // throw error if missing required param
    for (var i = 0, l = requiredParams.length, param; i < l; ++i){
      param = requiredParams[i]
      if (param && !data[param]) throw new Error('parameter "' + param + '" is required')
    }

    if(args.length){
      throw new Error('Unknown arguments (' + args + '). Did you mean to pass an options object ?')
    }

    var deferred = this.createDeferred(callback)
    var requestPath = this.fullPath(commandPath, data)

    self._request(requestMethod, requestPath, data, auth, function(err, data, response){
      if(typeof middleware == 'function'){
        middleware.call(
            self
          , err
          , !err
              ? spec.transformResponseData 
                ? spec.transformResponseData(data)
                : data
              : null
          , response
          , data
          , callback
        )
      }else{
        err
          ? deferred.reject(err)
          : deferred.resolve([
              spec.transformResponseData 
                ? spec.transformResponseData(data)
                : data
              , response
            ])
      }

    })

    return deferred.promise

  }
}


module.exports.BASIC = {

  create: httpMethod({
    method: 'POST'
  }),

  list: httpMethod({
    method: 'GET'
  }),

  fetch: httpMethod({
    method: 'GET',
    path: '/{id}',
    requiredParams: ['id']
  }),

  update: httpMethod({
    method: 'POST',
    path: '{id}',
    requiredParams: ['id']
  }),

  del: httpMethod({
    method: 'DELETE',
    path: '{id}',
    requiredParams: ['id']
  })

}