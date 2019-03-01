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
    var stm = `select * from user where email = '${data.email}' 
    and password = ${data.password}`;
    application.config.connect().query(stm, callback);
  }

  static update(user, data, application, callback) {
    var stm = `update user set email = '${data.email}', password='${data.password} 
    where id = ${user.id}`;
    application.config.connect().query(stm, callback);
  }

}

module.exports = () => {
  return User;
}