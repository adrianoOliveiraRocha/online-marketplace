// helpers 
function editProfile(req, res, application) {
  var data = req.body;
  var imageName = null;
  const User = application.app.models.User;

  if (Object.keys(req.files).length > 0) {// image sended
    const helper = require('./../utils/helper');
    helper.deleteOldeImage(User, data.userId, application);      
    imageName = helper.uploadImage(req.files.image);
  }

  User.update(req.session.user, data, application, imageName, 
    (error, result) => {
    if (error) {
      res.send(error.sqlMessage);
    } else {
      console.log(result);
      updateSession();        
    }
  });

  function updateSession() {
    User.getThis(req.session.user.id, application, (err, result) => {
      if (err) {
        console.error(err.sqlMessage);
      } else {
        console.log(result);
        req.session.user = result[0];
        req.session.message = 'Atualizado com sucesso!';
        res.redirect('\admin');
      }
    });
  }  
}
// end helpers 

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
    editProfile(req, res, application);    
  }  
}

