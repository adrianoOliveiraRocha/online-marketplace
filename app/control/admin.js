// helpers
function editProfile(req, res, application) {
  var data = req.body;
  var imageName = null;
  const User = application.app.models.User;

  if (Object.keys(req.files).length > 0) {// image sended
    const helper = require('./../utils/helper');
    var connect = application.config.connect()
    helper.deleteOldeImage(User, data.userId, 'user', connect);
    imageName = helper.uploadImage(req.files.image, 'user');
  }
  var connect = application.config.connect()
  User.update(req.session.user, data, connect, imageName,
    (error, result) => {
    connect.end()
    if (error) {
      res.send(error.sqlMessage);
    } else {
      console.log(result);
      updateSession();
    }
  });

  function updateSession() {
    var connect = application.config.connect()
    User.getThis(req.session.user.id, connect, (err, result) => {
      connect.end()
      if (err) {
        console.error(err.sqlMessage);
      } else {
        console.log(result);
        req.session.user = result[0];
        req.session.message = 'Atualizado com sucesso!';
        res.redirect('\admin');
      }
    });
  }
}
// end helpers

module.exports.index = (req, res, application) => {
  var message = req.session.message;
  req.session.message = '';
  var error = req.session.error;
  req.session.error = '';

  res.render('admin/index.ejs', {
    'msg': message,
    'user': req.session.user,
    'error': error
  });
}

module.exports.logout = (req, res, application) => {
  req.session.destroy();
  res.redirect('/');
}

module.exports.profile = (req, res, application) => {
  if (req.method == 'GET') {
    res.render('admin/profile.ejs', {
      'user': req.session.user,
    });
  } else {
    editProfile(req, res, application);
  }
}

module.exports.all_orders = function(req, res, application) {

  const Order = application.app.models.Order
  var connect = application.config.connect()
  Order.getAllOrders(connect, (error, result) => {
    connect.end()
    if (error) {
      console.error(error.sqlMessage)
      req.session.error = `Error trying get all orders: ${error.sqlMessage}`
      res.redirect('\admin')
    } else {
      res.render('admin/order/all_orders.ejs', {
        'user': req.session.user,
        'allOrders': result
      })
    }
  })

}

module.exports.pending_orders = function(req, res, application) {

  const Order = application.app.models.Order
  var connect = application.config.connect()
  Order.getAllPendingOrders(connect, (error, result) => {
    connect.end()

    if (error) {
      console.error(error.sqlMessage)
      req.session.error = `Error trying get all orders: ${error.sqlMessage}`
      res.redirect('\admin')
    } else {
      res.render('admin/order/all_pending_orders.ejs', {
        'user': req.session.user,
        'allPendingOrders': result
      })
    }

  })

}

module.exports.received_orders = function(req, res, application) {

  const Order = application.app.models.Order
  var connect = application.config.connect()
  Order.getAllReceivedOrders(connect, (error, result) => {
    connect.end()
    if (error) {
      console.error(error.sqlMessage)
      req.session.error = `Error trying get all orders: ${error.sqlMessage}`
      res.redirect('\admin')
    } else {
      res.render('admin/order/all_received_orders.ejs', {
        'user': req.session.user,
        'allReceivedOrders': result
      })
    }
  })

}

module.exports.orderDetails = function(req, res, application) {

  const orderId = req.query.orderId
  const Order = application.app.models.Order
  const Item = application.app.models.Item
  var connect = application.config.connect()

  function getOrderDetails() {
    return new Promise((resolve, reject) => {
      Order.orderDetails(orderId, connect, (error, result) => {
        if (error) {
          reject(error)
        } else {
          resolve(result[0])//I have informations about the order and the client
        }
      })
    })
  }
  getOrderDetails()
  .then(order => {
    return new Promise((resolve, reject) => {
      Item.getAll(order.orderId, connect, (error, items) => {
        if (error) {
          reject(error)
        } else {
          response = {
            'items': items, // Items from this order
            'order': order
          }
          resolve(response)
        }
      })
    })
  })
  .then((response) => {
    req.session.orderImpress = response
    res.render('admin/order/order_details.ejs', {
      'user': req.session.user,
      'order': response.order,
      'fixDate': require('../utils/utilsOrder').fixDate,
      'fixHour': require('../utils/utilsOrder').fixHour,
      'getRest': require('../utils/utilsOrder').getRest,
      'items': response.items,
      'client': response.client
    })
  })
  .catch(error => {
    console.error(error)
    req.session.error = `Error trying get order details: ${error.sqlMessage}`
    res.redirect('/admin')
  }).then(() => {
    connect.end()
    console.log('connection closed')
  })

}

module.exports.fulfillOrder = function(req, res) {
  const fulfillOrder = req.session.orderImpress
  res.render('admin/order/fulfill_order.ejs', {
    'order': fulfillOrder.order,
    'items': fulfillOrder.items,
    'fixDate': require('../utils/utilsOrder').fixDate,
    'fixHour': require('../utils/utilsOrder').fixHour,
    'getRest': require('../utils/utilsOrder').getRest
  })
}

