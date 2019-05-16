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
    }

  }

})()

module.exports = Message