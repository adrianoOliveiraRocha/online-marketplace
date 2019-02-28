module.exports = (application) => {

  application.get('/admin', (req, res) => {
    application.app.control.admin.index(req, res, application);
  });

}