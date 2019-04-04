module.exports.index = (req, res, application) => {
  var message = req.session.message;
  req.session.message = '';
  res.render('core/index.ejs', {
    'msg': message
  });
}

module.exports.login = (req, res, application) => {
  var msg = req.session.message
  var error = req.session.error
  req.session.message = ''
  req.session.error = ''

  if(req.session.loged) { // loged

    if (req.session.user.admin == 1) { // it is admin
      req.session.message = `Você está logado(a) como ${req.session.user.email}`;
      res.redirect('/admin'); 
    } else { // it is not admin
      let msg = `I am not a admin ${req.session.user}`
      res.send(msg)
    }    

  } else { // not loged

    if (req.method == 'GET') {
      res.render('core/login.ejs', {
        'msg': msg,
        'error': error
      });
    } else {         
      post()
    }

  }

  function post() {
    const User = application.app.models.User;
    User.verify(req.body, application, (error, result) => {
      if (error) {
        console.error(error.sqlMessage);
        req.session.error = `Error trying verify user: ${error.sqlMessage}`;
        res.redirect(req.originalUrl);
      } else { 
        if(Object.keys(result).length > 0) {

          console.log(`result[0]: ${result[0]}`);
          req.session.user = result[0];
          req.session.message = `Você está logado(a) como ${req.session.user.email}`;
          req.session.loged = true;

          if (req.session.user.admin == 1) {
            res.redirect('/admin')  
          } else {
            let msg = `I am not a admin ${req.session.user}`
            res.send(msg)
          }          
        } else {
          res.render('error404/index', {
            'msg': 'Usuário não encontrado!'
          });
        }          
      }
    });
  }

}

module.exports.register = (req, res, application) => {
  
  var msg = req.session.message
  req.session.message = ''
  var error = req.session.error
  req.session.error = ''
  if (req.method == 'GET') {
    res.render('core/register.ejs', {
      'msg': msg,
      'error': error
    })
  } else {
    var data = req.body;
    var imageName = 'null';
    if (Object.keys(req.files).length > 0) {// image sended
      const helper = require('./../utils/helper')
      imageName = helper.uploadImage(req.files.image, 'user')
    }

    const Client = application.app.models.Client
    var client = new Client(data, imageName)
    
    client.createUser(application, (errorUser, resultUser) => {
      if (errorUser) {
        console.error(errorUser.sqlMessage);
        req.session.error = `Error trying save a new user: ${errorUser.sqlMessage}`;
        res.redirect(req.originalUrl);
      } else {
        createClient(resultUser['insertId'])
      }
    })
    
    function createClient(userId) {
      client.createClient(userId, application, (errorClient, resultClient) => {
        if (errorClient) {
          console.error(errorClient.sqlMessage);
          req.session.error = `Error trying save a new client: ${errorClient.sqlMessage}`;
          res.redirect(req.originalUrl);
        } else {
          console.log(`Saved with id ${resultClient['insertId']}`);
          req.session.message = 'Conta criada com sucesso! Agora você pode fazer login!';
          res.redirect('\login');
        }
      })
    }

  }
}