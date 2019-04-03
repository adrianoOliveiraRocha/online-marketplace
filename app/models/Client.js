const User  = require('./User')()

class Client extends User{
  constructor(data, imageName) {
    super(data.email, data.password, imageName);
    this.address = data.address.replace(/'/g, '"')
    this.add_number = data.add_number
    this.fone = data.fone       
  }  

  createUser(application, callback) {
    let stm = `insert into user (email, password, image, admin)
    values('${this.email}', '${this.password}', '${this.imageName}', ${this.admin})`
    application.config.connect().query(stm, callback);
  }

  createClient(userId, application, callback) {
    let stm = `insert into client (address, add_number, fone, user_id)
    values('${this.address}', ${this.add_number}, '${this.fone}', ${userId})`
    application.config.connect().query(stm, callback);
  }
  
}

module.exports = () => {
  return Client
}