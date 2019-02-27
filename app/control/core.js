module.exports.index = (req, res, application) => {
  var message = req.session.message;
  req.session.message = '';
  res.render('core/index.ejs', {
    'msg': message
  });
}

module.exports.login = (req, res, application) => {
  var message = req.session.message;
  req.session.message = '';
  if (req.method == 'GET') {
    res.render('core/login.ejs');
  } else {
    if (req.session.loged) {
      res.send('loged');
    } else {
      const User = application.app.models.User;
      User.verify(req.body, application, (error, result) => {
        if (error) {
          console.error(error.sqlMessage);
          message = 'Não encontrado';
          res.render('core/login.ejs', {
            'msg': message
          });
        } else {
          req.session.email = req.body.email;
          req.session.password = req.body.password;
          req.session.message = `Bem vindo/a ${req.session.email}`;
          res.redirect('/');
        }
      });  
    }
             
  }

}