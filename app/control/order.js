module.exports.all_orders = (req, res, application) => {  

  const Order = application.app.models.Order
    Order.getAll(application, req.session.user, (error, result) => {
      if (error) {
        console.error(error.sqlMessage);
        req.session.error = `Error trying get all orders: ${error.sqlMessage}`;
        res.redirect('\client_area');
      } else {
        res.render('order/all_orders.ejs', {
          'allRequests': result,
          'user': req.session.user,
        })
      }
    })

}

module.exports.order_details = (req, res, application) => {

  const ordertId = req.query.orderId 
  const Order = application.app.models.Order
  Order.getThis(ordertId, application, (error, result) => {
    if (error) {
      console.error(error.sqlMessage);
      req.session.error = `Error trying get the order: ${error.sqlMessage}`;
      res.redirect('\client_area');
    } else {
      res.render('order/order_details.ejs', {
        'order': result,
        'user': req.session.user
      }) 
    }
  })
  
}