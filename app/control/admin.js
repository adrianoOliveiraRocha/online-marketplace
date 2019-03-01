module.exports.index = (req, res, application) => {
  var message = req.session.message;
  req.session.message = '';
  res.render('admin/index.ejs', {
    'msg': message,
    'user': req.session.user
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
      'msg': ''      
    });
  } else {
    var data = req.body;
    const User = application.app.models.User;
    User.update(req.session.user, data, application, (error, result) => {
      if (error) {
        res.send(error.sqlMessage);
      } else {
        res.send(result[0]);
      }
    });
  }  
}