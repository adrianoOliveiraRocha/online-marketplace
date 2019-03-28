module.exports = (application) => {
  application.get('/nova_categoria', (req, res) => {
    application.app.control.category.new_category(req, res, application);
  });

  application.post('/nova_categoria', (req, res) => {
    application.app.control.category.new_category(req, res, application);
  });

  application.get('/exibir_categorias', (req, res) => {
    application.app.control.category.show_categories(req, res, application);
  });

  application.get('/detalhes_categoria', (req, res) => {
    application.app.control.category.category_details(req, res, application);
  });

  application.post('/editar_categoria', (req, res) => {
    application.app.control.category.edit_category(req, res, application);
  });

}