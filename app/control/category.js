// helpers
function saveCategory(req, res, application) {
  var data = req.body;
  
  const Category = application.app.models.Category;
  var category = new Category(data.name);

  category.save(application, (err, result) => {
    if(err) {
      console.error(err.sqlMessage);
      req.session.error = `Error trying save the category: ${err.sqlMessage}`;
      res.redirect('\admin');
    } else {
      console.log(`Saved with id ${result['insertId']}`);
      req.session.message = 'Nova Categoria salva com sucesso!';
      res.redirect('\admin');
    }
  });
}
// end helpers

module.exports.new_category = (req, res, application) => {
  var msg = req.session.message;
  req.session.message = '';
  if (req.method == 'GET') {
    res.render('admin/category/new_category.ejs', {
      'user': req.session.user,
      'msg': msg
    });
  } else {
    saveCategory(req, res, application);    
  }
}

module.exports.show_categories = (req, res, application) => {
  application.app.models.Category.getAll(application, (err, result) => {
    if(err) {
      console.error(err.sqlMessage);
      req.session.error = `Error trying get all categories: ${err.sqlMessage}`;
      res.redirect('\admin');
    } else {
      res.render('admin/category/show_categories.ejs', {
        'categories': result,
        'user': req.session.user,
      });
    }
  });  
}

module.exports.category_details = (req, res, application) => {
  var msg = req.session.message;
  req.session.message = '';
  application.app.models.Category.getThis(req.query.idCategory, application, 
    (err, result) => {
    if(err) {
      console.error(`Error trying get this category: ${err.sqlMessage}`);
      req.session.error = `Error trying get this category: ${err.sqlMessage}`;
      res.redirect('\admin');
    } else {
      res.render('admin/category/category_details.ejs', {
        'category': result[0],
        'user': req.session.user,
      });
    }
  });  
}

module.exports.edit_category = (req, res, application) => {
  var data = req.body;
  const Category = application.app.models.Category;

  Category.edit(data, application,  
    (err, result) => {
    if(err) {
      console.error(err.sqlMessage);   
      req.session.error = `Error trying edit the category: ${err.sqlMessage}`;
      res.redirect('\admin');
    } else {
      console.log(result);
      req.session.message = 'Post editado com sucesso!';
      res.redirect('\admin');
    }
  });

}

module.exports.delete_category = (req, res, application) => {
  const categoryId = req.query.categoryId;
  const Category = application.app.models.Category;

  Category.doesHasProductAttached(categoryId, application, (errdhpa, result) => {
    if (errdhpa) {
      console.error(`Error verifying whether exists products 
      attached to the category: ${err.sqlMessage}`);
      req.session.error = `Error verifying whether exists products 
      attached to the category: ${err.sqlMessage}`;
      res.redirect('\admin');
    } else {
      if (Object.keys(result).length > 0) {
        console.log(result);
        req.session.message = `Você não pode deletar essa categoria porque existem 
        ${Object.keys(result).length} produtos ligados a ela!`;
        res.redirect('\admin');
      } else {
        delCategory();
      }
    }
  });

  function delCategory() {
    Category.delete(categoryId, application, (err, result) => {
      if(err) {
        console.error(`Error trying delete the category: ${err.sqlMessage}`);
        req.session.error = `Error trying delete the category: ${err.sqlMessage}`;
        res.redirect('\admin');
      } else {      
        console.log(result);
        req.session.message = 'Categoria deletada com sucesso!';
        res.redirect('\admin');
      }
    });
  }

}