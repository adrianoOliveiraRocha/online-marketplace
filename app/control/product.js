// helpers
function saveProduct(req, res, application) {
  
  var data = req.body;
  var imageName = 'null';
  if (Object.keys(req.files).length > 0) {// image sended
    const helper = require('./../utils/helper');
    var imageName = helper.uploadImage(req.files.image, 'product');
  }
  
  const Product = application.app.models.Product;
  var product = new Product(data, imageName);
  var connect = application.config.connect()
  product.save(connect, (err, result) => {
    connect.end()
    if(err) {
      console.error(err.sqlMessage);
      req.session.error = `Error trying save a new product: ${err.sqlMessage}`;
      res.redirect('\admin');
    } else {
      console.log(`Saved with id ${result['insertId']}`);
      req.session.message = 'Novo Product salvo com sucesso!';
      res.redirect('\admin');
    }
  });

}
// end helpers

module.exports.new_product = (req, res, application) => {
  var msg = req.session.message;
  req.session.message = '';
  
  if (req.method == 'GET') {
    var connect = application.config.connect()
    application.app.models.Category.getAll(connect, 
      (err, result) => {
        connect.end()
        if (err) {
          console.error(`Error trying get all categories: ${err.sqlMessage}`);
        } else {
          res.render('admin/product/new_product.ejs', {
            'user': req.session.user,
            'allCategories': result
          });
        }        
      });    
  } else {
    saveProduct(req, res, application);
  }
}

module.exports.show_products = (req, res, application) => {
  var connect = application.config.connect()
  application.app.models.Product.showProducts(connect, (err, result) => {
    connect.end()
    if(err) {
      console.error(`Error trying get all products: ${err.sqlMessage}`);
      req.session.error = `Error trying get all products: ${err.sqlMessage}`;
      req.redirect('\admin');
    } else {
      res.render('admin/product/show_products.ejs', {
        'products': result,
        'user': req.session.user,
      });
    }
  });
}

module.exports.products_details = (req, res, application) => {
  var connect = application.config.connect()
  application.app.models.Product.getThis(req.query.idProduct, connect, 
    (err, result) => {
      connect.end()
      if (err) {
        console.error(`Error tryong get product: ${err.sqlMessage}`);
        req.session.error = `Error tryong get product: ${err.sqlMessage}`;
        res.redirect('\admin');
      } else {
        getAllCategories(result[0]);        
      }
  });

  function getAllCategories(product) {
    var connect = application.config.connect()
    application.app.models.Category.getAll(connect, (err, categories) => {
      connect.end()
      if (err) {
        console.error(`Error: ${err.sqlMessage}`);
        req.session.error = `Error tryong get all categories: ${err.sqlMessage}`;
        res.redirect('\admin');
      } else {
        res.render('admin/product/product_details.ejs', {
          'product': product,
          'user': req.session.user,
          'allCategories': categories
        });
      }
    });    
  }

}

module.exports.edit_product = (req, res, application) => {
  
  var data = req.body;
  var imageName = 'null';
  const Product = application.app.models.Product;
    
  if (Object.keys(req.files).length > 0) {// image sended
    const helper = require('./../utils/helper');
    var connect = application.config.connect()
    helper.deleteOldeImage(Product, data.idProduct, 'product', connect);      
    var imageName = helper.uploadImage(req.files.image, 'product');
  }
  
  var connect = application.config.connect()
  Product.edit(data, imageName, connect,  
    (err, result) => {
    connect.end()
    if(err) {
      console.error(`Error trying edit the product: ${err.sqlMessage}`);  
      req.session.error = `Error trying edit the product: ${err.sqlMessage}`;
      res.redirect('\admin');
    } else {
      console.log(`Success ${result}`);
      req.session.message = 'Produto editado com sucesso!';
      res.redirect('\admin');
    }
  });

}

module.exports.delete_product = (req, res, application) => {
  const idProduct = req.query.idProduct;
  const Product = application.app.models.Product;

  const helper = require('../utils/helper');
  var connect = application.config.connect()
  helper.deleteOldeImage(Product, idProduct, 'product', connect); 

  var connect = application.config.connect()
  Product.delete(idProduct, connect, (err, result) => {
    connect.end()
    if(err) {
      console.error(`Error trying delete the product: ${err.sqlMessage}`);
      req.session.error = `Error trying delete the product: ${err.sqlMessage}`;
      res.redirect('\admin');
    } else {      
      console.log(result);
      req.session.message = 'Produto deletado com sucesso!';
      res.redirect('\admin');
    }
  }); 
}