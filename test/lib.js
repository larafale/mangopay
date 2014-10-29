var assert = require('chai').assert
  , expect = require('chai').expect
  , Mango = require('../index')
  , Creds = require('./__credentials.json')
  , moment = require('moment')
  , mango = Mango({
      username: Creds.username,
      password: Creds.password
    })

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
        Name: "mycompany.com"
      , Email: "info@mycompany.com"
      , LegalPersonType: "BUSINESS"
      , LegalRepresentativeFirstName: "John"
      , LegalRepresentativeLastName: "Doe"
      , LegalRepresentativeEmail: "john_doe@mycompany.es"
      , HeadquartersAddress: "Canal Street, Madrid, Spain"
      , LegalRepresentativeAdress: "Canal Street, Madrid, Spain"
      , LegalRepresentativeBirthday: moment('300681', 'DDMMYY').unix()
      , LegalRepresentativeCountryOfResidence: "ES"
      , LegalRepresentativeNationality: "ES"

    }, function(err, legalUser, res) {
      mango.user.fetchLegal({Id: legalUser.Id}, function(err, body, res){
        console.log("Fetch legal User", body)
        done(err)
      })
    })

  })

  it('list users', function(done){
    mango.user.list(function(err, body, res){
      console.log(body)
      done(err)
    })
  })
  
})
