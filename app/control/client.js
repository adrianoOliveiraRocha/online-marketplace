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
      updateSession()                   
    }
  });

  function updateSession() {
    var connect = application.config.connect()
    User.getThis(req.session.user.id, connect, (err, result) => {
      connect.end()
      if (err) {
        console.error(error.sqlMessage);
        req.session.error = `Error trying update the session: ${error.sqlMessage}`;
        res.redirect('\client_area');
      } else {
        req.session.user = result[0];
        updateClient()
      }
    });
  }  

  function updateClient() {
    var connect = application.config.connect()
    application.app.models.Client.update(data, connect, 
      (error, result) => {
        connect.end()
        if (error) {
          console.error(error.sqlMessage);
          req.session.error = `Error trying update client: ${error.sqlMessage}`;
          res.redirect('\client_area');
        } else {
          req.session.message = 'Atualizado com sucesso!';
          res.redirect('\client_area');
        }
      }
    )
    
  }
  
}

function updateShopingCart(req) {
  
  const currentValues = req.body
  req.session.money = currentValues.money
  req.session.cart.forEach(product => {
    updateVelues(product)   
  })

  function updateVelues(product) {
    product.quantity = currentValues['quantity' + product.id]
    product.subTotal = getCurrentSubtotal(currentValues['subtotal' + product.id])    
  }

  function getCurrentSubtotal(strValue) {
    let response = strValue.replace('R$', '')
    response = response.replace(',', '.')
    return response
  }
  
}

function getAllIds(data) {
  var allIds = []
  Object.keys(data).forEach(key => {
    if(key.startsWith('idProduct')) {
      allIds.push(data[key])     
    }
  })
  return allIds
}

function getAllItems(allIds, data) {
  var response = []
  allIds.forEach(id => {
    let item = {}
    item['id'] = id
    item['price'] = data[`price${id}`]
    item['quantity'] = data[`quantity${id}`]
    item['subtotal'] = data[`subtotal${id}`]
    item['stock'] = data[`stock${id}`]
    response.push(item)
  })

  return response

}

function getTotal(allItems){    
  
  function getSTValue(subtotal) {
    let response = subtotal.replace('R$', '')
    response = response.replace(',', '.')
    return parseFloat(response)
  }

  var response = 0
  allItems.forEach(product => {
    let stValue = getSTValue(product.subtotal)
    response += stValue         
  })

  return response   

}

// end helpers 

module.exports.client_area = (req, res, application) => {
  
  var msg = req.session.message
  req.session.message = ''
  var error = req.session.error
  req.session.error = ''
  
  res.render('client_area/index.ejs', {
    'user': req.session.user,
    'msg': msg,
    'error': error,
    'total': require('../utils/helper').getTotal(req.session.cart),
    'cart': req.session.cart,
    'money': req.session.money
  })
  
}

module.exports.client_profile = (req, res, application) => {
  var connect = application.config.connect()
  application.app.models.Client.getThis(req.session.user.id, connect,
    (error, result) => {
      connect.end()
      if (error) {
        console.error(error.sqlMessage);
        req.session.error = `
            Erro tentando recuperar as informações do cliente: ${error.sqlMessage}`
        res.redirect('\client_area');
      } else {
        res.render('client_area/profile.ejs', {
          'user': req.session.user,
          'clientUser': result[0]
        })
      }
    })  
}

