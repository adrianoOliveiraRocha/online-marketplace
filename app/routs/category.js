module.exports = (application) => {
  application.get('/nova_categoria', (req, res) => {
    application.app.control.category.new_category(req, res, application);
  });

  application.post('/nova_categoria', (req, res) => {
    application.app.control.category.new_category(req, res, application);
  });
}