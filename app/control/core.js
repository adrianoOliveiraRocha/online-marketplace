module.exports.index = (req, res, application) => {
  var msg = req.session.message
  req.session.message = ''
  var error = req.session.error
  req.session.error = ''
  var idCategory = req.query.idCategory;

  application.app.models.Product.getAll(application, idCategory, 
    (errProduct, result) => {
      application.config.connect().end()
      if (errProduct) {
        console.error(`Error tryong get product: ${errProduct.sqlMessage}`);
        req.session.error = `Error tryong get product: ${errProduct.sqlMessage}`;
        res.render('core/index.ejs', {
          'error': error
        })
      } else {
        getAllCategories(result)      
      }
  });

  function getAllCategories(products) {
    application.app.models.Category.getAll(application, 
      (errCategory, categories) => {
      application.config.connect().end()      
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
          'currentCategory': idCategory,
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
    User.verify(req.body, application, (error, result) => {
      application.config.connect().end()
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
      
      client.createUser(application, (errorUser, resultUser) => {
        application.config.connect().end()
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
      client.createClient(userId, application, (errorClient, resultClient) => {
        application.config.connect().end()
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

  if (typeof req.session.cart == 'undefined') { // the cart is created here
    req.session.cart = []
    req.session.money = 0
    application.app.models.Product.getThis(req.query.productId, application, 
      (err, result) => {
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
  } else { // the cart already exists 
    // test whether the product was added
    req.session.money = req.body.money
    if(!productWasAdded(req.query.productId, req.session.cart)) {
      application.app.models.Product.getThis(req.query.productId, application, 
        (err, result) => {
          application.config.connect().end()
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