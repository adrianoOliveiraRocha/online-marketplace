module.exports = (application) => {

  application.get('/admin', (req, res) => {
    application.app.control.admin.index(req, res, application);
  });

  application.get('/logout', (req, res) => {
    application.app.control.admin.logout(req, res, application);
  });

  application.get('/profile', (req, res) => {
    application.app.control.admin.profile(req, res, application);
  });

  application.post('/profile', (req, res) => {
    application.app.control.admin.profile(req, res, application);
  }); 

}