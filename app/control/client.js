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
        response += parseFloat(product.price)
      })
      return response
    } else {
      return undefined
    }    
  }
  
}