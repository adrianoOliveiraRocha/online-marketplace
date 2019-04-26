class User {

  constructor(email, password, imageName, admin=0) {
    this.email = email
    this.password = password
    this.imageName = imageName
    this.admin = admin
  }

  save(connect, callback) {
    let stm = `insert into user (email, password, image, admin) 
    values('${this.email}', '${this.password}', '${this.imageName}', ${this.admin})`
    connect.query(stm, callback)
  }
 
  getEmail() {
    return this.email;
  }

  getPassword() {
    return this.password;
  }

  static verify(data, connect, callback) {
    var stm = `select * from user where email = '${data.email}' 
    and password = '${data.password}'`;
    
    connect.query(stm, callback);
  }

  static update(user, data, connect, imageName, callback) {
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
    connect.query(stm, callback);
  }

  static getThis(userId, connect, callback) {
    let stm = `select * from user where id = ${userId}`;
    connect.query(stm, callback);
  }

}

module.exports = () => {
  return User;
}