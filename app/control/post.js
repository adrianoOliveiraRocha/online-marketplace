module.exports.new_post = (req, res, application) => {
  if (req.method == 'GET') {
    res.render('admin/post/new_post.ejs', {
      'user': req.session.user
    });
  } else {
    var data = req.body;
    var imageName = null;

    if (Object.keys(req.files).length > 0) {// image sended
      let prefix = new Data().getTime() + '_';
      imageName = prefix + req.files.image.name;
      let image = req.files.image;
      image.mv(__dirname + '/../public/upload/' + imageName, (err) => {
        if (err) {
          return res.status(500).send(err);
        }
      });
    }
    const Post = application.app.models.Post;
  }
}