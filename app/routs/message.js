module.exports = function (application) {
  application.post('/send_message', (req, res) => {
    application.app.control.message.sendMessage(req, res, application)
  })

  application.get('/verify_messages', (req, res) => {
    application.app.control.message.verifyMessage(req, res, application)
  })

  application.get('/all_messages', (req, res) => {
    application.app.control.message.allMessages(req, res, application)
  })

  application.get('/readed_messages', (req, res) => {
    application.app.control.message.readedMessages(req, res, application)
  })

  application.get('/unreaded_messages', (req, res) => {
    application.app.control.message.unreadedMessages(req, res, application)
  })

  application.get('/message_detail', (req, res) => {
    application.app.control.message.messageDetail(req, res, application)
  })
}