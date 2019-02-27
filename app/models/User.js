class User {

  constructor(email=null, password=null) {
    this.email = email;
    this.password = password;
  }

  getEmail() {
    return this.email;
  }

  getPassword() {
    return this.password;
  }

  static verify(data, application, callback) {
    var stm = `select count(*) from user where email = '${data.email}' 
    and password = ${data.password}`;
    console.log(stm)
    application.config.connect().query(stm, callback);
  }

}

module.exports = () => {
  return User;
}