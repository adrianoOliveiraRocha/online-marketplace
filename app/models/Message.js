function Message(data) {
  console.log(data)
  this.name = data.name
  this.email = data.email
  this.subject = data.subject
  this.message = data.message.trim()
}

Message.prototype.save = function (connect, callback) {
  let stm = `
    insert into message (clientName, email, subject, message)
    values('${this.name}', '${this.email}',
    '${this.subject}', '${this.message}')
    `
  connect.query(stm, callback)
}


module.exports = () => {
  return Message
}