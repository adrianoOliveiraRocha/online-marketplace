module.exports.new_category = (req, res, application) => {
  var msg = req.session.message;
  req.session.message = '';
  if (req.method == 'GET') {
    res.render('admin/category/new_category.ejs', {
      'user': req.session.user,
      'msg': msg
    });
  } else {
    var data = req.body;
    var imageName = null;
    if (Object.keys(req.files).length > 0) {// image sended
      const utilsCategory = require('./../utils/utilsCategory');
      var imageName = utilsCategory.uploadImage(req.files.image);
    }

    const Category = application.app.models.Category;
    console.log(Category);
    var category = new Category(data.name, imageName);

    category.save(data, application, (err, result) => {
      if(err) {
        console.error(err.sqlMessage);
        res.send('Error trying save the category!');
      } else {
        console.log(`Saved with id ${result['insertId']}`);
        req.session.message = 'Nova Categoria salva com sucesso!';
        res.redirect('\admin');
      }
    });


  }
}