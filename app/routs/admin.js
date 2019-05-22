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

  application.get('/fulfill_order', (req, res) => {
    application.app.control.admin.fulfillOrder(req, res)
  })

  application.get('/done', (req, res) => {
    application.app.control.admin.done(req, res, application)
  })

  application.get('/edit_about_us', (req, res) => {
    application.app.control.admin.editAboutUs(req, res, application)
  })

  application.post('/save_about_us', (req, res) => {
    application.app.control.admin.saveAboutUs(req, res, application)
  })


}
