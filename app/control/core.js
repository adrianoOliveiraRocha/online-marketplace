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
  if(req.session.loged) {
    req.session.message = `Você está logado(a) como ${req.session.user.email}`;
    res.redirect('/admin');
  } else {
    if (req.method == 'GET') {
      res.render('core/login.ejs', {
        'msg': message
      });
    } else {
      console.log(`req.body: ${req.body}`)
      const User = application.app.models.User;
      User.verify(req.body, application, (error, result) => {
        if (error) {
          console.error(`Error verifing: ${error.sqlMessage}`);
          message = 'Não encontrado';
          res.render('core/login.ejs', {
            'msg': message
          });
        } else { 
          if(Object.keys(result).length > 0) {
            console.log(`result[0]: ${result[0]}`);
            req.session.user = result[0];
            req.session.message = `Você está logado(a) como ${req.session.user.email}`;
            req.session.loged = true;
            res.redirect('/admin');
          } else {
            res.render('error404/index', {
              'msg': 'Usuário não encontrado!'
            });
          }          
        }
      });   
    }

  }

}