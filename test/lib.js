var assert = require('chai').assert
  , expect = require('chai').expect
  , faker = require('faker')
  , moment = require('moment')
  , fs = require('fs')

var Creds = require('./__credentials.json')
  , utils = require('../lib/utils')
  , Mango = require('../index')
  , mango = Mango({
        username: Creds.username
      , password: Creds.password
      , version: 'v2.01'
      , debug: false
    })

var debug = function(args, index){
  if(index !== undefined) console.log(args[index])
  if(args[0]) console.log(args[0])
}


var savedcard = null;



describe('Mango wrapper', function(){

  it('expect credentials', function(){
    expect(Mango.bind(null,{})).to.throw('Provide credentials')
  })

  it('api version', function(){
    assert.equal(mango._api.version, 'v2.01')
  })

  it('use sandbox as default', function(){
    assert.equal(mango._api.host, 'api.sandbox.mangopay.com')
  })

})



describe('Utils', function(){

  it('stringifyRequestData', function(){
    assert.equal(utils.stringifyRequestData('a=b'), 'a=b')
    assert.equal(utils.stringifyRequestData({ a: 'b' }), 'a=b')
  })

})

describe('HttpMethod', function(){
  it('should call callback with error when parameter is missing', function(done){
    mango.user.signup({
      Email: faker.internet.email()
    }, function(err) {
      expect(err).to.be.ok;
      expect(err.message).to.equal('parameter "FirstName" is required');
      done();
    })
  })
})



describe('Natural User', function(){
  // Signup is a combo of user.create + wallet.create
  it('does not fail with birthay with unix timestamp 0', function(done){
    this.timeout(10000)
    mango.user.signup({
      Email: faker.internet.email()
      , FirstName: faker.name.firstName()
      , LastName: faker.name.lastName()
      , Birthday: 0
    }, function(err, user, wallet){
      debug(arguments)

      expect(user).to.have.property('Id')
      expect(wallet).to.have.property('Id')

      done(err)
    })
  })

  var Users = {}
    , Wallets = {}

  // Signup is a combo of user.create + wallet.create
  it('signup', function(done){
    this.timeout(10000)

    mango.user.signup({
        Email: 'batman@domain.tld'
      , FirstName: 'Bruce'
      , LastName: 'Wayne'
      , Birthday: moment('190984', 'DDMMYY').unix()
    }, function(err, user, wallet){
      debug(arguments)

      Users.batman = user
      Wallets.batman = wallet

      expect(user).to.have.property('Id')
      expect(wallet).to.have.property('Id')
      assert.equal(user.Email, 'batman@domain.tld')
      assert.equal(user.Id, wallet.Owners[0])

      done(err)
    })

  })

  describe('Documents', function(){

    var Document

    it('create', function(done){
      this.timeout(10000)

      mango.document.create({
          UserId: Users.batman.Id
        , Type: 'ADDRESS_PROOF'
        , File: fs.readFileSync('test/file.jpg', 'base64')
      }, function(err, doc){
        debug(arguments)
        assert.equal(doc.Status, 'CREATED')
        done()
      })

    })

    it('createWithFile', function(done){
      this.timeout(10000)

      mango.document.create({
          UserId: Users.batman.Id
        , Type: 'IDENTITY_PROOF'
        , File: fs.readFileSync('test/file.jpg', 'base64')
      }, function(err, doc){
        debug(arguments)

        Document = doc

        assert.equal(Document.Status, 'CREATED')
        done()
      })

    })

    it('addFile', function(done){
      this.timeout(10000)

      mango.document.addFile({
          UserId: Users.batman.Id
        , DocumentId: Document.Id
        , File: fs.readFileSync('test/file.jpg', 'base64')
      }, function(err, noContent, res){
        debug(arguments)

        // adding a page to document return a 204 No Content
        assert.equal(res.statusCode, 204)
        done()
      })

    })

    it('fetch', function(done){
      this.timeout(10000)

      mango.document.fetch({
          UserId: Users.batman.Id
        , Id: Document.Id
      }, function(err, doc){
        debug(arguments)
        assert.equal(doc.Id, Document.Id)
        assert.equal(doc.Status, 'CREATED')
        assert.equal(doc.Type, 'IDENTITY_PROOF')
        done(err)
      })

    })

    it('update', function(done){
      this.timeout(5000)

      mango.document.update({
          UserId: Users.batman.Id
        , Id: Document.Id
        , Status: 'VALIDATION_ASKED'
      }, function(err, doc){
        debug(arguments)
        assert.equal(doc.Status, 'VALIDATION_ASKED')
        done(err)
      })

    })

  })



  describe('Cards', function(){

    it('initRegistration', function(done){
      this.timeout(10000)

      mango.card.initRegistration({
          UserId: Users.batman.Id
        , Currency: "EUR"
      }, function(err, cardRegistration){
        debug(arguments)
        expect(cardRegistration.AccessKey).not.to.be.null
        done(err)
      })

    })

    it('create', function(done){
      this.timeout(10000)

      mango.card.create({
        UserId: Users.batman.Id,
        CardNumber: '4970100000000154',
        CardExpirationDate: '0220',
        CardCvx: '123',
      }, function(err, card){
        debug(arguments)
        savedcard=card
        expect(card).to.have.property('CardId')
        assert.equal(card.Status, 'VALIDATED')
        done(err)
      })

    })

    it('preAuthorization', function(done){
      this.timeout(10000)
      mango.card.preAuthorization({
        AuthorId: Users.batman.Id,
        DebitedFunds: { Amount: 100, Currency:"EUR" },
        CardId:savedcard.CardId,
        SecureModeReturnURL:"https://example.com/SecureModeReturnURL"
      }, function(err, cardAuth){
        debug(arguments)
        expect(cardAuth).to.have.property('CardId')
        assert.equal(cardAuth.Status, 'SUCCEEDED')
        done(err)
      })

    })

  })

})





describe('Legal User', function(){

  var Users = {}
    , Wallets = {}

  it('create', function(done){
    this.timeout(10000)

    mango.user.createLegal({
        Name: 'mycompany.com'
      , Email: 'info@mycompany.com'
      , LegalPersonType: 'BUSINESS'
      , LegalRepresentativeFirstName: 'John'
      , LegalRepresentativeLastName: 'Doe'
      , LegalRepresentativeEmail: 'john_doe@mycompany.es'
      , LegalRepresentativeAdress: 'Canal Street, Madrid, Spain'
      , LegalRepresentativeBirthday: moment('300681', 'DDMMYY').unix()
      , LegalRepresentativeCountryOfResidence: 'ES'
      , LegalRepresentativeNationality: 'ES'

      // implent test for v2.01 https://docs.mangopay.com/api-v2-01-overview/
      // handle new address
      // , HeadquartersAddress: 'Canal Street, Madrid, Spain'

    }, function(err, user, res){
      debug(arguments)

      Users.john = user

      assert.equal(user.Name, 'mycompany.com')
      done(err)
    })

  })

})
