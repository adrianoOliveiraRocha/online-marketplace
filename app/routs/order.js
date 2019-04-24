module.exports = (application) => {

  application.get('/pedidos', (req, res) => {
    application.app.control.order.all_orders(req, res, application)
  })
  
  application.get('/order_details', (req, res) => {
    application.app.control.order.order_details(req, res, application)
  })

  application.get('/pending_orders', (req, res) => {
    application.app.control.order.pending_orders(req, res, application)
  })

  application.get('/received_orders', (req, res) => {
    application.app.control.order.received_orders(req, res, application)
  })

}