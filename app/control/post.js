module.exports.new_post = (req, res, application) => {
  var msg = req.session.message;
  req.session.message = ''
  if (req.method == 'GET') {
    res.render('admin/post/new_post.ejs', {
      'user': req.session.user,
      'msg': msg
    });
  } else {
    var data = req.body;
    var imageName = null;
    if (Object.keys(req.files).length > 0) {// image sended
      let prefix = new Date().getTime() + '_';
      console.log(`prefix: ${prefix}`);
      imageName = prefix + req.files.image.name;
      console.log(`imageName: ${imageName}`);
      let image = req.files.image;
      image.mv(__dirname + '/../public/upload/' + imageName, (err) => {
        if (err) {
          return res.status(500).send(err);
        }
      });
    }

    const Post = application.app.models.Post;
    var post = new Post(data.title, data.text, imageName);
    post.save(application, (err, result) => {
      if(err) {
        res.send(err.sqlMessage);
      } else {
        console.log(`Saved with id ${result['insertId']}`);
        req.session.message = 'Novo post salvo com sucesso!';
        res.redirect('\admin');
      }
    });
  }
}

module.exports.show_posts = (req, res, application) => {
  application.app.models.Post.getAll(application, (err, result) => {
    if(err) {
      console.error(`Error: ${err}`);
    } else {
      res.render('admin/post/show_posts.ejs', {
        'user': req.session.user,
        'posts': result
      });
    }
  }); 
}

module.exports.details_post = (req, res, application) => {
  var msg = req.session.msg;
  req.session.msg = '';
  var idPost = req.query.id;
  application.app.models.Post.get(idPost, application, (err, result) => {
    if (err) {
      res.send(err.sqlMessage);
    } else {
      res.render('admin/post/detail.ejs', {
        'user': req.session.user,
        'post': result[0],
        'msg': msg
      });
    }
  });
}

module.exports.edit_post = (req, res, application) => {
  console.log(req.files.image.name);
  var data = req.body;
  var imageName = null;
  const Post = application.app.models.Post;

  if (Object.keys(req.files).length > 0) {// image sended
    let prefix = new Date().getTime() + '_';
    imageName = prefix + req.files.image.name;
    console.log(`imageName: ${imageName}`);
    let image = req.files.image;
    image.mv(__dirname + '/../public/upload/' + imageName, (err) => {
      if (err) {
        return res.status(500).send(err);
      } else { //delete the current image
        Post.changeImage(data.idPost, application, (err, result) => {
          if (err) {
            console.error(err.sqlMessage);
            res.send(`Oops! error getting image name of the database. Please contact the developer!`);
          } else {
            if (Object.keys(result).length == 0) {
              console.log(`No image to delete`);
            } else {
              let oldFile = __dirname + `/../public/upload/${result[0].image}`;
              const fs = require('fs');
              fs.unlink(oldFile, (errOldFile) => {
                if (errOldFile) {
                  console.log(`Error trying delete the file: ${errOldFile}`);
                } else {
                  console.error('Image deleted with success!');
                }
              }); 
            }
          }
        });
      }
    });
  }
  
  application.app.models.Post.editPost(data, imageName, application,  
    (err, result) => {
    if(err) {
      console.error(err.sqlMessage);      
      res.send(err.sqlMessage);
    } else {
      console.log(result);
      req.session.message = 'Post editado com sucesso!';
      res.redirect('\admin');
    }
  });
}
