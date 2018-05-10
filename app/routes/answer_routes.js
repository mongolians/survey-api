const express = require('express')
const passport = require('passport')

const Answer = require('../models/answer')

const handle = require('../../lib/error_handler')

const customErrors = require('../../lib/custom_errors')

const handle404 = customErrors.handle404
const requireOwnership = customErrors.requireOwnership

const requireToken = passport.authenticate('bearer', { session: false })
const mongoose = require('mongoose')
const router = express.Router()

// INDEX
// GET /answers
router.get('/answers', requireToken, (req, res) => {
  Answer.find()
    .then(answers => {
      return answers.map(answer => answer.toObject())
    })
    .then(answers => res.status(200).json({ answers: answers }))
    .catch(err => handle(err, res))
})

// SHOW
// GET /answers/5a7db6c74d55bc51bdf39793
router.get('/answers/:id', requireToken, (req, res) => {
  Answer.findById(req.params.id)
    .populate('survey')
    .then(handle404)
    .then(answer => res.status(200).json({ answer: answer.toObject() }))
    .catch(err => handle(err, res))
})

// CREATE
// POST /answers
router.post('/answers', requireToken, (req, res) => {
  req.body.answer.owner = req.user.id
  console.log(req.body.answer.survey)
  const survey_id = new mongoose.Types.ObjectId(req.body.answer.survey)
  req.body.answer.survey = survey_id
  console.log(req.body.answer)
  console.log(req.body.answer.survey)
  Answer.create(req.body.answer)
    .then(answer => answer.populate('survey'))
    .then(answer => {
      res.status(201).json({ answer: answer.toObject() })
    })
    .catch(err => handle(err, res))
})

// UPDATE
// PATCH /answers/5a7db6c74d55bc51bdf39793
router.patch('/answers/:id', requireToken, (req, res) => {
  // delete req.body.answer.owner
  console.log(req.body.answer)
  Answer.findById(req.params.id)
    // .populate('survey')
    .then(handle404)
    .then(answer => {
      requireOwnership(req, answer)

      Object.keys(req.body.answer).forEach(key => {
        if (req.body.answer[key] === '') {
          delete req.body.answer[key]
        }
      })

      return answer.update(req.body.answer)
    })
    // .then(answer => answer.populate('survey'))
    .then(() => res.sendStatus(204))
    .catch(err => handle(err, res))
})

// DESTROY
// DELETE /answers/5a7db6c74d55bc51bdf39793
router.delete('/answers/:id', requireToken, (req, res) => {
  Answer.findById(req.params.id)
    .then(handle404)
    .then(answer => {
      requireOwnership(req, answer)
      answer.remove()
    })
    .then(() => res.sendStatus(204))
    .catch(err => handle(err, res))
})

module.exports = router
