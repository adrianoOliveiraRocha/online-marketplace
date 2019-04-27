class Order {

  constructor(userId, total, money) {
    this.userId = userId
    this.total = total
    this.money = money
  }

  save(connect, callback) {
    let stm = `
    insert into _order (userId, total, money)
    values(${this.userId}, ${this.total}, ${this.money})`
    
    connect.query(stm, callback)
  }

  static getAll(userId, connect, callback) {
    // orders of this specific user
    let stm = `
    select * from _order
    where userId = ${userId}`
    connect.query(stm, callback)
  }

  static orderDetails(orderId, connect, callback) {
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
    connect.query(stm, callback)
  }

  static getAllOrders(connect, callback) {
    // Orders of all users
    let stm = `select * from _order`
    connect.query(stm, callback)
  }

  static getAllPendingOrders(connect, callback) {
    // Pending orders of all users
    let stm = `select * from _order where status = 0`
    connect.query(stm, callback)
  }

  static getAllReceivedOrders(connect, callback) {
    // Received orders of all users
    let stm = `select * from _order where status = 1`
    connect.query(stm, callback)
  }

  static getThis(orderId, connect, callback) {
    let stm = `
    select * from _order
    where id = ${orderId}`
    connect.query(stm, callback)
  }
  
  static getPending(userId, connect, callback) {
    let stm = `
    select * from _order 
    where status = 0
     and userId = ${userId}`
    connect.query(stm, callback)
  }

  static getReceived(userId, connect, callback) {
    let stm = `
    select * from _order 
    where status = 1
     and userId = ${userId}`
    connect.query(stm, callback)
  }

}

module.exports = () => {
  return Order
}