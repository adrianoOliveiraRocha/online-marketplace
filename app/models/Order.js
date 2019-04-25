class Order {

  constructor(userId, total, money) {
    this.userId = userId
    this.total = total
    this.money = money
  }

  save(application, callback) {
    let stm = `
    insert into _order (userId, total, money)
    values(${this.userId}, ${this.total}, ${this.money})`
    
    application.config.connect().query(stm, callback)
  }

  static getAll(userId, application, callback) {
    // orders of this specific user
    let stm = `
    select * from _order
    where userId = ${userId}`
    application.config.connect().query(stm, callback)
  }

  static orderDetails(orderId, application, callback) {
    // Orders of all users
    let stm = `
    select 
    _order.id as orderId, _order.orderDate as date, _order.total as total,
    _order.status as status, _order.money, user.id as userId, 
    user.email as userEmail, 
    client.address as address, client.add_number as number, 
    client.phone as phone, client.name as name
    from _order, user, client
    where _order.userId = user.id and
    user.id = client.user_id 
    and _order.id = ${orderId} 
    `
    application.config.connect().query(stm, callback)
  }

  static getAllOrders(application, callback) {
    // Orders of all users
    let stm = `select * from _order`
    application.config.connect().query(stm, callback)
  }

  static getAllPendingOrders(application, callback) {
    // Pending orders of all users
    let stm = `select * from _order where status = 0`
    application.config.connect().query(stm, callback)
  }

  static getAllReceivedOrders(application, callback) {
    // Received orders of all users
    let stm = `select * from _order where status = 1`
    application.config.connect().query(stm, callback)
  }

  static getThis(orderId, application, callback) {
    let stm = `
    select * from _order
    where id = ${orderId}`
    application.config.connect().query(stm, callback)
  }
  
  static getPending(userId, application, callback) {
    let stm = `
    select * from _order 
    where status = 0
     and userId = ${userId}`
    application.config.connect().query(stm, callback)
  }

  static getReceived(userId, application, callback) {
    let stm = `
    select * from _order 
    where status = 1
     and userId = ${userId}`
    application.config.connect().query(stm, callback)
  }

}

module.exports = () => {
  return Order
}