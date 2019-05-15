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

    howUnreadMessages: function(connect, callback) {
      let stm = 'select count(email) as unreadMessages from message'
      connect.query(stm, callback)
    }

  }

})()

module.exports = Message