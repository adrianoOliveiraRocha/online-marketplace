const User  = require('./User')()

class Client extends User{
  constructor(data, imageName) {
    super(data.email, data.password, imageName)
    this.address = data.address.replace(/'/g, '"')
    this.add_number = data.add_number
    this.phone = data.phone 
    this.name = data.name      
  }  

  createUser(connect, callback) {
    let stm = `insert into user (email, password, image, admin)
    values('${this.email}', '${this.password}', '${this.imageName}', ${this.admin})`
    connect.query(stm, callback)
  }

  createClient(userId, connect, callback) {
    let stm = `insert into client (name, address, add_number, phone, user_id)
    values('${this.name}', '${this.address}', ${this.add_number}, 
    '${this.phone}', ${userId})`
    
    connect.query(stm, callback)
  }

  static getThis(userId, connect, callback) {
    let stm = `select * from client where user_id = ${userId}`
    console.log(stm)
    connect.query(stm, callback)
  }

  static update(data, connect, callback) {
    let stm = `update client set name = '${data.name}',  
    address = '${data.address}', 
    add_number = ${data.addNumber}, phone = '${data.phone}'  
    where user_id = ${data.userId}`
    connect.query(stm, callback)
  }

  static verifyEmail(email, connect, callback) {
    let stm = `select id from user where email = '${email}'`
    connect.query(stm, callback)
  }

  static changePassword(id, password, connect, callback) {
    let stm = `update user set password = '${password}' where id = ${id}`
    connect.query(stm , callback)
  }
  
}

module.exports = () => {
  return Client
}