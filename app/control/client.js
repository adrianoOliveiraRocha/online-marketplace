// helpers 
function editProfile(req, res, application) {
  var data = req.body;
  var imageName = null;
  const User = application.app.models.User;

  if (Object.keys(req.files).length > 0) {// image sended
    const helper = require('./../utils/helper');
    helper.deleteOldeImage(User, data.userId, 'user', application);      
    imageName = helper.uploadImage(req.files.image, 'user');
  }

  User.update(req.session.user, data, application, imageName, 
    (error, result) => {
    application.config.connect().end()
    if (error) {
      res.send(error.sqlMessage);
    } else {
      updateSession()                   
    }
  });

  function updateSession() {
    User.getThis(req.session.user.id, application, (err, result) => {
      application.config.connect().end()
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
    application.app.models.Client.update(data, application, 
      (error, result) => {
        application.config.connect().end()
        if (error) {
          console.error(error.sqlMessage);
          req.session.error = `Error trying update client: ${error.sqlMessage}`;
          res.redirect('\client_area');
        } else {
          req.session.message = 'Atualizado com sucesso!';
          console.log(result)
          res.redirect('\client_area');
        }
      }
    )
    
  }
  
}

function updateShopingCart(req) {
  const currentValues = req.body
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
    'total': getTotal(),
    'cart': req.session.cart
  })

  function getTotal(){    
    if(typeof req.session.cart != 'undefined') {// I have a shoping cart
      var response = 0
      req.session.cart.forEach(product => {
        if(product != null) {
          response += parseFloat(product.subTotal)
        }        
      })
      return response
    } else {
      return undefined
    }    
  }
  
}

module.exports.client_profile = (req, res, application) => {
  if (req.method == 'GET') {
    application.app.models.Client.getThis(req.session.user.id, application, 
      (error, result) => {
        application.config.connect().end()
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


