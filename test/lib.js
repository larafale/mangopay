var assert = require('chai').assert
  , expect = require('chai').expect
  , Mango = require('../index')
  , Creds = require('./__credentials.json')
  , moment = require('moment')
  , mango = Mango({
      username: Creds.username,
      password: Creds.password
    })
  , fs = require('fs')

describe('Mango wrapper', function(){

  it('expect credentials', function(){

    expect(Mango.bind(null,{})).to.throw('Provide credentials')
  
  })

  it('use sandbox as default', function(){

    assert.equal(mango._api.host, 'api.sandbox.mangopay.com')
    assert.equal(mango._api.protocol, 'https')

  })

  it('create a user and his wallet', function(done){
    this.timeout(5000)

    mango.user.signup({ 
        Email: 'bob@flooz.me'
      , FirstName: 'Emmanuel'
      , LastName: 'Meunier'
      , Birthday: moment('190984', 'DDMMYY').unix()
    }, done)

  })
  
  it('create a legal user', function(done){
    this.timeout(5000)

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

    }, function(err, legalUser, res) {
      mango.user.fetchLegal({Id: legalUser.Id}, function(err, user, res){
        assert.equal(user.Name, 'mycompany.com')
        done(err)
      })
    })

  })

  // it('list users', function(done){
  //   mango.user.list(function(err, body, res){
  //     console.log(body)
  //     done(err)
  //   })
  // })

  it('create a document', function(done){
    this.timeout(5000)

    mango.user.list(function(err, users, res){
      user = users[0]
         
      fs.readFile('test/file.jpg', function(err, data){        
        var base64File = new Buffer(data, 'binary').toString('base64');

        mango.document.create({ 
            UserId: user.Id
          , Type: 'IDENTITY_PROOF'
          , File: base64File
        }, function(createdDoc) {

          mango.document.fetch({ 
              UserId: user.Id
            , Id: createdDoc.Id
          }, function(err, doc) {
            assert.equal(doc.Id, createdDoc.Id)
            done(err)
          })
        })
      })
    })  
  })

  it('update a document', function(done){
    this.timeout(5000)

    mango.user.list(function(err, users, res){
      user = users[0]
         
      fs.readFile('test/file.jpg', function(err, data){        
        var base64File = new Buffer(data, 'binary').toString('base64');

        mango.document.create({ 
            UserId: user.Id
          , Type: 'IDENTITY_PROOF'
          , File: base64File
        }, function(createdDoc) {

          mango.document.update({ 
              UserId: user.Id
            , Id: createdDoc.Id
            , Status: "VALIDATION_ASKED"
          }, function(err, doc) {
            assert.equal(doc.Status, "VALIDATION_ASKED")
            done(err)
          })
        })
      })
    })  
  })
})
