module.exports.client_area = (req, res, application) => {
  var msg = req.session.message
  var error = req.session.error
  if (typeof req.session.cart != 'undefined') { // exists a cart
    var cart = getProducts()
  } else { // the cart don't exists
    res.render('client_area/index.ejs', {
      'user': req.session.user,
      'msg': msg,
      'error': error,
    })
  }
  
}