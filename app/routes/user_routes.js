const express = require('express')
// jsonwebtoken docs: https://github.com/auth0/node-jsonwebtoken
const crypto = require('crypto')
// Passport docs: http://www.passportjs.org/docs/
const passport = require('passport')
// bcrypt docs: https://github.com/kelektiv/node.bcrypt.js
const bcrypt = require('bcrypt')

// see above for explanation of "salting", 10 rounds is recommended
const bcryptSaltRounds = 10

const handle = require('../../lib/error_handler')
const BadParamsError = require('../../lib/custom_errors').BadParamsError

const User = require('../models/user')

// passing this as a second argument to `router.<verb>` will make it
// so that a token MUST be passed for that route to be available
// it will also set `res.user`
const requireToken = passport.authenticate('bearer', { session: false })

// instantiate a router (mini app that only handles routes)
const router = express.Router()

// SIGN UP
// POST /sign-up
router.post('/sign-up', (req, res) => {
  // generate a hash from the provided password
  // this returns a promise
  bcrypt.hash(req.body.credentials.password, bcryptSaltRounds)
    .then(hash => {
      // make sure that the user didn't sign up with empty string password
      // we have to do this inside the promise chain to be able to use the
      // error handler
      if (!req.body.credentials.password) {
        throw new BadParamsError()
      }

      // return necessary params to create a user
      return {
        email: req.body.credentials.email,
        hashedPassword: hash
      }
    })
    // create user with provided email and hashed password
    .then(user => User.create(user))
    // send the new user object back with status 201, but `hashedPassword`
    // won't be send because of the `transform` in the User model
    .then(user => res.status(201).json({ user: user.toObject() }))
    // pass any errors along to the error handler
    .catch(err => handle(err, res))
})

// SIGN IN
// POST /sign-in
router.post('/sign-in', (req, res) => {
  const pw = req.body.credentials.password

  // find a user based on the email that was passed
  User.findOne({ email: req.body.credentials.email })
    .then(user => {
      // if we didn't find a user with that email, send 422
      if (!user) {
        throw new BadParamsError()
      }
      // `bcrypt.compare` will return true if the result of hashing `pw`
      // is exactly equal to the hashed password stored in the DB
      return Promise.all([bcrypt.compare(pw, user.hashedPassword), user])
    })
    .then(data => {
      const user = data[1]
      const correctPassword = data[0]
      // if the passwords matched
      if (correctPassword) {
        // the token will be a 16 byte random hex string
        // NOTE: this is secure enough for our purposes, but don't use this
        // token generation method for your fintech startup
        const token = crypto.randomBytes(16).toString('hex')
        user.token = token
        // save the token to the DB as a property on user
        return user.save()
      } else {
        // throw an error to trigger the error handler and end the promise chain
        // this will send back 422 and a message about sending wrong parameters
        throw new BadParamsError()
      }
    })
    .then(user => {
      // return status 201, the email, and the new token
      res.status(201).json({ user: user.toObject() })
    })
    .catch(err => handle(err, res))
})

// CHANGE password
// PATCH /change-password
router.patch('/change-password', requireToken, (req, res) => {
  let user
  // `req.user` will be determined by decoding the token payload
  User.findById(req.user.id)
    .then(record => {
      user = record
      // return a hash of the new password
      return bcrypt.hash(req.body.passwords.new, bcryptSaltRounds)
    })
    .then(hash => {
      // set and save the new hashed password in the DB
      user.hashedPassword = hash
      return user.save()
    })
    // respond with no content and status 200
    .then(() => res.sendStatus(204))
    // pass any errors along to the error handler
    .catch(err => handle(err, res))
})

router.delete('/sign-out', requireToken, (req, res) => {
  req.user.token = crypto.randomBytes(16)
  req.user.save()
    .then(() => res.sendStatus(204))
    .catch(err => handle(err, res))
})

module.exports = router
