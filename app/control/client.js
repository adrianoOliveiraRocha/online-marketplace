module.exports.client_area = (req, res, application) => {
  var msg = req.session.message
  var error = req.session.error
  res.render('client_area/index.ejs', {
    'user': req.session.user,
    'msg': msg,
    'error': error
  })
}