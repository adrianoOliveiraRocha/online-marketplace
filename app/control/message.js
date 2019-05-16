module.exports.verifyMessage = (req, res, application) => {

  const Message = application.app.models.Message
  const connect = application.config.connect()

  Message.getUnreadedMessages(connect, (error, result) => {
    if (error) {
      console.log(`Error trying access the messages: ${error.selMessage}`)
    } else {
      res.render('admin/notification_unread_messages.ejs', {
        'quantity': Object.keys(result).length,
        'messages': result,
        'fixDate': require('../utils/utilsOrder').fixDate,
        'fixHour': require('../utils/utilsOrder').fixHour
      })
    }
  })

}