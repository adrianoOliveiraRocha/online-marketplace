module.exports = (application) => {

  application.get('/', (req, res) => {
    application.app.control.core.index(req, res, application);
  });

  application.get('/login', (req, res) => {
    application.app.control.core.login(req, res, application);
  });

  application.post('/login', (req, res) => {
    application.app.control.core.login(req, res, application);
  });

  application.get('/register', (req, res) => {
    application.app.control.core.register(req, res, application);
  });

  application.post('/register', (req, res) => {
    application.app.control.core.register(req, res, application);
  });

}