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
      console.log(result);
      updateSession();        
    }
  });

  function updateSession() {
    User.getThis(req.session.user.id, application, (err, result) => {
      application.config.connect().end()
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
  Order.getAllOrders(application, (error, result) => {
    if (error) {
      console.error(error.sqlMessage)
      req.session.error = `Error trying get all orders: ${error.sqlMessage}`
      res.redirect('\admin')
    } else {
      res.render('admin/all_orders.ejs', {
        'user': req.session.user,
        'allOrders': result
      })
    }
  })

}

module.exports.orderDetails = function(req, res, application) {
  
  const orderId = req.query.orderId
  const Order = application.app.models.Order
  Order.orderDetails(orderId, application, (error, result) => {
    if (error) {
      console.error(error)
      req.session.error = `Error trying get order details: ${error.sqlMessage}`
      res.redirect('/admin')
    } else {
      console.log(result)
      res.render('admin/order_details.ejs', {
        'user': req.session.user,
        'orderDetails': result
      })
    }
  })
  
}

