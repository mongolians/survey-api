const mongoose = require('mongoose')
const Survey = require('./survey')

const answerSchema = new mongoose.Schema({
  response: {
    type: String,
    required: true
  },
  survey: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Survey',
    required: true
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
})

module.exports = mongoose.model('Answer', answerSchema)
