process.env.TESTENV = true

const mongoose = require('mongoose')
const User = require('../app/models/user')

const chai = require('chai')
const chaiHttp = require('chai-http')
const server = require('../server')
const should = chai.should()

chai.use(chaiHttp)

after(done => {
  User.remove({})
    .then(() => done())
    .catch(() => done())
})

const userParams = {
  credentials: {
    email: 'foo@bar.baz',
    password: '12345',
    password_confirmation: '12345'
  }
}

const updatedParams = {
  credentials: {
    email: 'foo@bar.baz',
    password: '54321'
  }
}

describe('Users', () => {
  describe('POST /sign-up', () => {
    beforeEach(done => {
      User.remove({})
        .then(() => done())
        .catch(() => done())
    })

    it('should create a user if params are valid', done => {
      chai.request(server)
        .post('/sign-up')
        .send(userParams)
        .end((e, res) => {
          res.should.have.status(201)
          res.should.be.a('object')
          res.body.should.have.property('user')
          res.body.user.should.have.property('email').eql(userParams.credentials.email)
          done()
        })
    })

    it('should reject users with duplicate emails', done => {
      const params = userParams
      params.credentials.hashedPassword = 'this is not very secure'

      User.create(userParams)
        .then(() => {
          chai.request(server)
            .post('/sign-up')
            .send(userParams)
            .end((e, res) => {
              res.should.have.status(422)
              res.should.be.a('object')
              res.body.should.have.property('errmsg')
              done()
            })
        })
        .catch(() => done())
    })
  })

  describe('POST /sign-in', () => {
    let token

    before(done => {
      chai.request(server)
        .post('/sign-up')
        .send(userParams)
        .end(() => done())
    })

    after(done => {
      User.remove({})
        .then(() => done())
        .catch(() => done())
    })

    it('should return a token when given valid credentials', done => {
      chai.request(server)
        .post('/sign-in')
        .send(userParams)
        .end((e, res) => {
          res.should.have.status(201)
          res.should.be.a('object')
          res.body.should.have.property('user')
          res.body.user.should.be.a('object')
          res.body.user.should.have.property('token')
          res.body.user.token.should.be.a('string')
          token = res.body.user.token
          done()
        })
    })

    it('the token should allow you to GET /examples', done => {
      chai.request(server)
        .get('/examples')
        .set('Authorization', `Bearer ${token}`)
        .end((e, res) => {
          res.should.have.status(200)
          res.body.should.have.property('examples')
          res.body.examples.should.be.a('array')
          done()
        })
    })
  })

  describe('PATCH /change-password', () => {
    let token

    const changePwParams = {
      passwords: {
        old: '12345',
        new: '54321'
      }
    }

    before(done => {
      chai.request(server)
        .post('/sign-up')
        .send(userParams)
        .end(() => done())
    })

    before(done => {
      chai.request(server)
        .post('/sign-in')
        .send(userParams)
        .end((e, res) => {
          token = res.body.user.token
          done()
        })
    })

    it('is successful', done => {
      chai.request(server)
        .patch('/change-password')
        .set('Authorization', `Bearer ${token}`)
        .send(changePwParams)
        .end((e, res) => {
          res.should.have.status(204)
          done()
        })
    })

    it('changes the password', done => {
      chai.request(server)
        .post('/sign-in')
        .send(updatedParams)
        .end((e, res) => {
          res.should.have.status(201)
          res.body.user.should.have.property('token')
          res.body.user.token.should.be.a('string')
          done()
        })
    })
  })

  describe('DELETE /sign-out', () => {
    let token

    before(done => {
      chai.request(server)
        .post('/sign-up')
        .send(updatedParams)
        .end(() => done())
    })

    before(done => {
      chai.request(server)
        .post('/sign-in')
        .send(updatedParams)
        .end((e, res) => {
          token = res.body.user.token
          done()
        })
    })

    it('returns 204', done => {
      chai.request(server)
        .delete('/sign-out')
        .set('Authorization', `Bearer ${token}`)
        .end((e, res) => {
          res.status.should.eql(204)
          done()
        })
    })
  })
})
