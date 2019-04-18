class Item {

  constructor(dataItem) {
    this.productId = dataItem.id
    this.price = dataItem.price
    this.quantity = dataItem.quantity
    this.subtotal = dataItem.subtotal
  }

  static saveItems(allItems, orderId, application, callback) {

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

    application.config.connect().query(stm, callback)

  }    

}

module.exports = () => {
  return Item
}