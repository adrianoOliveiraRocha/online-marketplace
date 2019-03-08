module.exports.new_post = (req, res, application) => {
  if (req.method == 'GET') {
    res.render('admin/post/new_post.ejs', {
      'user': req.session.user
    });
  } else {
    var data = req.body;
    res.send(data);
    // var imageName = null;
    // if (Object.keys(req.files).length > 0) {// image sended
    //   let prefix = new Date().getTime() + '_';
    //   console.log(`prefix: ${prefix}`);
    //   imageName = prefix + req.files.image.name;
    //   console.log(`imageName: ${imageName}`);
    //   let image = req.files.image;
    //   image.mv(__dirname + '/../public/upload/' + imageName, (err) => {
    //     if (err) {
    //       return res.status(500).send(err);
    //     }
    //   });
    // }

    // const Post = application.app.models.Post;
    // var post = new Post(data.title, data.text, imageName);
    // post.save(application, (err, result) => {
    //   if(err) {
    //     res.send(err.sqlMessage);
    //   } else {
    //     console.log(`Saved with id ${result['insertId']}`);
    //     req.session.message = 'Novo post salvo com sucesso!';
    //     res.redirect('\admin');
    //   }
    // });

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
  var idPost = req.query.id;
  application.app.models.Post.get(idPost, application, (err, result) => {
    if (err) {
      res.send(err.sqlMessage);
    } else {
      res.render('admin/post/detail.ejs', {
        'user': req.session.user,
        'post': result[0]
      });
    }
  });
}