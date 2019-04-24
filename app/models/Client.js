const User  = require('./User')()

class Client extends User{
  constructor(data, imageName) {
    super(data.email, data.password, imageName)
    this.address = data.address.replace(/'/g, '"')
    this.add_number = data.add_number
    this.phone = data.phone 
    this.name = data.name      
  }  

  createUser(application, callback) {
    let stm = `insert into user (email, password, image, admin)
    values('${this.email}', '${this.password}', '${this.imageName}', ${this.admin})`
    application.config.connect().query(stm, callback)
  }

  createClient(userId, application, callback) {
    let stm = `insert into client (name, address, add_number, phone, user_id)
    values('${this.name}', '${this.address}', ${this.add_number}, 
    '${this.phone}', ${userId})`
    
    application.config.connect().query(stm, callback)
  }

  static getThis(userId, application, callback) {
    let stm = `select * from client where user_id = ${userId}`
    application.config.connect().query(stm, callback)
  }

  static update(data, application, callback) {
    let stm = `update client set address = '${data.address}', 
    add_number = ${data.addNumber}, phone = '${data.phone}' 
    where user_id = ${data.userId}`
    application.config.connect().query(stm, callback)
  }
  
}

module.exports = () => {
  return Client
}