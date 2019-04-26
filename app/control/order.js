module.exports.all_orders = (req, res, application) => {
  const userId = req.session.user.id  
  const Order = application.app.models.Order
  var connect = application.config.connect()
  Order.getAll(userId, connect, (error, result) => {
    if (error) {
      connect.end()
      console.error(error.sqlMessage)
      req.session.error = `Error trying get all orders: ${error.sqlMessage}`
      res.redirect('/client_area')
    } else {
      console.log(result.length)
      res.render('order/all_orders.ejs', {
        'user': req.session.user,
        'allOrders': result
      })
    }
  }) 

}

module.exports.order_details = (req, res, application) => {

  const orderId = req.query.orderId 
  const Order = application.app.models.Order

  const pOrder = new Promise((resolve, reject) => {
    var connect = application.config.connect()
    Order.getThis(orderId, connect, (error, result) => {
      connect.end()
      
      if (error) {
        reject(error)        
      } else {
        resolve(result[0])        
      }
    })

  })

  pOrder.then((order) => {
    
   const Item = application.app.models.Item
   var connect = application.config.connect()
    Item.getAll(order.id, connect, (error, result) => {
      connect.end()

      if (error) {
        console.error(error.sqlMessage);
        req.session.error = `Error: ${error.sqlMessage}`;
        res.redirect('\client_area');
      } else {
        res.render('order/order_details.ejs', {
          'order': order,
          'user': req.session.user,
          'fixDate': require('../utils/utilsOrder').fixDate,
          'items': result,
        })
      }
    })    

  }).catch(error => {

    console.error(error.sqlMessage)
    req.session.error = `Error: ${error.sqlMessage}`
    res.redirect('\client_area')

  })
  
}

module.exports.pending_orders = function(req, res, application) {
  const Order = application.app.models.Order
  var connect = application.config.connect()
  Order.getPending(req.session.user.id, connect, (error, result) => {
    connect.end()
    if (error) {
      console.error(error.sqlMessage)
      req.session.error = `Error: ${error.sqlMessage}`
      res.redirect('\client_area')
    } else {
      res.render('order/pending_orders.ejs', {
        'user': req.session.user,
        'pendingOrders': result
      })
    }
  })
}

module.exports.received_orders = function(req, res, application) {
  const Order = application.app.models.Order
  var connect = application.config.connect()
  Order.getReceived(req.session.user.id, connect, (error, result) => {
    connect.end()
    if (error) {
      console.error(error.sqlMessage)
      req.session.error = `Error: ${error.sqlMessage}`
      res.redirect('\client_area')
    } else {
      res.render('order/received_orders.ejs', {
        'user': req.session.user,
        'receivedOrders': result
      })
    }
  })
}