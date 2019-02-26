module.exports = (application) => {

  application.get('/', (req, res) => {
    application.app.control.core.index(req, res, application);
  });

}