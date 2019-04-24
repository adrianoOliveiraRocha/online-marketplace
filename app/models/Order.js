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

  static getAll(application, user, callback) {
    // orders of this specific user
    let stm = `
    select * from _order
    where userId = ${user.id}`
    application.config.connect().query(stm, callback)
  }

  static getAllOrders(application, callback) {
    // Orders of all users
    let stm = `
    select 
    _order.id as orderId, _order.orderDate as date, _order.total as total,
    _order.status as status, user.id as userId, user.email as userEmail
    from _order, user
    where _order.userId = user.id
    `
    application.config.connect().query(stm, callback)
  }

  static getThis(orderId, application, callback) {
    let stm = `
    select * from _order
    where id = ${orderId}`
    application.config.connect().query(stm, callback)
  }
  
  static getPending(application, callback) {
    let stm = `select * from _order where status = 0`
    application.config.connect().query(stm, callback)
  }

  static getReceived(application, callback) {
    let stm = `select * from _order where status = 1`
    application.config.connect().query(stm, callback)
  }

}

module.exports = () => {
  return Order
}