var http = require('http')
var https = require('https')
var path = require('path')
var when = require('when')

var utils = require('./utils')
var hasOwn = {}.hasOwnProperty

httpClient.extend = utils.protoExtend



function httpClient(root){

  this._root = root
  this.basePath = utils.makeURLInterpolator(this._root._api['basePath'])
  this.relativePath = utils.makeURLInterpolator(this.path)

  // mount basic methods
  if(this.includeBasic){
    this.includeBasic.forEach(function(methodName){
      this[methodName] = require('./httpMethod').BASIC[methodName]
    }, this)
  }

  // mount declared methods
  if(this.methods){
    for(methodName in this.methods){
      if(hasOwn.call(this.methods, methodName)){
        this[methodName] = this.methods[methodName]
      }
    }
  }
}


httpClient.prototype = {

  fullPath: function(commandPath, urlData){
    return path.join(
      this.basePath(urlData),
      this.relativePath(urlData),
      typeof commandPath == 'function' ?
        commandPath(urlData) : commandPath
    ).replace(/\\/g, '/') // ugly workaround for Windows
  },

  createUrlData: function(){
    var urlData = {}
    // Merge in baseData
    // for (var i in this._urlData){
    //   if (hasOwn.call(this._urlData, i)){
    //     urlData[i] = this._urlData[i]
    //   }
    // }
    return urlData
  },

  createDeferred: function(callback){
      var deferred = when.defer()

      if (callback){
        // Callback, if provided, is a simply translated to Promise'esque:
        // (Ensure callback is called outside of promise stack)
        deferred.promise.then(function(data){
          setTimeout(function(){ callback(null, data[0], data[1]) }, 0)
        }, function(data){
          setTimeout(function(){ callback(data[0] /* err */, data[1] /* data */, data[2] /* res */) }, 0)
        })
      }

      return deferred
  },

  _responseHandler: function(req, callback){
    var self = this
    return function(res){
      var body = ''

      res.setEncoding('utf8')
      res.on('data', function(chunk){
        body += chunk
      })
      res.on('end', function(){

        if(!body) return callback.call(self, null, null, res)

        try {
          body = JSON.parse(body)

          // handle error here
          // var err = false
          // if( body.type == '_error' || res.statusCode === 401 ) do stuff
          // return callback.call(self, err, null)

        } catch (e){
          return callback.call(self, new Error('Invalid JSON'), null, res)
        }

        callback.call(self, null, body, res)
      })
    }
  },

  _errorHandler: function(req, callback){
    var self = this
    return function(error){
      if (req._isAborted) return // already handled
      callback.call(
        self, 'Http error', null
      )
    }
  },

  _timeoutHandler: function(timeout, req, callback) {
    var self = this;
    return function() {
      var timeoutErr = new Error('ETIMEDOUT');
      timeoutErr.code = 'ETIMEDOUT';

      req._isAborted = true;
      req.abort();

      callback.call(
        self, 'timeout reached (' + timeout + 'ms)', null
      );
    }
  },

  _request: function(method, path, data, auth, callback){

    var self = this
    var requestData = data ? JSON.stringify(data) : '' // or {} as default, we'll see
    var urlQuery = utils.stringifyRequestData(data && data.$query || {})

    var headers = {
      'Authorization': self._root._api['auth'],
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(requestData),
      'User-Agent': '@Larafale'
    }

    if(urlQuery) path = [path, '?', urlQuery].join('') // append ?query to path url
    if(data.$query) delete data.$query // remove $query from payload
    if(data.$idempotencyKey) {
      headers['Idempotency-Key'] = data.$idempotencyKey; // add key to header
      delete data.$idempotencyKey // remove $idempotencyKey from payload
    }

    function makeRequest(){

      var isInsecureConnection = self._root._api['protocol'] === 'http'

      var req = (
        isInsecureConnection ? http : https
      ).request({
        host: self._root._api['host'],
        port: self._root._api['port'],
        path: path,
        method: method,
        headers: headers
      })

      if(self._root._options.debug){
        var curl = "curl"
        curl += " -X " + method
        curl += " '"+self._root._api['protocol']+"://"+self._root._api['host']+path+"'"
        curl += " -H 'Content-Type: "+headers['Content-Type']+"'"
        curl += " -H 'Authorization: "+headers['Authorization']+"'"
        curl += " -d '"+requestData+"'"

        console.log(curl)
        // console.log({
        //   method: method,
        //   host: self._root._api['host'],
        //   port: self._root._api['port'],
        //   path: path,
        //   payload: requestData,
        //   headers: headers
        // })
      }

      req.setTimeout(self._root._api['timeout'], self._timeoutHandler(self._root._api['timeout'], req, callback));
      req.on('response', self._responseHandler(req, callback))
      req.on('error', self._errorHandler(req, callback))

      req.on('socket', function(socket){
        socket.on((isInsecureConnection ? 'connect' : 'secureConnect'), function(){
          // Send payload we're safe:
          req.write(requestData)
          req.end()
        })
      })

    }

    makeRequest()

  }


}

module.exports = httpClient
