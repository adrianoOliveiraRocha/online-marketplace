module.exports = (application) => {
  application.get('/client_area', (req, res) => {
    application.app.control.client.client_area(req, res, application)
  })
}