module.exports.clientProfile = (req, res, application) => {

  var data = req.body;
  var completeName = null // if this image was sende, it will be updated
  const User = application.app.models.User

  if (req.files == null) { // image not sended
    update() // image will not to be updated
  } else {
    updateImage()
  }

  function updateImage() {
    const User = application.app.models.User
    const connect = application.config.connect()

    var getUser = new Promise((resolve, reject) => { // delete old image
      User.getThis(req.session.user.id, connect, (userError, userResult) => {
        if (userError) {
          reject(`Error recuperar o usuário: ${userError}`)
        } else {
          var oldImageName = userResult[0].image
          if (oldImageName) {
            let oldFile = __dirname + `/../public/upload/user/${oldImageName}`
            const fs = require('fs')
            fs.unlink(oldFile, (errOldFile) => {
              if (errOldFile) {
                resolve() // Doesn't exists image to delete
              } else {
                resolve() // Image was deleted. Go on
              }
            })
          } else {
            console.log("Doesn't exists olde image")
            resolve() // Doesn't exists image to delete
          }
        }
      })
    })

    getUser.then(() => { // upload new image
      return new Promise((resolve, reject) => {
        const image = req.files.image
        let imageName = new Date().getTime()
        let extension = image.name.split('.').pop()
        completeName = imageName + '.' + extension
        var path = __dirname + '/../public/upload/user/' + completeName
        image.mv(path, (err) => { // uploade da imagem
          if (err) {
            reject(err)
          } else {
            resolve()
          }
        })
      })
    }).then(() => {
      connect.end()
      update()
    }).catch(error => {
      console.error(error)
      req.session.error = 'Não foi possível atualizar a imagem'
      res.redirect('\admin')
    })

  }

  function update() { // update the table user
    var connect = application.config.connect()
    
    var pUpdate = new Promise((resolve, reject) => {
      User.update(req.session.user, data, connect, completeName,
        (error, result) => {
          if (error) {
            reject(error)
          } else {
            console.log(result)
            resolve()
          }
        })
    })

    pUpdate.then(() => { // update the table client
      return new Promise((resolve, reject) => {
        const Client = application.app.models.Client
        Client.update(data, connect, (error, resultClient) => {
          if (error) {
            reject(error)
          } else {
            resolve()
          }
        })
      })
    }).then(() => { // get user already updated      
      return new Promise((resolve, reject) => {
        User.getThis(req.session.user.id, connect, (error, result) => {
          if (error) {
            reject(error)
          } else {
            resolve(result)
          }
        })
      })
    }).then(result => {
      console.log(result)
      connect.end()
      // atualiza a sessão
      req.session.user = result[0]
      req.session.message = 'Atualizado com sucesso!'
      res.redirect('/client_area')
    }).catch(error => {
        console.error(error)
        req.session.error = 'Não foi possível atualizar as informações'
        res.redirect('/client_area')
    })

  }

}

module.exports.comeback_site = (req, res) => {
  // update the cart
  updateShopingCart(req)
  res.redirect('/')

}

module.exports.delete_item = (req, res) => {

  req.session.cart.forEach(product => {
    if(req.query.delete == product.id) {
      req.session.cart.splice(req.session.cart.indexOf(product), 1)
      if (req.session.cart.length == 0) {
        req.session.cart = undefined
      } else {
        updateShopingCart(req)
      }
    }    
  })

  res.redirect('/client_area')

}

module.exports.cancel_cart = (req, res) => {

  req.session.cart = undefined
  req.session.money = undefined
  res.redirect('/client_area')

}

module.exports.finalize = (req, res, application) => {

  const data = req.body
  const allIds = getAllIds(data)  
  var connect = application.config.connect()
  const allItems = getAllItems(allIds, data) 
  var total = getTotal(allItems)

  function saveOrder() {
    return new Promise((resolve, reject) => {
      const Order = application.app.models.Order
      var order = new Order(req.session.user.id, total, req.body.money)
      order.save(connect, (orderError, result) => {
        if (orderError) {
          reject(orderError.sqlMessage) 
        } else {
          resolve(result['insertId'])
        }
      })
    })    
  }

  saveOrder()
  .then(orderId => {// save items
    const Item = application.app.models.Item
    return new Promise((resolve, reject) => {
      Item.saveItems(allItems, orderId, connect, (itemsError, result) => {
        if (itemsError) {
          reject(itemsError.sqlMessage)
        } else {
          resolve(result)        
        }
      })
    })    
  })
  .then(result => {// update stock
    console.log('Items ok')
    console.log(result, '/n')
    
    var joinedQueries = ``
    allItems.forEach(item => {
      let query = `update product set stock = ${item.stock - item.quantity} where id = ${item.id};`
      joinedQueries += query
    })

    return new Promise((resolve, reject) => {
      const Product = application.app.models.Product
      var connect = application.config.connect()
      Product.updateStock(joinedQueries, connect, (error, result) => {
        if (error) {
          reject(error.sqlMessage)        
        } else {
          resolve(result)
        }
      })
    }) 
  })
  .then((result) => {
    console.log('stock updated:')
    console.log(result, '/n')

    req.session.message = `
    Pedido realizado com sucesso. Iremos atendê-lo em instantes.
    Por favor Aguarde!`;
    connect.end()
    req.session.cart = undefined
    req.session.money = undefined
    res.redirect('\client_area')
  })
  .catch(error => {
    console.error(error.sqlMessage)
    req.session.error = `Error trying save order: ${error}`
    res.redirect('\client_area')
  }) 
  
}
