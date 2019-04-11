module.exports = (application) => {

  application.get('/client_area', (req, res) => {
    application.app.control.client.client_area(req, res, application)
  })

  application.get('/client_profile', (req, res) => {
    application.app.control.client.client_profile(req, res, application)
  })
  
}