module.exports.index = (req, res, application) => {
  var msg = req.session.message
  req.session.message = ''
  var error = req.session.error
  req.session.error = ''
  var continueThisCategory = req.session.categoryId
  req.session.categoryId = undefined

  var categoryId = req.query.categoryId

  if (categoryId === undefined) {
    if(continueThisCategory !== undefined) {
      var newCategoryId = parseInt(continueThisCategory)
      if (!isNaN(newCategoryId)) {
        categoryId = newCategoryId
      }
    }
  }

  var connect = application.config.connect()
  application.app.models.Product.getAll(connect, categoryId,
    (errProduct, result) => {
      connect.end()
      if (errProduct) {
        console.error(`Error tryong get product: ${errProduct.sqlMessage}`);
        req.session.error = `Error tryong get product: ${errProduct.sqlMessage}`;
        res.redirect('/')
      } else {
        getAllCategories(result)
      }
  });

  function getAllCategories(products) {
    var connect = application.config.connect()
    application.app.models.Category.getAll(connect,
      (errCategory, categories) => {
      connect.end()
      if (errCategory) {
        console.error(`Error: ${errCategory.sqlMessage}`);
        req.session.error = `Error tryong get all categories: ${errCategory.sqlMessage}`;
        res.render('core/index.ejs', {
          'error': error
        })
      } else {

        function whatCategory(categoryId) {
          for(let category of categories) {
            if (categoryId == category.id) {
              return category.name
            }
          }
        }

        let page = req.query.page
        paginator = application.app.utils.paginator(products, page)

        res.render('core/index.ejs', {
          'paginator': paginator,
          'user': req.session.user,
          'categories': categories,
          'msg': msg,
          'error': error,
          'whatCategory': whatCategory,
          'currentCategory': categoryId,
          'page': page,
          'cart': req.session.cart,
          'money': req.session.money
        })
      }
    })
  }
}

module.exports.login = (req, res, application) => {
  var msg = req.session.message
  var error = req.session.error
  req.session.message = ''
  req.session.error = ''

  if(req.session.loged) { // loged

    if (req.session.user.admin == 1) { // it is admin
      req.session.message = `Você está logado(a) como ${req.session.user.email}`;
      res.redirect('/admin');
    } else { // it is not admin
      req.session.message = `Bem-Vindo! Você está logado(a) como ${req.session.user.email}`;
      res.redirect('/client_area');
    }

  } else { // not loged
    if (req.method == 'GET') {
      res.render('core/login.ejs', {
        'msg': msg,
        'error': error
      });
    } else {
      post()
    }

  }

  function post() {
    const User = application.app.models.User;
    var connect = application.config.connect()
    User.verify(req.body, connect, (error, result) => {
      connect.end()
      if (error) {
        console.error(error.sqlMessage);
        req.session.error = `Error trying verify user: ${error.sqlMessage}`;
        res.redirect(req.originalUrl);
      } else {
        if(Object.keys(result).length > 0) {

          req.session.user = result[0];
          req.session.message = `Você está logado(a) como ${req.session.user.email}`;
          req.session.loged = true;

          if (req.session.user.admin == 1) {
            res.redirect('/admin')
          } else {
            res.redirect('/client_area');
          }
        } else {
          res.render('error404/index', {
            'msg': 'Usuário não encontrado!'
          });
        }
      }
    });
  }

}

module.exports.register = (req, res, application) => {

  var msg = req.session.message
  req.session.message = ''
  var error = req.session.error
  req.session.error = ''
  if (req.method == 'GET') {
    res.render('core/register.ejs', {
      'msg': msg,
      'error': error
    })
  } else {

    var data = req.body;

    var imageName = 'null';
    if (Object.keys(req.files).length > 0) {// image sended
      const helper = require('./../utils/helper')
      imageName = helper.uploadImage(req.files.image, 'user')
    }

    var saveUser = new Promise((resolve, reject) => {

      const Client = application.app.models.Client
      var client = new Client(data, imageName)
      var connect = application.config.connect()
      client.createUser(connect, (errorUser, resultUser) => {
        connect.end()
        if (errorUser) {
          reject(errorUser)
        } else {
          response = {
            'userId': resultUser['insertId'],
            'client': client
          }
          resolve(response)
        }
      })

    })

    saveUser.then(response => {
      const client = response.client
      const userId = response.userId
      var connect = application.config.connect()
      client.createClient(userId, connect, (errorClient, resultClient) => {
        connect.end()
        if (errorClient) {
          console.error(errorClient.sqlMessage);
          req.session.error = `Error trying save a new client: ${errorClient.sqlMessage}`;
          res.redirect(req.originalUrl);
        } else {
          console.log(`Saved with id ${resultClient['insertId']}`);
          req.session.message = 'Conta criada com sucesso! Agora você pode fazer login!';
          res.redirect('\login');
        }
      })
    }).catch(error => {
      console.error(error.sqlMessage);
      req.session.error = `Error trying save a new user: ${error.sqlMessage}`;
      res.redirect(req.originalUrl);
    })

  }
}

