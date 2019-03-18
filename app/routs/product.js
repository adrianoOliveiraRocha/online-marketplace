module.exports = (application) => {

  application.get('/novo_produto', (req, res) => {
    application.app.control.product.new_product(req, res, application);
  });

  application.post('/novo_produto', (req, res) => {
    application.app.control.product.new_product(req, res, application);
  }); 

}