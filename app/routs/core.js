module.exports = (application) => {

  application.get('/', (req, res) => {
    application.app.control.core.index(req, res, application)
  })

  application.get('/login', (req, res) => {
    application.app.control.core.login(req, res, application)
  })

  application.post('/login', (req, res) => {
    application.app.control.core.login(req, res, application)
  })

  application.get('/register', (req, res) => {
    application.app.control.core.register(req, res, application)
  })

  application.post('/register', (req, res) => {
    application.app.control.core.register(req, res, application)
  })

  application.get('/add_to_cart', (req, res) => {
    application.app.control.core.add_to_cart(req, res, application)
  })

  application.get('/access_cart', (req, res) => {
    application.app.control.core.access_cart(req, res)
  })

  application.get('/core_product_details', (req, res) => {
    application.app.control.core.productDetails(req, res, application)
  })

  application.get('/contact', (req, res) => {
    application.app.control.core.contact(req, res, application)
  })

  application.post('/newslatter', (req, res) => {
    application.app.control.core.newslatter(req, res, application)
  })

  application.get('/about_us', (req, res) => {
    application.app.control.core.aboutUs(req, res, application)
  })

  application.get('/remember_password', (req, res) => {
    application.app.control.core.rememberPassword(req, res, application)
  })

  application.post('/remember_password', (req, res) => {
    application.app.control.core.rememberPassword(req, res, application)
  })
 
}