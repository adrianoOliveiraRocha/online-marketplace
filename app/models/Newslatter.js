function Newslatter(email) {
  this.email = email
}

Newslatter.prototype.save = function (connect, callback) {
  let stm = `insert into newslatter(email) values('${this.email}')`
  connect.query(stm, callback)
}

module.exports = () => {
  return Newslatter
}