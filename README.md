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

  * Create natural user: 
  
```js
  mango.user.create({
      FirstName: "Victor", // Required
      LastName: "Hugo",    // Required
      Birthday: 1300186358,  // Required
      Nationality: "FR", // Required, default: 'FR'
      CountryOfResidence: "FR", // Required, default: 'FR'
      Address: "1 rue des Misérables, Paris",
      Occupation: "Writer", 
      IncomeRange: "6", 
      ProofOfIdentity: null,
      ProofOfAddress: null, 
      PersonType: "NATURAL", 
      Email: "victor@hugo.com", 
      Tag: "custom tag",
    }, function(err, user, res){
        console.log('err', err);
        console.log('user', user);
        console.log('res', res.statusCode);

    });
```

  * Create natural user and wallet: 
  
```js
  mango.user.signup({
      FirstName: "Victor", // Required
      LastName: "Hugo",    // Required
      Birthday: 1300186358,  // Required
      Nationality: "FR", // Required, default: 'FR'
      CountryOfResidence: "FR", // Required, default: 'FR'
      Address: "1 rue des Misérables, Paris",
      Occupation: "Writer", 
      IncomeRange: "6", 
      ProofOfIdentity: null,
      ProofOfAddress: null, 
      PersonType: "NATURAL", 
      Email: "victor@hugo.com", 
      Tag: "custom tag",
    }, function(err, wallet, res){
        console.log('err', err);
        console.log('wallet', wallet);
        console.log('res', res.statusCode);

    });
```

  * Fetch natural user: 
  
```js
    mango.user.fetch({
      Id: "123456789", // Required
    }, function(err, user, res){
        console.log('err', err);
        console.log('user', user);
        console.log('res', res.statusCode);

    });
```

  * Update natural user: 
  
```js
    mango.user.update({
      Id: "123456789", // Required
      // all the fields to be updated
    }, function(err, user, res){
        console.log('err', err);
        console.log('user', user);
        console.log('res', res.statusCode);

    });
```
  * List natural users: 
  
```js
    mango.user.list(function(err,users){
        console.log(users); 
    });
```

  * List all cards belonging to a user: 
  
```js
    mango.user.cards({
      UserId: "123456789", // Required
    }, function(err, cards, res){
        console.log('err', err);
        console.log('cards', cards);
        console.log('res', res.statusCode);

    });
```

  * List all wallets belonging to a user: 
  
```js
    mango.user.wallets({
      UserId: "123456789", // Required
    }, function(err, wallets, res){
        console.log('err', err);
        console.log('wallets', wallets);
        console.log('res', res.statusCode);

    });
```

  * List all transactions belonging to a user: 
  
```js
    mango.user.transactions({
      UserId: "123456789", // Required
    }, function(err, transactions, res){
        console.log('err', err);
        console.log('transactions', transactions);
        console.log('res', res.statusCode);

    });
```

  * List all bank accounts linked to a user: 
  
```js
    mango.user.banks({
      UserId: "123456789", // Required
    }, function(err, bankaccounts, res){
        console.log('err', err);
        console.log('bankaccounts', bankaccounts);
        console.log('res', res.statusCode);

    });
```

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

* document
  * `create(params)`
  
 
### Test

`npm test`  
don't forget to provide credentials in `test/__credentials.json`

### Todos
 
 * oauth implementation
 * user methods only works for "Natural Users"
 * exhaustive api methods
 * ...
 
