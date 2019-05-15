module.exports = function (application) {
  application.get('/verify_messages', (req, res) => {
    application.app.control.message.verifyMessage(req, res, application)
  })
}