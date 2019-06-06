module.exports.index = (req, res, application) => {
  var msg = req.session.message;
  req.session.message = ''
  var error = req.session.error;
  req.session.error = ''
  var continueThisCategory = req.session.categoryId;
  req.session.categoryId = undefined;
  var connect = application.config.connect()
  const fs = require('fs')

  var categoryId = req.query.categoryId;

  if (categoryId === undefined) {
    if(continueThisCategory !== undefined) {
      var newCategoryId = parseInt(continueThisCategory)
      if (!isNaN(newCategoryId)) {
        categoryId = newCategoryId;
      }
    }
  }

  const getAllProducts = new Promise((resolve, reject) => {
    // get all products
    application.app.models.Product.getAll(connect, categoryId,
      (errProduct, products) => {
        if (errProduct) {
          reject(errProduct)
        } else {
          resolve(products)
        }
      })
  })
  
  const getAllCategories = new Promise((resolve, reject) => {
    application.app.models.Category.getAll(connect,
      (errCategory, categories) => {
        if (errCategory) {
         reject()
        } else {
          resolve(categories)
        }
      })
  })
  
  const getLogoName = new Promise((resolve, reject) => {
    const dirLogoPath = __dirname + '/../public/system-images'
    fs.readdir(dirLogoPath, (errorDir, responseDir) => {
      if (errorDir) {
        reject(errorDir)
      } else {
        var logoName
        Object.values(responseDir).forEach(item => {
          if (item.includes('mylogo')) {
            logoName = item
          }
        })
        resolve(logoName)
      }
    })
  })
  
  const getWhyChooseOurProducts = new Promise((resolve, reject) => {
    let path = __dirname + "/../public/json-files/why-our-products.json"
    fs.readFile(path, (err, content) => {
      if (err) {
        reject(err)
      } else {
        var whyOurProducts = JSON.parse(content)
        resolve(whyOurProducts)
      }
    })
  })

  const getAboutUs = new Promise((resolve, reject) => {
    let path = __dirname + "/../public/json-files/about-us.json"
    fs.readFile(path, (err, content) => {
      if (err) {
        reject(err)
      } else {
        var aboutUs = JSON.parse(content)
        resolve(aboutUs)
      }
    })
  })

  const getSocialNW = new Promise((resolve, reject) => {
    let path = __dirname + "/../public/json-files/social-nw.json"
    fs.readFile(path, (err, content) => {
      if (err) {
        console.error(err)
        reject(err)
      } else {
        var socialNW = JSON.parse(content)
        resolve(socialNW)
      }
    })
  })

  Promise.all([getAllProducts, getAllCategories, 
    getLogoName, getWhyChooseOurProducts, getAboutUs,
    getSocialNW])
    .then(([products, categories, logoName, whyOurProducts, 
      aboutUs, socialNW]) => {

    function whatCategory(categoryId) {
      for (let category of categories) {
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
      'money': req.session.money,
      'allProducts': products,
      'logoName': logoName,
      'whyOurProducts': whyOurProducts,
      'aboutUs': aboutUs,
      'socialNW': socialNW
    })
    
  }).catch(error => {
    console.error(error)
    res.send(`Error: ${error}`)
  }).then(() => {
    connect.end()
  })  
  
}

