class Order {

  constructor(userId, total) {
    this.userId = userId
    this.date = this.getDate()
    this.total = total
  }

  getDate() {
    let today = new Date()
    var dd = today.getDay()
    var mm = today.getMonth()
    var yyyy = today.getFullYear()
    return `${yyyy}-${mm}-${dd}`
  }

  save(application, callback) {
    let stm = `
    insert into _order (userId, orderDate, total)
    values(${this.userId}, '${this.date}', ${this.total})`
    application.config.connect().query(stm, callback)
  }

}

module.exports = () => {
  return Order
}