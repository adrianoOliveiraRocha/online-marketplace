const Message = (function () {
  // private
  var name
  var email
  var subject
  var message
  // public
  return {

    setValues: function (data) {
      name = data.name
      email = data.email
      subject = data.subject
      message = data.message
    },

    save: function (connect, callback) {
      const stm = `
        insert into message (clientName, email, subject, message)
        values('${name}', '${email}', '${subject}', '${message}')
        `
      connect.query(stm, callback)
    },

    getUnreadedMessages: function(connect, callback) {
      let stm = 'select * from message where readed = 0'
      connect.query(stm, callback)
    },

    getAllMessages: function(connect, callback) {
      let stm = `select * from message`
      connect.query(stm, callback)
    },

    getReadedMessages: function (connect, callback) {
      let stm = `select * from message where readed = 1`
      connect.query(stm, callback)
    },

    getUnreadedMessages: function (connect, callback) {
      let stm = `select * from message where readed = 0`
      connect.query(stm, callback)
    },

    getThisMessage: function(messageId, connect, callback) {
      let stm = `select * from message where id = ${messageId}`
      connect.query(stm, callback)
    },

    markAsRead: function (messageId, connect, callback) {
      let stm = `
        update message set readed = 1
        where id = ${messageId}`
      connect.query(stm, callback)
    }

  }

})()

module.exports = Message