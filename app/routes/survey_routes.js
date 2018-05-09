const express = require('express')
const passport = require('passport')

const Survey = require('../models/survey')

const handle = require('../../lib/error_handler')

const customErrors = require('../../lib/custom_errors')

const handle404 = customErrors.handle404
const requireOwnership = customErrors.requireOwnership

const requireToken = passport.authenticate('bearer', { session: false })

const router = express.Router()

// INDEX
// GET /surveys
router.get('/surveys', requireToken, (req, res) => {
  Survey.find()
    .then(surveys => {
      return surveys.map(survey => survey.toObject())
    })
    .then(surveys => res.status(200).json({ surveys: surveys }))
    .catch(err => handle(err, res))
})

// SHOW
// GET /surveys/5a7db6c74d55bc51bdf39793
router.get('/surveys/:id', requireToken, (req, res) => {
  Survey.findById(req.params.id)
    .then(handle404)
    .then(survey => res.status(200).json({ survey: survey.toObject() }))
    .catch(err => handle(err, res))
})

// CREATE
// POST /surveys
router.post('/surveys', requireToken, (req, res) => {
  req.body.survey.owner = req.user.id

  Survey.create(req.body.survey)
    .then(survey => {
      res.status(201).json({ survey: survey.toObject() })
    })
    .catch(err => handle(err, res))
})

// UPDATE
// PATCH /surveys/5a7db6c74d55bc51bdf39793
router.patch('/surveys/:id', requireToken, (req, res) => {
  delete req.body.survey.owner

  Survey.findById(req.params.id)
    .then(handle404)
    .then(survey => {
      requireOwnership(req, survey)

      Object.keys(req.body.survey).forEach(key => {
        if (req.body.survey[key] === '') {
          delete req.body.survey[key]
        }
      })

      return survey.update(req.body.survey)
    })
    .then(() => res.sendStatus(204))
    .catch(err => handle(err, res))
})

// DESTROY
// DELETE /surveys/5a7db6c74d55bc51bdf39793
router.delete('/surveys/:id', requireToken, (req, res) => {
  Survey.findById(req.params.id)
    .then(handle404)
    .then(survey => {
      requireOwnership(req, survey)
      survey.remove()
    })
    .then(() => res.sendStatus(204))
    .catch(err => handle(err, res))
})

module.exports = router
