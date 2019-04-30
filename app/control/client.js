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
  if (req.method == 'GET') {
    var connect = application.config.connect()
    application.app.models.Client.getThis(req.session.user.id, connect, 
      (error, result) => {
        connect.end()
        if(error) {
          console.error(error.sqlMessage);
          req.session.error = `Error trying get the client: ${error.sqlMessage}`;
          res.redirect('\client_area');
        } else {
          res.render('client_area/profile.ejs', {
            'user': req.session.user,
            'clientUser': result[0]
          })
        }
      })    
  } else {
    editProfile(req, res, application);      
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

  /* here I have a array with all items
  Each item is a object */
  const allItems = getAllItems(allIds, data) 
  var total = getTotal(allItems)

  var save = new Promise((resolve, reject) => {
    const Order = application.app.models.Order
    var order = new Order(req.session.user.id, total, req.body.money)
    var connect = application.config.connect()
    order.save(connect, (orderError, result) => {
      connect.end()
      if (orderError) {
        reject(orderError)
      } else {
        const orderId = result['insertId']
        resolve(orderId)
      }
    })
  })

  save.then((orderId) => {
    const Item = application.app.models.Item
    var connect = application.config.connect()
    Item.saveItems(allItems, orderId, connect, (itemsError, result) => {
        connect.end()
        if (itemsError) {
          console.error(itemsError.sqlMessage);
          req.session.error = `Error trying save items: ${itemsError.sqlMessage}`;
          res.redirect('\client_area');
        } else {
          // update stock
          updateStock(allItems) 

          req.session.message = 'Pedido realizado com sucesso';
          req.session.cart = undefined
          req.session.money = undefined
          res.redirect('\client_area')
        }
      }) 
  }).catch((orderError) => {
    console.error(orderError.sqlMessage)
    req.session.error = `Error trying save order: ${orderError.sqlMessage}`
    res.redirect('\client_area')
  })

  function updateStock(allItems) {

    var joinedQueries = ``
    allItems.forEach(item => {
      let query = `update product set stock = ${item.stock - item.quantity} where id = ${item.id};`
      joinedQueries += query
    })

    const Product = application.app.models.Product
    var connect = application.config.connect()
    Product.updateStock(joinedQueries, connect, (error, result) => {
      connect.end()
      if (error) {
        console.error(error.sqlMessage)        
      } else {
        console.log(result)
      }
    })    
  }
  
}
