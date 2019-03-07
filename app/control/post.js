module.exports.new_post = (req, res, application) => {
  if (req.method == 'GET') {
    res.render('admin/post/new_post.ejs', {
      'user': req.session.user
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
        req.send(err.sqlMessage);
      } else {
        console.log(`Saved with id ${result['insertId']}`);
        req.session.message = 'Novo post salvo com sucesso!';
        res.redirect('\admin');
      }
    });
  }
}