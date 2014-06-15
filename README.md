# Mango node.js API v2 Wrapper

## Installation

`npm install mangopay`

## Documentation

Documentation is available at http://docs.mangopay.com/api-references

## API Overview

Every resource is accessed via your `mango` instance:

```js
var mango = require('mangopay')({
    username: 'username',
    password: 'pathphrase',
    production: false
});

// mango.{ RESOURCE_NAME }.{ METHOD_NAME }
```

Every resource method accepts an optional callback as the last argument:

```js
mango.user.create(
  { email: 'customer@example.com' },
  function(err, user) {
    err; // null if no error occurred
    customer; // the created user object
  }
);
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
 