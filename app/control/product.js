module.exports.insertProduct = (req, res, application) => {
  if(req.method == 'GET') {
    res.render('admin/product/insert_product.ejs', {
      'user': req.session.user
    })
  } else {// post
    const barcode = req.body.barcode
    const Product = application.app.models.Product
    const Category = application.app.models.Category
    var connect = application.config.connect()

    function getForBarcode() {

      return new Promise((resolve, reject) => {
        Product.getForBarcode(barcode, connect, (errorProduct, resultProduct) => {
          if (errorProduct) {
            reject(errorProduct.sqlMessage)
          } else {
            resolve({
              'product': resultProduct,
              'barcode': barcode
            })
          }
        })
      })

    }

    getForBarcode()
    .then(response => {

      return new Promise((resolve, reject) => {
        Category.getAll(connect, (errorCategory, resultCategory) => {
          if (errorCategory) {
            reject(`Error trying get categories: ${error.sqlMessage}`)
          } else {
            response.categories = resultCategory
            resolve(response)
          }
        })
      })

    })
    .then(response => {

      if (Object.keys(response.product).length == 0) {
        res.render('admin/product/new_product.ejs', {
          'user': req.session.user,
          'allCategories': response.categories,
          'barcode': response.barcode
        })
      } else {
        res.render('admin/product/new_product_units.ejs', {
          'user': req.session.user,
          'allCategories': response.categories,
          'product': response.product[0],
          'barcode': response.barcode
        })
        // res.send(response.product)
      }

    }).catch(error => {
      console.log(error)
      req.session.error = `Error: ${error}`
      res.redirect('\admin')
    }).then(() => {
      connect.end()
    })

  }
}

module.exports.insertUnits = function(req, res, application) {
  const newStock = parseInt(req.body.stock) + parseInt(req.body.units)
  const productId = req.body.productId
  const Product = application.app.models.Product
  const connect = application.config.connect()
  Product.insertUnits(newStock, connect, productId, (error, result) => {
    connect.end()
    if (error) {
      console.error(`Error trying update stock: ${error.sqlMessage}`)
      req.session.error = `Error trying update stock: ${error.sqlMessage}`
      res.redirect('\admin')
    } else {
      console.log(result)
      req.session.message = 'Estoque atualizado com sucesso!'
      res.redirect('\admin')
    }
  })

}

module.exports.newProduct = (req, res, application) => {

  var data = req.body
  var imageName = 'null'
  console.log(req.files !== null)
  if (req.files !== null) { // image sended
    const helper = require('./../utils/helper')
    var imageName = helper.uploadImage(req.files.image, 'product')
  }

  const Product = application.app.models.Product
  var product = new Product(data, imageName)
  var connect = application.config.connect()
  product.save(connect, (err, result) => {
    connect.end()
    if(err) {
      console.error(err.sqlMessage)
      req.session.error = `Error trying save a new product: ${err.sqlMessage}`
      res.redirect('\admin')
    } else {
      console.log(`Saved with id ${result['insertId']}`)
      req.session.message = 'Novo Product salvo com sucesso!'
      res.redirect('\admin')
    }
  })
}

module.exports.show_products = (req, res, application) => {
  var connect = application.config.connect()
  application.app.models.Product.showProducts(connect, (err, result) => {
    connect.end()
    if(err) {
      console.error(`Error trying get all products: ${err.sqlMessage}`)
      req.session.error = `Error trying get all products: ${err.sqlMessage}`
      req.redirect('\admin')
    } else {
      res.render('admin/product/show_products.ejs', {
        'products': result,
        'user': req.session.user,
      })
    }
  })
}

