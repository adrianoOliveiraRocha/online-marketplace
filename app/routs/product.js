module.exports = (application) => {

  application.get('/novo_produto', (req, res) => {
    application.app.control.product.new_product(req, res, application);
  });

  application.post('/novo_produto', (req, res) => {
    application.app.control.product.new_product(req, res, application);
  }); 

  application.get('/exibir_produtos', (req, res) => {
    application.app.control.product.show_products(req, res, application);
  });

  application.get('/detalhes_produto', (req, res) => {
    application.app.control.product.products_details(req, res, application);
  });

  application.post('/edit_product', (req, res) => {
    application.app.control.product.edit_product(req, res, application);
  });

}