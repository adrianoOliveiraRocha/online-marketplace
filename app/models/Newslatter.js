function Newslatter(email = null) {
  this.email = email
}

Newslatter.prototype.save = function (connect, callback) {
  let stm = `insert into newslatter(email) values('${this.email}')`
  connect.query(stm, callback)
}

Newslatter.prototype.getEmails = function(connect, callback) {
  let stm = `select email from newslatter`
  connect.query(stm, callback)
}

module.exports = () => {
  return Newslatter
}