class Order {

  constructor(userId, total, status=0) {
    this.userId = userId
    this.date = this.getDate()
    this.total = total
    this.status = status
  }

  getDate() {
    let today = new Date()
    var dd = today.getDate()
    var mm = today.getMonth() + 1
    var yyyy = today.getFullYear()
    return `${yyyy}-${mm}-${dd}`
  }

  save(application, callback) {
    let stm = `
    insert into _order (userId, orderDate, total)
    values(${this.userId}, '${this.date}', ${this.total})`
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
    _order.status as status, user.id as userId, user.email as userEmail, 
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
    where status = 0
     and userId = ${userId}`
    application.config.connect().query(stm, callback)
  }

}

module.exports = () => {
  return Order
}