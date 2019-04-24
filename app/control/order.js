// helpers

// end helpers


module.exports.all_orders = (req, res, application) => {  

  const Order = application.app.models.Order
    Order.getAll(application, req.session.user, (error, result) => {
      if (error) {
        console.error(error.sqlMessage);
        req.session.error = `Error trying get all orders: ${error.sqlMessage}`;
        res.redirect('\client_area');
      } else {
        res.render('order/all_orders.ejs', {
          'allOrders': result,
          'user': req.session.user,
        })
      }
    })

}

module.exports.order_details = (req, res, application) => {

  const orderId = req.query.orderId 
  const Order = application.app.models.Order

  const pOrder = new Promise((resolve, reject) => {

    Order.getThis(orderId, application, (error, result) => {
      application.config.connect().end()
      
      if (error) {
        reject(error)        
      } else {
        resolve(result[0])        
      }
    })

  })

  pOrder.then((order) => {
    
   const Item = application.app.models.Item
    
    Item.getAll(order.id, application, (error, result) => {
      application.config.connect().end()

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
  Order.getPending(req.session.user.id, application, (error, result) => {
    application.config.connect().end()
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
  Order.getReceived(req.session.user.id, application, (error, result) => {
    application.config.connect().end()
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