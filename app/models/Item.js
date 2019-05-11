class Item {

  constructor(dataItem) {
    this.productId = dataItem.id
    this.price = dataItem.price
    this.quantity = dataItem.quantity
    this.subtotal = dataItem.subtotal
  }

  static saveItems(allItems, orderId, connect, callback) {

    function getFloat(strValue) {
      let response = strValue.replace('R$', '')
      response = response.replace(',', '.')
      return parseFloat(response)
    }

    let stm = `
    insert into item(productId, price, quantity, subtotal, orderId)
    values
    `
    allItems.forEach(item => {
      if ((allItems.indexOf(item) + 1 ) < Object.keys(allItems).length) {
        stm = stm + `
        (${item.id}, ${getFloat(item.price)}, ${item.quantity}, ${getFloat(item.subtotal)}, ${orderId}),
        `
      } else {
        stm = stm + `
        (${item.id}, ${getFloat(item.price)}, ${item.quantity}, ${getFloat(item.subtotal)}, ${orderId})`
      }
    })

    connect.query(stm, callback)

  }

  static getAll(orderId, connect, callback) {

    let stm = `
    select item.price as price, item.quantity as quantity,
    item.subtotal as subtotal, product.name as productName
    from item, product
    where item.productId = product.id
    and item.orderId = ${orderId}
    `
    connect.query(stm, callback)
  }

  static thisProductIsItem(productId, connect, callback) {
    let stm = `
    select count(id) as nItems
    from item
    where productId = ${productId}`
    connect.query(stm, callback)
  }

}

module.exports = () => {
  return Item
}