module.exports = (application) => {

  application.get('/', (req, res) => {
    application.app.control.core.index(req, res, application);
  });

  application.get('/login', (req, res) => {
    application.app.control.core.register(req, res, application);
  });

}