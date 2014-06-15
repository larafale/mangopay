# MangoPay nodejs APIv2 wrapper

This is not the official Mangopay Node library.  
At this time they don't have one, so we'll see what's next.  
It's here for a personal use and inspired by Stripe node api wrapper.

Feel free to use & contribute

## Installation

`npm install mangopay`

## Documentation

Documentation is available at [http://docs.mangopay.com/api-references](http://docs.mangopay.com/api-references)

## API Overview

Every resource is accessed via your `mango` instance:

```js
var mango = require('mangopay')({
    username: 'username',
    password: 'passphrase',
    production: false
})
// mango.{ RESOURCE_NAME }.{ METHOD_NAME }()
```

Every resource method accepts an optional callback as the last argument:

```js
mango.card.create({ 
  UserId: '2565355',
  CardNumber: '4970100000000154',
  CardExpirationDate: '0216',
  CardCvx: '123',
}, function(err, card, res){
  err;	
  card; // mango card object 
  res; // raw 'http' response object => res.statusCode === 200
})
```

### Available resources & methods

*Where you see `params` it is a plain JavaScript object, e.g. `{ Email: 'foo@example.com' }`*

* user
  * `create(params)`
  * `fetch(params)`
  * `list()`
  * `cards(params)`
  * `wallets(params)`
  * `tansactions(params)`
  * `banks(params)`

* bank
  * `create(params)`
  * `fetch(params)`
  * `wire(params)`
  * `fetchWire(params)`

* wallet
  * `create(params)`
  * `fetch(params)`
  * `transfer(params)`
  * `payin(params)`
  * `tansactions(params)`

* card
  * `create(params)`

* author
  * `create(params)`
  
 
### Test

`npm test`  
don't forget to provide credentials in `test/__credentials.json`

### Todos
 
 * oauth implementation
 * user methods only works for "Natural Users"
 * exhaustive api methods
 * ...
 