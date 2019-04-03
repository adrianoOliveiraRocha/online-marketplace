class User {

  constructor(email, password, imageName, admin=0) {
    this.email = email
    this.password = password
    this.imageName = imageName
    this.admin = admin
  }

  save(application, callback) {
    let stm = `insert into user (email, password, image, admin) 
    values('${this.email}', '${this.password}', '${this.imageName}', ${this.admin})`
    application.config.connect().query(stm, callback)
  }
 
  getEmail() {
    return this.email;
  }

  getPassword() {
    return this.password;
  }

  static verify(data, application, callback) {
    var stm = `select * from user where email = '${data.email}' 
    and password = '${data.password}'`;
    console.log(stm);
    application.config.connect().query(stm, callback);
  }

  static update(user, data, application, imageName, callback) {
    var stm = ``;
    if (imageName == null) {
      stm = `update user set email = '${data.email}', 
      password='${data.password}' 
      where id = ${user.id}`;
    } else {
      stm = `update user set email = '${data.email}', 
      password='${data.password}', 
      image='${imageName}' 
      where id = ${user.id}`;
    }    
    application.config.connect().query(stm, callback);
  }

  static getThis(userId, application, callback) {
    let stm = `select * from user where id = ${userId}`;
    application.config.connect().query(stm, callback);
  }

}

module.exports = () => {
  return User;
}