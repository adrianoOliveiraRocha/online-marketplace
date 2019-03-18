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
    var category = new Category(data.name, imageName);

    category.save(application, (err, result) => {
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

module.exports.show_categories = (req, res, application) => {
  application.app.models.Category.getAll(application, (err, result) => {
    if(err) {
      console.error(err.sqlMessage);
      res.send(`Error: ${err.sqlMessage}`);
    } else {
      console.log(Object.values(result))
      res.render('admin/category/show_categories.ejs', {
        'categories': result,
        'user': req.session.user,
      });
    }
  });  
}

module.exports.details_category = (req, res, application) => {
  var msg = req.session.message;
  req.session.message = '';
  application.app.models.Category.getThis(req.query.id, application, (err, result) => {
    if(err) {
      console.error(`Error trying get this category: ${err.sqlMessage}`);
    } else {
      res.render('admin/category/detalhes_categoria.ejs', {
        'msg': msg,
        'category': result[0],
        'user': req.session.user,
      });
    }
  });  
}

module.exports.edit_category = (req, res, application) => {
  var data = req.body;
  var imageName = null;
  const Category = application.app.models.Category;

  if (Object.keys(req.files).length > 0) {// image sended
    const utilsCategory = require('./../utils/utilsCategory');
    utilsCategory.deleteOldeImage(Category, data.categoryId, application);      
    var imageName = utilsCategory.uploadImage(req.files.image);
  }

  Category.edit(data, imageName, application,  
    (err, result) => {
    if(err) {
      console.error(err.sqlMessage);      
      res.send(err.sqlMessage);
    } else {
      req.session.message = 'Post editado com sucesso!';
      res.redirect('\admin');
    }
  });

}