module.exports.index = (req, res, application) => {
  var message = req.session.message;
  req.session.message = '';
  res.render('admin/index.ejs', {
    'msg': message
  });
}