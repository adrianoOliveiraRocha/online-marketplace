module.exports = (application) => {

  application.get('/insert_product', (req, res) => {
    application.app.control.product.insertProduct(req, res, application)
  })

  application.post('/insert_product', (req, res) => {
    application.app.control.product.insertProduct(req, res, application)
  })

  application.post('/new_product', (req, res) => {
    application.app.control.product.newProduct(req, res, application)
  }) 

  application.get('/exibir_produtos', (req, res) => {
    application.app.control.product.show_products(req, res, application)
  })

  application.get('/detalhes_produto', (req, res) => {
    application.app.control.product.products_details(req, res, application)
  })

  application.post('/editar_produto', (req, res) => {
    application.app.control.product.edit_product(req, res, application)
  })

  application.get('/delete_product', (req, res) => {
    application.app.control.product.delete_product(req, res, application)
  })  

  application.get('/notification_low_stock', (req, res) => {
    application.app.control.product.lowStockNotification(req, res, application)
  })

  application.get('/low_stock', (req, res) => {
    application.app.control.product.lowStock(req, res, application)
  })

}