module.exports.done = function(req, res, application) {
  const fulfillOrder = req.session.orderImpress
  req.session.orderImpress = undefined
  const Order = application.app.models.Order
  var connect = application.config.connect()
  Order.MarkAsAnswered(fulfillOrder.order.orderId, connect, (error, result) => {
    if (error) {
      console.log(`Error trying mark order as answered: ${error.sqlMessage}`)
    } else {
      console.log(result)
      req.session.message = `O pedido ${fulfillOrder.order.orderId} foi marcado como atendido`
      res.redirect('/admin')
    }
  })
}

module.exports.editAboutUs = (req, res) => {
  const fs = require('fs')
  let path = __dirname + "/../public/json-files/about-us.json"
  fs.readFile(path, (err, content) => {
    if (err) {
      console.error(err)
      var errorMessage = "Não foi possível recuperar os dados: " + err
      req.session.error = errorMessage
      res.redirect('/admin')
    } else {
      var aboutUs = JSON.parse(content)
      res.render('admin/editAboutUs.ejs', {
        'user': req.session.user,
        'aboutUs': aboutUs
      })
    }
  })

}

module.exports.saveAboutUs = (req, res) => {
  const data = req.body.dataAboutUs // this keep the html
  const text = req.body.textAboutUs
  const fs = require('fs')

  setTimeout(() => {
    let aboutUs = {
      "type": "aboutUs",
      "data": data,
      "text": text
    }
    let dataStringfy = JSON.stringify(aboutUs)
    let path = __dirname + '/../public/json-files/about-us.json'
    fs.writeFileSync(path, dataStringfy)
  }, 2000)

  req.session.message = 'Salvo com sucesso!'
  res.redirect('/admin')

}

module.exports.editWhyOurProducts = (req, res) => {
  const fs = require('fs')
  let path = __dirname + "/../public/json-files/why-our-products.json"
  fs.readFile(path, (err, content) => {
    if (err) {
      console.error(err)
      var errorMessage = "Não foi possível recuperar os dados: " + err
      req.session.error = errorMessage
      res.redirect('/admin')
    } else {
      var whyOurProducts = JSON.parse(content)
      res.render('admin/editWhyOurProducts.ejs', {
        'user': req.session.user,
        'whyOurProducts': whyOurProducts
      })
    }
  })

}

module.exports.saveWhyOurProducts = (req, res) => {
  const data = req.body.dataWhyOurProducts
  const fs = require('fs')

  setTimeout(() => {
    let whyOurProducts = {
      "type": "whyOurProducts",
      "data": data
    }
    let dataStringfy = JSON.stringify(whyOurProducts)
    let path = __dirname + '/../public/json-files/why-our-products.json'
    fs.writeFileSync(path, dataStringfy)
  }, 2000)

  req.session.message = 'Salvo com sucesso!'
  res.redirect('/admin')

}

module.exports.editLogo = (req, res) => {
  const fs = require('fs')
  fs.readdir(__dirname + '/../public/system-images', (error, response) => {
    if (error) {
      req.session.error = "Não foi possível recuperar a imagem"
      res.redirect('/admin')
    } else {
      var fileName
      Object.values(response).forEach(item => {
        if (item.includes('mylogo')) {
          fileName = item
        }
        res.render('admin/editLogo.ejs', {
          'user': req.session.user,
          'fileName': fileName 
        })
      })
    }
  })  
}

module.exports.saveLogo = (req, res) => {
  // new logo
  var image = null
  var pathNewLogo = null
  if (req.files != null) {
    image = req.files.newLogo 
    var imageName = image.name   
    var extension = imageName.split(".").pop()
    imageName = "mylogo." + extension    
    pathNewLogo = __dirname + "/../public/system-images/" + imageName
    changeLogo() // because the image was sended the logo going to be changed
  } else {
    req.session.message = "Você precisa enviar uma imagem para trocar sua logo"
    res.redirect("/admin")
  }
  
  function changeLogo() {
    // get current file
    const fs = require('fs')
    function searchDir() {
      return new Promise((resolve, reject) => {
        fs.readdir(__dirname + '/../public/system-images', (error, files) => {
          if (error) {
            reject(error)
          } else {
            resolve(files)
          }
        })
      })
    }

    async function searchFile() {
      const allFiles = await searchDir()
      var currentFieleName = null
      Object.values(allFiles).forEach(item => {
        if (item.includes("mylogo")) {
          currentFieleName = item
        }
      })
      return currentFieleName
    }

    searchFile().then(currentFieleName => {
      var pathCurrentLogo = __dirname + "/../public/system-images/" + currentFieleName
      fs.unlink(pathCurrentLogo, errorDeleting => {
        if (errorDeleting) {
          console.error(errorDeleting)
        } else { // old logo was deleted
          image.mv(pathNewLogo, errorUploading => {
            if (errorUploading) {
              console.error(errorUploading)
            } else {
              req.session.msg = "Sua logo foi atualizada com sucesso!"
              res.redirect("/admin")
            }
          })
        }
      })

    }).catch(error => {
      res.send(error)
    })
  }  

}


