module.exports.verifyMessage = (req, res, application) => {
  const Message = application.app.models.Message
  const connect = application.config.connect()

  Message.howUnreadMessages(connect, (error, result) => {
    if (error) {
      console.log(`Error trying access howUnreadMessages: ${error.selMessage}`)
    } else {
      res.render('admin/notification_unread_messages.ejs', {
        'quantity': result[0].unreadMessages
      })
    }
  })


}