module.exports.login = (req, res, application) => {
  var msg = req.session.message;
  var error = req.session.error;
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

    var imageName = null;
    if (req.files != null) {// image sended
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
          req.session.error = `Erro tentando salvar o cliente: ${errorClient.sqlMessage}`;
          res.redirect(req.originalUrl);
        } else {
          console.log(`Saved with id ${resultClient['insertId']}`);
          req.session.message = 'Conta criada com sucesso! Agora você pode fazer login!';
          res.redirect('\login');
        }
      })
    }).catch(error => {
      console.error(error.sqlMessage);
      req.session.error = `Error tentando salvar o usuário: ${error.sqlMessage}`;
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
  const fs = require('fs')

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

  const getLogoName = new Promise((resolve, reject) => {
    const dirLogoPath = __dirname + '/../public/system-images'
    fs.readdir(dirLogoPath, (errorDir, responseDir) => {
      if (errorDir) {
        reject(errorDir)
      } else {
        var logoName
        Object.values(responseDir).forEach(item => {
          if (item.includes('mylogo')) {
            logoName = item
          }
        })
        resolve(logoName)
      }
    })
  })

  const getAboutUs = new Promise((resolve, reject) => {
    let path = __dirname + "/../public/json-files/about-us.json"
    fs.readFile(path, (err, content) => {
      if (err) {
        reject(err)
      } else {
        var aboutUs = JSON.parse(content)
        resolve(aboutUs)
      }
    })
  })

  const getSocialNW = new Promise((resolve, reject) => {
    let path = __dirname + "/../public/json-files/social-nw.json"
    fs.readFile(path, (err, content) => {
      if (err) {
        console.error(err)
        reject(err)
      } else {
        var socialNW = JSON.parse(content)
        resolve(socialNW)
      }
    })
  })

  const getWhyChooseOurProducts = new Promise((resolve, reject) => {
    let path = __dirname + "/../public/json-files/why-our-products.json"
    fs.readFile(path, (err, content) => {
      if (err) {
        reject(err)
      } else {
        var whyOurProducts = JSON.parse(content)
        resolve(whyOurProducts)
      }
    })
  })

  Promise.all([getCategpries, getProduct, getLogoName,
    getAboutUs, getSocialNW, getWhyChooseOurProducts])
    .then(([categories, product, logoName, aboutUs,
      socialNW, whyOurProducts]) => {
    res.render('core/product_details.ejs', {
      'user': req.session.user,
      'categories': categories,
      'product': product,
      'logoName': logoName,
      'aboutUs': aboutUs,
      'socialNW': socialNW,
      'whyOurProducts': whyOurProducts
    })
  }).catch(error => {
    console.error(error.sqlMessage);
    req.session.error = `Error: ${error}`;
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
  const fs = require('fs')

  const getAllCategories = new Promise((resolve, reject) => {
    const connect = application.config.connect()
    const Category = application.app.models.Category
    Category.getAll(connect, (error, categories) => {
      connect.end()
      if (error) {
        reject(eror)
      } else {
        resolve(categories)
      }
    })
  })  

  const getLogoName = new Promise((resolve, reject) => {
    const dirLogoPath = __dirname + '/../public/system-images'
    fs.readdir(dirLogoPath, (errorDir, responseDir) => {
      if (errorDir) {
        reject(errorDir)
      } else {
        var logoName
        Object.values(responseDir).forEach(item => {
          if (item.includes('mylogo')) {
            logoName = item
          }
        })
        resolve(logoName)
      }
    })
  })

  const getWhyChooseOurProducts = new Promise((resolve, reject) => {
    let path = __dirname + "/../public/json-files/why-our-products.json"
    fs.readFile(path, (err, content) => {
      if (err) {
        reject(err)
      } else {
        var whyOurProducts = JSON.parse(content)
        resolve(whyOurProducts)
      }
    })
  })

  const getAboutUs = new Promise((resolve, reject) => {
    let path = __dirname + "/../public/json-files/about-us.json"
    fs.readFile(path, (err, content) => {
      if (err) {
        reject(err)
      } else {
        var aboutUs = JSON.parse(content)
        resolve(aboutUs)
      }
    })
  })

  const getSocialNW = new Promise((resolve, reject) => {
    let path = __dirname + "/../public/json-files/social-nw.json"
    fs.readFile(path, (err, content) => {
      if (err) {
        console.error(err)
        reject(err)
      } else {
        var socialNW = JSON.parse(content)
        resolve(socialNW)
      }
    })
  })

  Promise.all([getAllCategories, getLogoName,
    getWhyChooseOurProducts, getAboutUs,
    getSocialNW])
    .then(([categories, logoName, whyOurProducts, aboutUs,
      socialNW]) => {
    res.render('core/contact.ejs', {
      'user': req.session.user,
      'categories': categories,
      'msg': msg,
      'error': errorSendMessage,
      'logoName': logoName,
      'whyOurProducts': whyOurProducts,
      'aboutUs': aboutUs,
      'socialNW': socialNW
    })
  })
  .catch(error => {
    res.send(`Error trying show contact page: ${error}`)
  })

}

module.exports.newslatter = (req, res, application) => {
  let email = req.body.email
  const newslatter = new application.app.models.Newslatter(email)
  const connect = application.config.connect()
  newslatter.save(connect, (error, result) => {
    if (error) {
      console.log(`Error trying send message: ${error.sqlMessage}`)
    } else {
      console.log(result)
      req.session.message = 'Obrigado por se inscrever na nossa newslatter :-)'
      res.redirect('/')
    }
  })
}

module.exports.aboutUs = (req, res, application) => {
  const Category = application.app.models.Category
  const connect = application.config.connect()
  const fs = require('fs')

  var getCategories = new Promise((resolve, reject) => {
    Category.getAll(connect, (error, categories) => {
      connect.end()
      if (error) {
        reject(error)
      } else {
        resolve(categories)
      }
    })
  })

  var getAboutUs = new Promise((resolve, reject) => {
    var path = __dirname + "/../public/json-files/about-us.json"
    fs.readFile(path, (err, content) => {
      if (err) {
        reject(err)
      } else {
        const aboutUs = JSON.parse(content)
        resolve(aboutUs)        
      }
    })
  }) 

  const getLogoName = new Promise((resolve, reject) => {
    const dirLogoPath = __dirname + '/../public/system-images'
    fs.readdir(dirLogoPath, (errorDir, responseDir) => {
      if (errorDir) {
        reject(errorDir)
      } else {
        var logoName
        Object.values(responseDir).forEach(item => {
          if (item.includes('mylogo')) {
            logoName = item
          }
        })
        resolve(logoName)
      }
    })
  })

  const getWhyChooseOurProducts = new Promise((resolve, reject) => {
    let path = __dirname + "/../public/json-files/why-our-products.json"
    fs.readFile(path, (err, content) => {
      if (err) {
        reject(err)
      } else {
        var whyOurProducts = JSON.parse(content)
        resolve(whyOurProducts)
      }
    })
  })

  const getSocialNW = new Promise((resolve, reject) => {
    let path = __dirname + "/../public/json-files/social-nw.json"
    fs.readFile(path, (err, content) => {
      if (err) {
        console.error(err)
        reject(err)
      } else {
        var socialNW = JSON.parse(content)
        resolve(socialNW)
      }
    })
  })

  Promise.all([getCategories, getAboutUs, getLogoName,
    getWhyChooseOurProducts, getSocialNW])
    .then(([categories, aboutUs, logoName, whyOurProducts,
      socialNW]) => {
    res.render('core/aboutUs.ejs', {
      'user': req.session.user,
      'categories': categories,
      'aboutUs': aboutUs,
      'logoName': logoName,
      'whyOurProducts': whyOurProducts,
      'socialNW': socialNW
    })
  })
  .catch(err => {
    console.log(`Error: ${err}`)
    req.session.error = `
    Tivemos um problema técnico.
    Já estamos trabalhando para resolvê - lo. Agradecemos sua compreensão
    `
    res.redirect('/')
  })

}

module.exports.rememberPassword = (req, res, application) => {
  var msg = req.session.message
  req.session.message = ''
  var error = req.session.error
  req.session.error = ''

  if (req.method == 'GET') {
    res.render('core/remember_password.ejs', {
      'msg': msg,
      'error': error
    })
  } else {
    var email = req.body.email
    const connect = application.config.connect()
    const Client = application.app.models.Client

    function verifyEmail(){
      return new Promise((resolve, reject) => {
        Client.verifyEmail(email, connect, (error, result) => {
          if (error) {
            reject(error)
          } else {
            resolve(result)
          }
        })
      })        
    }

    async function getIdClient() {
      var result = await verifyEmail()
      if (result.length == 0) { // the email don't exists
        result = false 
      } else { // defining a new password
        result[0].newPassWord = Math.floor(Math.random() * 10000)        
      }
      return result
    }

    getIdClient().then(result => {
      if (result == false) {
        req.session.error = 'Email não encontrado'
        res.redirect(req.originalUrl)
      } else {
        Client.changePassword(result[0].id, result[0].newPassWord, connect, (error, r) => {
          connect.end()
          if (error) {
            console.error(error)
            req.session.error = 'Não foi possível atualizar o banco de dados'
            res.redirect(req.originalUrl)
          } else {
            console.log(r)
            // send email with password
            const newPassWord = result[0].newPassWord            
            
            receivers = email
            let text = `
            Sua nova senha é ${newPassWord}}. Você pode mudar de senha a qualquer
          momento na área do cliente
            `
            let html = `
            <i>Mudança de senha</i>
            <p>Sua nova senha é ${newPassWord}. Você pode mudar de senha a qualquer
            momento na área do cliente</p>
            `
            let subject = "Mudança de senha"

            const sendMail = require('../utils/helper').sendMail
            
            var message = {
              html: html,
              text: text
            }
            var info = sendMail(message, receivers, subject)
            info.then(result => {
              console.log(result)
              req.session.message = `
              Uma nova senha foi enviada para o seu email. 
              Use sua nova senha para entrar em sua conta. 
              Você pode mudar de senha a qualquer momento na área do cliente`

              res.redirect(req.originalUrl)
            }).catch(error => {
              console.error(error)
              req.message.error = `Error ao tentar enviar o email: ${error}`
              res.redirect(req.originalUrl)
            })
            
          }
        })
      }
    }).catch(error => {
      console.log(`error: ${error}`)
      req.session.error = error      
    })  
    
  } 

}
