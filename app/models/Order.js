class Order {

  constructor(userId) {
    this.userId = userId
    this.date = this.getDate()
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
    insert into order (userId, date)
    values(${this.userId}, '${this.date}')`
    application.config.connect().query(stm, callback)
  }

}