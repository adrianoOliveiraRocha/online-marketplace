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

  application.get('/edit_logo', (req, res) => {
    application.app.control.admin.editLogo(req, res)
  })

  application.post('/save_logo', (req, res) => {
    application.app.control.admin.saveLogo(req, res)
  })

  application.get('/edit_why_our_products', (req, res) => {
    application.app.control.admin.editWhyOurProducts(req, res)
  })

  application.post('/save_why_our_products', (req, res) => {
    application.app.control.admin.saveWhyOurProducts(req, res, application)
  })

  application.get('/edit_social_nw', (req, res) => {
    application.app.control.admin.editSocialNW(req, res)
  })

  application.post('/save_social_nw', (req, res) => {
    application.app.control.admin.saveSocialNW(req, res)
  })

  application.get('/send_news_latter', (req, res) => {
    application.app.control.admin.sendNewsLatter(req, res)
  })

  application.post('/send_news_latter', (req, res) => {
    application.app.control.admin.sendNewsLatter(req, res, application)
  })

}
