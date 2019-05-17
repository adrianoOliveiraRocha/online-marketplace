const Newslatter = (function() {
  var email
  return {
    setEmail: function(test) {
      console.log(test)
      email = test
    },
    save: function(connect, callback) {
      let stm = `insert into newslatter (email) values('${email}')`
      connect.query(stm, callback)
    },

    test: function() {
      return email
    }
  }
})()

module.exports = Newslatter