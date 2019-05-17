module.exports.sendMessage = (req, res, application) => {

  const Message = application.app.models.Message
  const connect = application.config.connect()
  Message.setValues(req.body)

  Message.save(connect, (error, result) => {
    connect.end()
    if (error) {
      console.error(`Error trying save the message: ${error.sqlMessage}`)
      req.session.error = `Error trying save the message: ${error.sqlMessage}`
      res.redirect('/contact')
    } else {
      console.log(result)
      req.session.message = 'Mensagem enviada com sucesso!'
      res.redirect('/contact')
    }
  })

}

module.exports.verifyMessage = (req, res, application) => {
  const Message = application.app.models.Message
  const connect = application.config.connect()

  Message.getUnreadedMessages(connect, (error, result) => {
    connect.end()
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

module.exports.allMessages = (req, res, application) => {
  const Message = application.app.models.Message
  const connect = application.config.connect()

  Message.getAllMessages(connect, (error, result) => {
    connect.end()
    if (error) {
      console.error('Error trying get all messages: ${error.sqlMessage}')
      req.session.error = 'Não foi possível recuperar as mensagens'
      res.redirect('\admin')
    } else {
      res.render('admin/message/all_messages.ejs', {
        'user': req.session.user,
        'messages': result
      })
    }
  })

}

module.exports.readedMessages = (req, res, application) => {
  const Message = application.app.models.Message
  const connect = application.config.connect()

  Message.getReadedMessages(connect, (error, result) => {
    connect.end()
    if (error) {
      console.error('Error trying get all readed messages: ${error.sqlMessage}')
      req.session.error = 'Não foi possível recuperar as mensagens lidas'
      res.redirect('\admin')
    } else {
      res.render('admin/message/readed_messages.ejs', {
        'user': req.session.user,
        'messages': result
      })
    }
  })

}

module.exports.unreadedMessages = (req, res, application) => {
  const Message = application.app.models.Message
  const connect = application.config.connect()

  Message.getUnreadedMessages(connect, (error, result) => {
    connect.end()
    if (error) {
      console.error('Error trying get all unreaded messages: ${error.sqlMessage}')
      req.session.error = 'Não foi possível recuperar as mensagens não lidas'
      res.redirect('\admin')
    } else {
      res.render('admin/message/unreaded_messages.ejs', {
        'user': req.session.user,
        'messages': result
      })
    }
  })

}

module.exports.messageDetail = (req, res, application) => {
  const messageId = req.query.messageId
  const Message = application.app.models.Message
  const connect = application.config.connect()

  const showMessage = new Promise((resolve, reject) => {
    Message.getThisMessage(messageId, connect, (error, result) => {
      if (error) {
        reject(error)
      } else {
        resolve(result[0])
      }
    })
  })

  const markAsRead = new Promise((resolve, reject) => {
    Message.markAsRead(messageId, connect, (error, result) => {
      if (error) {
        reject(error)
      } else {
        resolve(result)
      }
    })
  })

  Promise.all([showMessage, markAsRead])
  .then(([message, marked]) => {
    console.log(marked)
    res.render('admin/message/message_detail.ejs', {
      'user': req.session.user,
      'fixDate': require('../utils/utilsOrder').fixDate,
      'fixHour': require('../utils/utilsOrder').fixHour,
      'message': message
    })
  }).catch((error) => {
    console.error(`Error trying get this messages: ${error.sqlMessage}`)
    req.session.error = 'Não foi possível recuperar essa mensagem'
    res.redirect('\admin')
  }).then(() => {
    connect.end()
    console.log('connection closed')
  })

}