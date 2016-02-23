[![Circle CI](https://circleci.com/gh/larafale/mangopay.svg?&style=shield&circle-token=cb4fe61061baa5dc1826b33887aee7826150a681)](https://circleci.com/gh/larafale/mangopay)
  
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

Methods that list items (cards, transactions, users, etc...) can paginate, filter and sort fields using a special `$query` parameter:

```js
mango.user.transactions({
  UserId: "123456789",
  $query:{
    Sort:"LastName:asc",
    page:1,
    per_page:100
  }
},
function(err, transactions, res){
  console.log('err', err);
  console.log('transactions', transactions);
  console.log('res', res.statusCode);
});
```
or alternatively you can pass a String: `$query: "Sort=LastName:asc&page=1&per_page=100"`

More information on the specific [documentation page](https://docs.mangopay.com/api-references/sort-lists/)

### Available resources & methods

*Where you see `params` it is a plain JavaScript object, e.g. `{ Email: 'foo@example.com' }`*

* user

Create natural user: 
  
```js
    mango.user.create({
        FirstName:             "Victor"           // Required
      , LastName:              "Hugo"             // Required
      , Birthday:              1300186358         // Required
      , Nationality:           "FR"               // Required - default: 'FR'
      , CountryOfResidence:    "FR"               // Required - default: 'FR'
      , Occupation:            "Writer" 
      , IncomeRange:           "6" 
      , ProofOfIdentity:       ""
      , ProofOfAddress:        "" 
      , PersonType:            "NATURAL" 
      , Email:                 "victor@hugo.com" 
      , Tag:                   "custom tag"
      , Address:                 {
            AddressLine1: "4101 Reservoir Rd NW"
          , AddressLine2: ""
          , City: "Washington"
          , Region: "District of Columbia"
          , PostalCode: "20007"
          , Country: "US"
      , }
    }, function(err, user, res){
        console.log('err', err);
        console.log('user', user);
        console.log('res', res.statusCode);
    });
```

Create natural user and wallet: 
  
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
    }, function(err, user, wallet){
        console.log('err', err);
        console.log('user', user);
        console.log('wallet', wallet);
    });
```

Fetch natural user: 
  
```js
    mango.user.fetch({
      Id: "123456789", // Required
    }, function(err, user, res){
        console.log('err', err);
        console.log('user', user);
        console.log('res', res.statusCode);
    });
```

Update natural user: 
  
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

List natural users: 
  
```js
    mango.user.list(function(err,users){
        console.log(users); 
    });
```

Create legal user: 
  
```js
    mango.user.createLegal({
      Name: 'mycompany.com', 
      Email: 'info@mycompany.com',
      LegalPersonType: 'BUSINESS',
      LegalRepresentativeFirstName: 'John',
      LegalRepresentativeLastName: 'Doe',
      LegalRepresentativeEmail: 'john_doe@mycompany.es',
      HeadquartersAddress: 'Canal Street, Madrid, Spain',
      LegalRepresentativeAdress: 'Canal Street, Madrid, Spain',
      LegalRepresentativeBirthday: moment('300681', 'DDMMYY').unix(),
      LegalRepresentativeCountryOfResidence: 'ES',
      LegalRepresentativeNationality: 'ES',
    }, function(err, user, res){
        console.log('err', err);
        console.log('user', user);
        console.log('res', res.statusCode);
    });
```

Fetch legal user: 
  
```js
    mango.user.fetchLegal({
      Id: "123456789", // Required
    }, function(err, user, res){
        console.log('err', err);
        console.log('user', user);
        console.log('res', res.statusCode);
    });
```

List all cards belonging to a user: 
  
```js
    mango.user.cards({
      UserId: "123456789", // Required
    }, function(err, cards, res){
        console.log('err', err);
        console.log('cards', cards);
        console.log('res', res.statusCode);
    });
```

List all wallets belonging to a user: 
  
```js
    mango.user.wallets({
      UserId: "123456789", // Required
    }, function(err, wallets, res){
        console.log('err', err);
        console.log('wallets', wallets);
        console.log('res', res.statusCode);
    });
```

List all transactions belonging to a user: 
  
```js
    mango.user.transactions({
      UserId: "123456789", // Required
    }, function(err, transactions, res){
        console.log('err', err);
        console.log('transactions', transactions);
        console.log('res', res.statusCode);
    });
```

List all bank accounts linked to a user: 
  
```js
    mango.user.banks({
      UserId: "123456789", // Required
    }, function(err, bankaccounts, res){
        console.log('err', err);
        console.log('bankaccounts', bankaccounts);
        console.log('res', res.statusCode);
    });
```

* wallet

Create wallet for a user:

```js
    mango.wallet.create({
        Owners: ["1167492"], // Required
        Description: "A very cool wallet", // Required, default: 'wallet'
        Currency: "EUR", // Required, default: 'EUR'
        Tag: "your custom tag"
    }, function(err, wallet, res){
        console.log('err', err);
        console.log('wallet', wallet);
        console.log('res', res.statusCode);
    });
```

Fetch wallet by id:

```js
    mango.wallet.fetch({
        Id: "1167492", // Required
    }, function(err, wallet, res){
        console.log('err', err);
        console.log('wallet', wallet);
        console.log('res', res.statusCode);
    });
```

Transfer e-money from a wallet to another wallet:

```js
    mango.wallet.transfer({
        AuthorId : "1167495", // Required
        DebitedFunds: {Currency : "EUR", Amount : 1000}, // Required
        Fees : {Currency : "EUR", Amount : 100}, // Required, default 'EUR' and 0 
        DebitedWalletID : "1167496", // Required (Where the funds are held before the transfer)
        CreditedWalletID : "1167504", // Required (Where the funds will be held after the transfer)
        CreditedUserId : "1167502",
        Tag : "DefaultTag"
    }, function(err, transfer, res){
        console.log('err', err);
        console.log('transfer', transfer);
        console.log('res', res.statusCode);
    });
```

For a complete list of available parameters check [http://docs.mangopay.com/api-references/transfers/](http://docs.mangopay.com/api-references/transfers/)

Fetch transfer:

```js
    mango.wallet.fetchTransfer({
        Id: "1167492", // Required
    }, function(err, transfer, res){
        console.log('err', err);
        console.log('transfer', transfer);
        console.log('res', res.statusCode);
    });
```

Fetch all transactions for a given wallet: 
  
```js
    mango.wallet.transactions({
      Id: "123456789", // Required
    }, function(err, transaction, res){
        console.log('err', err);
        console.log('transaction', transcation);
        console.log('res', res.statusCode);
    });
```

Create refund:

```js
    mango.wallet.createRefund({         
        Id: "1122477",        // Required (The ID of the Transfer)  
        AuthorId: "1167492",  // Required (The user ID of the Transfer transaction’s author)    
    }, function(err, refund, res){
        console.log('err', err);
        console.log('refund', refund);
        console.log('res', res.statusCode);
    })
``` 

Fetch refund:

```js
    mango.wallet.fetchRefund({         
        Id: "1348477",        // Required (The ID of the Refund)  
    }, function(err, refund, res){
        console.log('err', err);
        console.log('refund', refund);
        console.log('res', res.statusCode);
    })
``` 

* card

Register a card:

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

Init two-step card registration process:

```js
    mango.card.initRegistration({ 
      UserId: '2565355',
      Currency: "EUR"
    }, function(err, registration, res){
      err;  
      registration; // mango registration object 
      res; // raw 'http' response object => res.statusCode === 200
    })
```

Fetch a registered card:

```js
    mango.card.fetch({ 
      Id: '2565355', // Required
    }, function(err, card, res){
        console.log('err', err);
        console.log('card', card);
        console.log('res', res.statusCode);
    })
```

Update a registered card: 

The only editable parameter is `Active`, that can be switched from true to false and this action is irreversible.
  
```js
    mango.card.update({
      Id: "2565355", // Required
    }, function(err, card, res){
        console.log('err', err);
        console.log('card', card);
        console.log('res', res.statusCode);
    });
```

* bank

Register a bank account for a user:

```js
    mango.bank.create({ 
        OwnerName: "Victor Hugo",           // Required
        UserId: "1345678",                  // Required
        Type: "IBAN",                       // Required, Default: 'IBAN'
        OwnerAddress: "1 rue des Misérables", // Required
        IBAN: "FR3020041010124530725S03383", // Required
        BIC: "CRLYFRPP"                     // Required
    }, function(err, bankaccount, res){
        console.log('err', err);
        console.log('bankaccount', bankaccount);
        console.log('res', res.statusCode);
    })
```

Get a bank account:

```js
    mango.bank.fetch({ 
      UserId: '2565355', // Required
      BankId: '1234566', // Required
    }, function(err, bankaccount, res){
        console.log('err', err);
        console.log('bankaccount', bankaccount);
        console.log('res', res.statusCode);
    })
```

Withdraw money from a wallet to a bank account:

```js
    mango.bank.wire({ 
        AuthorId:"12567875",        // Required
        DebitedWalletId:"12449234", // Required
        DebitedFunds:{              // Required
            Currency:"EUR",
            Amount:"1000"
        },
        Fees:{                      // Required, Default: 'EUR', 0
            Currency:"EUR",
            Amount:"100"
        },
        BankAccountId:"12449209",  // Required
        BIC: "CRLYFRPP"            // Required
    }, function(err, wire, res){
        console.log('err', err);
        console.log('wire', wire);
        console.log('res', res.statusCode);
    })
```

Get wire:

```js
    mango.bank.fetchWire({ 
      Id: '2565355', // Required
    }, function(err, wire, res){
        console.log('err', err);
        console.log('wire', wire);
        console.log('res', res.statusCode);
    })
```

* author
  * `create(params)`

* document
  * `create(params)`
  * `createWithFile(params)`
  * `addFile(params)`
  * `fetch(params)`
  * `update(params)`
  
* payin

Create a direct payin by tokenized card:

```js
    mango.payin.createByToken({         
        AuthorId: "1167492",        // Required (The user ID of the Payin transaction’s author)
        CreditedUserId : "1167502", // Required (The ID of the owner of the credited wallet)
        DebitedFunds: {             // Required
              Currency: "EUR",
              Amount: 10000
        },
        Fees: {               // Required
              Currency: "EUR",
              Amount: 100
        },
        CreditedWalletId: "1167810",  // Required (The ID of the credited wallet)
        CardId: "1262419",            // Required
        SecureMode:"DEFAULT",
        SecureModeReturnURL:"https://www.mysite.com",
        Tag: "payin" // Required

    }, function(err, payin, res){
        console.log('err', err);
        console.log('payin', payin);
        console.log('res', res.statusCode);
    })
```

Create a direct payin by card:

```js
    mango.payin.createByCard({         
        AuthorId: "1167492",        // Required (The user ID of the Payin transaction’s author)
        CreditedUserId : "1167502", // Required (The ID of the owner of the credited wallet)
        DebitedFunds: {             // Required
              Currency: "EUR",
              Amount: 10000
        },
        DeclaredFees: {               // Required
              Currency: "EUR",
              Amount: 100
        },
        CreditedWalletId: "1167810",  // Required (The ID of the credited wallet)
        ReturnURL:"https://www.mysite.com",
        Culture: "nl",
        CardType: "IDEAL",            // Required
        Tag: "payin" // Required
  
    }, function(err, payin, res){
        console.log('err', err);
        console.log('payin', payin);
        console.log('res', res.statusCode);
    })
```

Fetch payin:

```js
    mango.payin.fetch({         
        Id: "1122477",        // Required (The ID of the Payin)        
    }, function(err, payin, res){
        console.log('err', err);
        console.log('payin', payin);
        console.log('res', res.statusCode);
    })
```

Create refund:

```js
    mango.payin.createRefund({         
        Id: "1122477",        // Required (The ID of the Payin)  
        AuthorId: "1167492",  // Required (The user ID of the Payin transaction’s author)    
    }, function(err, refund, res){
        console.log('err', err);
        console.log('refund', refund);
        console.log('res', res.statusCode);
    })
``` 

Fetch refund:

```js
    mango.payin.fetchRefund({         
        Id: "1348477",        // Required (The ID of the Refund)  
    }, function(err, refund, res){
        console.log('err', err);
        console.log('refund', refund);
        console.log('res', res.statusCode);
    })
``` 

* hook

Create a hook:

```js
    mango.hook.create({         
        Url: "https://my_notifications_end_point.com", // Required 
        EventType: "PAYIN_NORMAL_SUCCEDED",  // Required
        Tag: "hook"

    }, function(err, hook, res){
        console.log('err', err);
        console.log('hook', hook);
        console.log('res', res.statusCode);
    })
```

List all hooks:

```js
    mango.hook.list(function(err, hooks, res){
        console.log('err', err);
        console.log('hooks', hooks);
        console.log('res', res.statusCode);
    })
```

Fetch hook:

```js
    mango.hook.fetch({         
        Id: "12345678"
    }, function(err, hook, res){
        console.log('err', err);
        console.log('hook', hook);
        console.log('res', res.statusCode);
    })
```

update hook:

```js
    mango.hook.update({         
        Id: "12345678",
        Status: "DISABLED"
    }, function(err, hook, res){
        console.log('err', err);
        console.log('hook', hook);
        console.log('res', res.statusCode);
    })
```


### Test

`npm test`  
don't forget to provide credentials in `test/__credentials.json`

### Todos
 
 * oauth implementation
 * user methods only works for "Natural Users"
 * exhaustive api methods
 * ...
 