module.exports.add_to_cart = (req, res, application) => {

  req.session.categoryId = req.query.categoryId
  if (typeof req.session.cart == 'undefined') { // the cart is created here
    req.session.cart = []
    req.session.money = 0
    var connect = application.config.connect()
    application.app.models.Product.getThis(req.query.productId, connect,
      (err, result) => {
        connect.end()
        if(err) {
          console.error(err.sqlMessage);
          req.session.error = `Error trying push the product whiten the cart: ${err.sqlMessage}`;
          res.render('core/index.ejs', {
            'error': error
          })
        } else {
          result[0].quantity = 1
          result[0].subTotal = result[0].price
          req.session.cart.push(result[0])
          res.redirect('/')
        }
      })
  } else { // the cart already exists
    // test whether the product was added
    if(!productWasAdded(req.query.productId, req.session.cart)) {
      var connect = application.config.connect()
      application.app.models.Product.getThis(req.query.productId, connect,
        (err, result) => {
          connect.end()
          if(err) {
            console.error(err.sqlMessage);
            req.session.error = `Error trying pu the product whiten the cart: ${err.sqlMessage}`;
            res.render('core/index.ejs', {
              'error': error
            })
          } else {
            result[0].quantity = 1
            result[0].subTotal = result[0].price
            req.session.cart.push(result[0])
            res.redirect('/')
          }
        })
    } else {
      res.redirect('/');
    }
  }

  function productWasAdded(productId, cart) {
    var resp = false
    cart.forEach(product => {
      if(product.id == productId) {
        resp = true
      }
    })
    return resp
  }

}

module.exports.access_cart = (req, res) => {
  req.session.message = `
    Você precisa estar logado antes de acessar o carrinho de compras.
    Se você ainda não é registrado, click em registrar-se.
    É fácil e rápido :-)
  `
  res.redirect('/login')
}

module.exports.productDetails = (req, res, application) => {
  const Category = application.app.models.Category
  const Product = application.app.models.Product
  const connect = application.config.connect()
  const productId = req.query.productId

  var getCategpries = new Promise((resolve, reject) => {
    Category.getAll(connect, (error, categories) => {
      if (error) {
        reject(error)
      } else {
        resolve(categories)
      }
    })
  })

  var getProduct = new Promise((resolve, reject) => {
    Product.getThis(productId, connect, (error, result) => {
      if (error) {
        reject(error)
      } else {
        resolve(result[0])
      }
    })
  })

  Promise.all([getCategpries, getProduct])
  .then(([categories, product]) => {
    res.render('core/product_details.ejs', {
      'user': req.session.user,
      'categories': categories,
      'product': product
    })
  }).catch(error => {
    console.error(error.sqlMessage);
    req.session.error = `Error: ${error.sqlMessage}`;
    res.redirect('/');
  }).then(() => {
    connect.end()
    console.log('connection closed')
  })

}

module.exports.contact = (req, res, application) => {
  var msg = req.session.message
  req.session.message = ''
  var errorSendMessage = req.session.error
  req.session.error = ''

  const connect = application.config.connect()
  const Category = application.app.models.Category

  Category.getAll(connect, (error, result) => {
    connect.end()
    if (error) {
      res.send(`Error trying show contact page: ${error.sqlMessage}`)
    } else {
      res.render('core/contact.ejs', {
        'user': req.session.user,
        'categories': result,
        'msg': msg,
        'error': errorSendMessage
      })
    }
  })

}

module.exports.sendMessage = (req, res, application) => {
  const Message = application.app.models.Message
  const connect = application.config.connect()
  let msg = new Message(req.body)
  msg.save(connect, (error, result) => {
    connect.end()
    if (error) {
      console.error(`Error trying send message: ${error.sqlMessage}`)
      req.session.error = `Error trying send message: ${error.sqlMessage}`
      res.redirect('/contact')
    } else {
      console.log(result)
      req.session.message = 'Mensagem enviada com sucesso!'
      res.redirect('/contact')
    }
  })

}