module.exports.products_details = (req, res, application) => {
  var connect = application.config.connect()
  application.app.models.Product.getThis(req.query.idProduct, connect,
    (err, result) => {
      connect.end()
      if (err) {
        console.error(`Error tryong get product: ${err.sqlMessage}`)
        req.session.error = `Error tryong get product: ${err.sqlMessage}`
        res.redirect('\admin')
      } else {
        getAllCategories(result[0])
      }
  })

  function getAllCategories(product) {
    var connect = application.config.connect()
    application.app.models.Category.getAll(connect, (err, categories) => {
      connect.end()
      if (err) {
        console.error(`Error: ${err.sqlMessage}`)
        req.session.error = `Error tryong get all categories: ${err.sqlMessage}`
        res.redirect('\admin')
      } else {
        res.render('admin/product/product_details.ejs', {
          'product': product,
          'user': req.session.user,
          'allCategories': categories
        })
      }
    })
  }

}













module.exports.editProduct = (req, res, application) => {
  var imageName = null
  if(req.files == null) { // no image
    updateDatabase()
  } else { // image sended
    const data = req.body
    const productId = data.idProduct
    const connect = application.config.connect()
    const Product = application.app.models.Product

    Product.getThis(productId, connect, (errorProduct, result) => {
      if (errorProduct) {
        res.send(errorProduct)
      } else {
        var oldImageName = result[0].image
        if (oldImageName) {
          let oldFile = __dirname + `/../public/upload/public/${result[0].image}`;
          const fs = require('fs');
          fs.unlink(oldFile, (errOldFile) => {
            if (errOldFile) {
              res.send(`Error tentando deletar imagem antiga: ${errOldFile}`);
            } else {
              res.send('Image deleted with success!');
            }
          })
        } else {
          res.send('sem imagem')
        }
      }
    })
    
  }


  function updateDatabase() {
    var data = req.body
    const connect = application.config.connect()
    const Product = application.app.models.Product
    Product.edit(data, imageName, connect, (error, result) => {
      if (error) {
        console.error(error)
        req.session.error = `Error tentando atudalizar o banco de dados: ${error}`
        res.redirect('/admin')
      } else {
        console.log(result)
        req.session.message = `Produto atualizado com sucesso!`
        res.redirect('/admin')
      }
    })
  }

}










module.exports.deleteProduct = (req, res, application) => {
  const productId = req.query.idProduct
  const imageName = req.query.imageName
  const Product = application.app.models.Product
  var connect = application.config.connect()

  function deleteProduct() {

    return new Promise((resolve, reject) => {
      Product.delete(productId, connect, (err, result) => {
        connect.end()
        if (err) {
          reject(err)
        } else {
          // delete old image
          const helper = require('./../utils/helper')
          helper.deleteProductImage(imageName)
          resolve(result)
        }
      })
    })

  }

  deleteProduct().then(result => {
    console.log(result)
    req.session.message = 'Produto deletado com sucesso!'
    res.redirect('\admin')
  }).catch(error => {
    console.error(`Error trying delete the product: ${error.sqlMessage}`)
    req.session.error = `
      Você não pode deletar esse produto
      porque ele é ítem de pelo menos um pedido`
    res.redirect('\admin')
  })

}

module.exports.lowStock = function(req, res, application) {
  const Product = application.app.models.Product
  var connect = application.config.connect()
  Product.getLowStockProducts(connect, (error, result) => {
    connect.end()
    if (error) {
      let msg = `Error trying get low stock products: ${error.sqlMessage}`
      console.error(msg)
      req.session.message = msg
    } else {
      res.render('admin/product/low_stock_products.ejs', {
        'user': req.session.user,
        'products': result
      })
    }
  })
}

module.exports.lowStockNotification = (req, res, application) => {
  const Product = application.app.models.Product
  var connect = application.config.connect()
  Product.getLowStockProducts(connect, (error, result) => {
    connect.end()
    if(error) {
      console.error(`Error trying get low stock products: ${error.sqlMessage}`)
    } else {
      res.render('admin/notification_lowstock.ejs', {
        'products': result,
        'quantity': Object.keys(result).length
      })
    }
  })
}
