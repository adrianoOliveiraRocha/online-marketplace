class Product {

  constructor(data, image='null') {
    this.barcode = data.barcode
    this.name = data.name.replace(/'/g, '"')
    this.description = data.description.replace(/'/g, '"')
    this.category = data.category
    this.price = data.price
    this.image = image
    this.quantity = data.quantity
  }

  save(connect, callback) {// insert new product
    let stm = `insert into product (barcode, name, description, category, price, image, stock)
    values('${this.barcode}', '${this.name}', '${this.description.trim()}', ${this.category},
    ${this.price}, '${this.image}', ${this.quantity})`
    connect.query(stm, callback)
  }

  static getAll(connect, categoryId, callback) {
    var stm = ``
    if (categoryId === undefined) {
      stm = `
      select * from product
      where stock > 0`
    } else {
      stm = `
      select * from product where category = ${categoryId}
      and stock > 0`
    }
    connect.query(stm, callback)

  }

  static showProducts(connect, callback) {
    // This method get take all products to show in the admin
    var stm = `select * from product`
    connect.query(stm, callback)
  }

  static getThis(productId, connect, callback) {
    let stm = `select * from product where id = '${productId}'`
    connect.query(stm, callback)
  }

  static edit(data, imageName, connect, callback) {
    var stm = null
    var name = data.name.replace(/'/g, '"')
    var description = data.description.replace(/'/g, '"')

    if (imageName == null) {
      stm = `update product
      set name = '${name}',
      description = '${description.trim()}',
      category = ${data.category},
      price = ${data.price}
      where id = ${data.idProduct}`      
    } else {
      stm = `update product
      set name = '${name}',
      description = '${description.trim()}',
      category = ${data.category},
      price = ${data.price},
      image = '${imageName}'
      where id = ${data.idProduct}`
    }
    console.log(stm)
    connect.query(stm, callback)
  }

  static delete(productId, connect, callback) {
    const stm = `delete from product where id = ${productId}`
    console.log(stm)
    connect.query(stm, callback)
  }

  static getName(productId, connect, callback) {
    let stm = `
    select name from product
    where id = ${productId}`
    connect.query(stm, callback)
  }

  static updateStock(stm, connect, callback) {
    connect.query(stm, callback)
  }

  static getLowStockProducts(connect, callback) {
    let stm = `
    select id, name
    from product
    where stock < 10`
    connect.query(stm, callback)
  }

  static getLowStockProducts(connect, callback) {
    let stm = 'select * from product where stock < 10'
    connect.query(stm, callback)
  }

  static getForBarcode(barcode, connect, callback) {
    let stm = `select * from product where barcode = '${barcode}'`
    console.log(stm)
    connect.query(stm, callback)
  }

  static insertUnits(newStock, connect, productId, callback) {
    let stm = `
    update product set stock = ${newStock}
    where id = ${productId}`
    connect.query(stm, callback)
  }

}

module.exports = () => {
  return Product
}