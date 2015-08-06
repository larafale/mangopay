var assert = require('chai').assert
  , expect = require('chai').expect
  , moment = require('moment')
  , fs = require('fs')

var Creds = require('./__credentials.json')
  , utils = require('../lib/utils')
  , Mango = require('../index')
  , mango = Mango({
      username: Creds.username,
      password: Creds.password,
      debug: false
    })

describe('Mango wrapper', function(){

  it('expect credentials', function(){
    expect(Mango.bind(null,{})).to.throw('Provide credentials')
  })

  it('use sandbox as default', function(){
    assert.equal(mango._api.host, 'api.sandbox.mangopay.com')
    assert.equal(mango._api.protocol, 'https')
  })

})

describe('Utils', function(){

  it('stringifyRequestData', function(){
    assert.equal(utils.stringifyRequestData('a=b'), 'a=b')
    assert.equal(utils.stringifyRequestData({ a: 'b' }), 'a=b')
  })

})

describe('Natural User', function(){

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

    it('upload', function(done){
      this.timeout(10000)

      mango.document.create({ 
          UserId: Users.batman.Id
        , Type: 'IDENTITY_PROOF'
        , File: fs.readFileSync('test/file.jpg', 'base64')

      }, function(createdDoc) {

        Document = createdDoc

        assert.equal(Document.Status, 'CREATED')
        done()
      })
    
    })

    it('fetch', function(done){
      this.timeout(10000)

      mango.document.fetch({ 
          UserId: Users.batman.Id
        , Id: Document.Id
      }, function(err, doc) {
        assert.equal(doc.Id, Document.Id)
        assert.equal(doc.Status, 'CREATED')
        done(err)
      })
    
    })

    it('update', function(done){
      this.timeout(5000)

      mango.document.update({ 
          UserId: Users.batman.Id
        , Id: Document.Id
        , Status: 'VALIDATION_ASKED'
      }, function(err, doc) {
        assert.equal(doc.Status, 'VALIDATION_ASKED')
        done(err)
      })

    })
  
  })

  
  describe('Cards', function(){

    it('init Registration', function(done){

      mango.card.initRegistration({ 
          UserId: Users.batman.Id
        , Currency: "EUR"
      }, function(err, cardRegistration) {
        expect(cardRegistration.AccessKey).not.to.be.null
        done(err)
      })

    })

    it('create', function(done){
      this.timeout(10000)

      mango.card.create({ 
        UserId: Users.batman.Id,
        CardNumber: '4970100000000154',
        CardExpirationDate: '0216',
        CardCvx: '123',
      }, function(err, card){
        expect(card).to.have.property('CardId')
        assert.equal(card.Status, 'VALIDATED')
        done(err)
      })

    })

  })

})


describe('Legal User', function(){

  var Users = {}
    , Wallets = {}

  it('create', function(done){

    mango.user.createLegal({ 
        Name: 'mycompany.com'
      , Email: 'info@mycompany.com'
      , LegalPersonType: 'BUSINESS'
      , LegalRepresentativeFirstName: 'John'
      , LegalRepresentativeLastName: 'Doe'
      , LegalRepresentativeEmail: 'john_doe@mycompany.es'
      , HeadquartersAddress: 'Canal Street, Madrid, Spain'
      , LegalRepresentativeAdress: 'Canal Street, Madrid, Spain'
      , LegalRepresentativeBirthday: moment('300681', 'DDMMYY').unix()
      , LegalRepresentativeCountryOfResidence: 'ES'
      , LegalRepresentativeNationality: 'ES'

    }, function(err, user){

      Users.john = user

      assert.equal(user.Name, 'mycompany.com')
      done(err)
    })

  })

})






  

