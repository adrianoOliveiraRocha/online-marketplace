module.exports = (application) => {

  application.get('/client_area', (req, res) => {
    application.app.control.client.client_area(req, res, application)
  })

  application.get('/client_profile', (req, res) => {
    application.app.control.client.client_profile(req, res, application)
  })

  application.post('/client_profile', (req, res) => {
    application.app.control.client.client_profile(req, res, application)
  }) 

  application.post('/comeback_site', (req, res) => {
    application.app.control.client.comeback_site(req, res)
  })

  application.post('/delete_item', (req, res) => {
    application.app.control.client.delete_item(req, res)
  })

  application.get('/cancel_cart', (req, res) => {
    application.app.control.client.cancel_cart(req, res)
  })

  application.post('/finalize', (req, res) => {
    application.app.control.client.finalize(req, res)
  })
  
}