module.exports.new_product = (req, res, application) => {
  var msg = req.session.message;
  req.session.message = '';
  if (req.method == 'GET') {
    application.app.models.Category.getAll(application, 
      (err, result) => {
        if (err) {
          console.error(`Error trying get all categories: ${err.sqlMessage}`);
        } else {
          res.render('admin/product/new_product.ejs', {
            'user': req.session.user,
            'msg': msg,
            'allCategories': result
          });
        }        
      });    
  } else {
    var data = req.body;
    var imageName = null;
    if (Object.keys(req.files).length > 0) {// image sended
      const utilsProduct = require('./../utils/utilsProduct');
      var imageName = utilsProduct.uploadImage(req.files.image);
    }

    const Product = application.app.models.Product;
    var product = new Product(data, imageName);

    product.save(application, (err, result) => {
      if(err) {
        console.error(err.sqlMessage);
        res.send('Error trying save the product!');
      } else {
        console.log(`Saved with id ${result['insertId']}`);
        req.session.message = 'Novo Product salvo com sucesso!';
        res.redirect('\admin');
      }
    });

  }
}