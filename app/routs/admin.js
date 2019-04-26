module.exports = (application) => {

  application.get('/admin', (req, res) => {
    application.app.control.admin.index(req, res, application)
  })

  application.get('/logout', (req, res) => {
    application.app.control.admin.logout(req, res, application)
  })

  application.get('/profile', (req, res) => {
    application.app.control.admin.profile(req, res, application)
  })

  application.post('/profile', (req, res) => {
    application.app.control.admin.profile(req, res, application)
  }) 

  application.get('/admin_all_orders', (req, res) => {
    application.app.control.admin.all_orders(req, res, application)
  })

  application.get('/admin_pending_orders', (req, res) => {
    application.app.control.admin.pending_orders(req, res, application)
  })

  application.get('/admin_received_orders', (req, res) => {
    application.app.control.admin.received_orders(req, res, application)
  })

  application.get('/admin_order_details', (req, res) => {
    application.app.control.admin.orderDetails(req, res, application)
  })

  application.get('/notification_po', (req, res) => {
    application.app.control.admin.notificationPendingOrder(req, res, application)
  })

}