module.exports = function (err, res) {
  // HTTP RESPONSES

  // there are `ValidationError`s and `ValidatorErrors`, so use a regex
  // to catch them both
  if (err.name.match(/Valid/) || err.name === 'MongoError') {
    // if the error came from trying to create a user that already exists,
    // the error message will contain a bunch of data about that user.
    // That's a major vulnerability, so we need to send back a custom message
    const message = 'The receieved params failed a Mongoose validation'
    err = { status: 422, message }
  } else if (err.name === 'DocumentNotFound') {
    err.status = 404
  } else if (err.name === 'CastError' || err.name === 'BadParamsError') {
    err.status = 422
  }

  // if set a status code above, send that status code
  // otherwise, send 500. Also, send the error message as JSON.
  res.status(err.status || 500).json(err)

  // LOG ERRORS

  // don't log errors in a test environment
  process.env.TESTENV || console.error(err)
}
