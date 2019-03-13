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
      const postUtils = require('./../utils/postUtils');
      var imageName = postUtils.uploadImage(req.files.image);
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
  var data = req.body;
  var imageName = null;
  const Post = application.app.models.Post;

  if (Object.keys(req.files).length > 0) {// image sended
    const postUtils = require('./../utils/postUtils');
    postUtils.deleteOldeImage(Post, data.idPost, application);      
    var imageName = postUtils.uploadImage(req.files.image);
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

module.exports.delete_post = (req, res, application) => {
  const Post = application.app.models.Post;
  const postUtils = require('./../utils/postUtils');
  postUtils.deleteOldeImage(Post, req.query.postId, application);
  Post.deletePost(req.query.postId, application, (err, result) => {
    if (err) {
      console.error(err);
    } else {
      console.log(`
          Post deleted
          affected rows: ${result.affectedRows}
        `);
    }
  });
  req.session.message = 'Post deletado com sucesso!';
  res.redirect('\admin');
}
