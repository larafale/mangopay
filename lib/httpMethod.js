
var utils = require('./utils')
var error = require('./error')

/**
 * Create an API method from the declared spec.
 *
 * spec.method='GET' // Request Method (POST, GET, DELETE, PUT)
 * spec.path='users' // Path to be appended to the API basePath, joined with the instance's path (we can climb up path with ../ )
 * spec.requiredParams=[] // Array of required arguments in the order
 * spec.defaultParams=[] // Array of required arguments in the order
 *
 */
var httpMethod = module.exports = function httpMethod(spec, middleware){

  var commandPath = utils.makeURLInterpolator( spec.path || '' )
  var requestMethod = (spec.method || 'GET').toUpperCase()
  var requiredParams = spec.requiredParams || []
  var defaultParams = spec.defaultParams || {}
  var params = spec.params || {}
  var middleware = middleware || null

  return function(){

    var self = this
    var args = [].slice.call(arguments)
    var callback = typeof args[args.length - 1] == 'function' && args.pop()
    var auth = args.length > requiredParams.length && utils.isAuthKey(args[args.length - 1]) ? args.pop() : null
    var reqData = utils.isObject(args[args.length - 1]) ? args.pop() : {}

    // merge default params values & check required
    for (var param in params){
      reqData[param] = reqData[param] !== undefined ? reqData[param] : params[param].default
      if(reqData[param] === undefined && params[param].required) return callback(new Error('parameter "' + param + '" is required'))
    }

    if(args.length){
      return callback(new Error('Unknown arguments (' + args + '). Did you mean to pass an options object ?'))
    }

    var deferred = this.createDeferred(callback)
    var requestPath = this.fullPath(commandPath, reqData)

    // console.log(requestPath, reqData)

    self._request(requestMethod, requestPath, reqData, auth, function(err, data, res){

      // handle domain logic error
      err = error(err, data, res)

      if(middleware){
        middleware.call(
            self
          , err
          , data
              ? spec.transformResponseData
                ? spec.transformResponseData(data)
                : data
              : null
          , res
          , reqData
          , callback
        )
      }else{
        err
          ? deferred.reject([
              err,
              spec.transformResponseData
                ? spec.transformResponseData(data)
                : data
              , res
            ])
          : deferred.resolve([
              spec.transformResponseData
                ? spec.transformResponseData(data)
                : data
              , res
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
    path: '{Id}',
    params: { 'Id': { required: true } }
  }),

  update: httpMethod({
    method: 'PUT',
    path: '{Id}',
    params: { 'Id': { required: true } }
  }),

  del: httpMethod({
    method: 'DELETE',
    path: '{Id}',
    params: { 'Id': { required: true } }
  })

}
