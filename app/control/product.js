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

module.exports.show_products = (req, res, application) => {
  application.app.models.Product.getAll(application, (err, result) => {
    if(err) {
      console.error(`Error trying get all products: ${err.sqlMessage}`);
    } else {
      res.render('admin/product/show_products.ejs', {
        'products': result,
        'user': req.session.user,
      });
    }
  });
}

module.exports.products_details = (req, res, application) => {
  var msg = req.session.message;
  req.session.message = '';

  application.app.models.Product.getThis(req.query.id, application, 
    (err, result) => {
      if (err) {
        console.error(`Error tryong get product: ${err.sqlMessage}`);
        res.send('Error tryong get product');
      } else {
        getAllCategories(result[0]);        
      }
  });

  function getAllCategories(product) {
    application.app.models.Category.getAll(application, (err, categories) => {
      if (err) {
        console.error(`Error: ${err.sqlMessage}`);
        res.send(`Error: ${err.sqlMessage}`);
      } else {
        res.render('admin/product/detail.ejs', {
          'product': product,
          'msg': msg,
          'user': req.session.user,
          'allCategories': categories
        });
      }
    });    
  }

}

module.exports.edit_product = (req, res, application) => {
  var data = req.body;
  var imageName = null;
  const Product = application.app.models.Product;

  if (Object.keys(req.files).length > 0) {// image sended
    const utilsProduct = require('./../utils/utilsProduct');
    utilsProduct.deleteOldeImage(Product, data.productId, application);      
    var imageName = utilsProduct.uploadImage(req.files.image);
  }

  Product.edit(data, imageName, application,  
    (err, result) => {
    if(err) {
      console.error(err.sqlMessage);      
      res.send(err.sqlMessage);
    } else {
      console.log(`inserted id: ${result[0].insertId}`);
      req.session.message = 'Post editado com sucesso!';
      res.redirect('\admin');
    }
  });
}