// helpers
function saveProduct(req, res, application) {
  var data = req.body;
  var imageName = 'null';
  if (Object.keys(req.files).length > 0) {// image sended
    const helper = require('./../utils/helper');
    var imageName = helper.uploadImage(req.files.image);
  }

  const Product = application.app.models.Product;
  var product = new Product(data, imageName);

  product.save(application, (err, result) => {
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
    saveProduct(req, res, application);
  }
}

module.exports.show_products = (req, res, application) => {
  application.app.models.Product.getAll(application, (err, result) => {
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
  application.app.models.Product.getThis(req.query.idProduct, application, 
    (err, result) => {
      if (err) {
        console.error(`Error tryong get product: ${err.sqlMessage}`);
        req.session.error = `Error tryong get product: ${err.sqlMessage}`;
        res.redirect('\admin');
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
    helper.deleteOldeImage(Product, data.idProduct, application);      
    var imageName = helper.uploadImage(req.files.image);
  }

  Product.edit(data, imageName, application,  
    (err, result) => {
    if(err) {
      console.error(`Error trying edit the product: ${err.sqlMessage}`);  
      req.session.error = `Error trying edit the product: ${err.sqlMessage}`;
      res.redirect('\admin');
    } else {
      console.log(`Success ${result}`);
      req.session.message = 'Post editado com sucesso!';
      res.redirect('\admin');
    }
  });
}

module.exports.delete_product = (req, res, application) => {
  const idProduct = req.query.idProduct;
  const Product = application.app.models.Product;

  const helper = require('../utils/helper');
  helper.deleteOldeImage(Product, idProduct, application); 

  Product.delete(idProduct, application, (err, result) => {
    if(err) {
      console.error(`Error trying delete the product: ${err.sqlMessage}`);
      req.session.error = `Error trying delete the product: ${err.sqlMessage}`;
      res.redirect('\admin');
    } else {      
      console.log(result);
      req.session.message = 'Product deletado com sucesso!';
      res.redirect('\admin');
    }
  }); 
}