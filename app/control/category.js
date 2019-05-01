// helpers
function saveCategory(req, res, application) {
  var data = req.body;
  
  const Category = application.app.models.Category;
  var category = new Category(data.name);
  var connect = application.config.connect()
  category.save(connect, (err, result) => {
    connect.end()
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
  var connect = application.config.connect()
  application.app.models.Category.getAll(connect, (err, result) => {
    connect.end()
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
  var connect = application.config.connect()
  application.app.models.Category.getThis(req.query.idCategory, connect, 
    (err, result) => {
    connect.end()
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
  var connect = application.config.connect()
  Category.edit(data, connect,  
    (err, result) => {
    connect.end()
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
  var connect = application.config.connect()

  function verifyProductAttached() {
    return new Promise((resolve, reject) => {      
      Category.doesHasProductAttached(categoryId, connect, (error, result) => {
        if (error) {
          reject(error.sqlMessage)
        } else {
          var quantityProducts = Object.keys(result).length
          var response = {}
          if (quantityProducts > 0) {// I cannot delete
            response.canDelete = false
            response.quantityProducts = quantityProducts
          } else {// I can delete
            response.canDelete = true            
          }
          resolve(response)
        }          
      })
    })
  }

  verifyProductAttached()
  .then(response => {
    if (response.canDelete) {
      Category.delete(categoryId, connect, (error, result) => {
        if(error) {
          throw new Error(
            `Erro tentando deletar a categoria. 
            por favor, entre em contato com o desenvolvedor`)
        } else {      
          console.log(result)
          req.session.message = 'Categoria deletada com sucesso!'
          res.redirect('\admin')
        }
      })
    } else {
      throw new Error(
        `Existem ${response.quantityProducts} produtos(s) nessa categoria. 
        Por isso, ela não pode ser deletada`)
    }   
  })
  .catch(error => {
    console.error(`Error trying delete the category: ${error}`);
    req.session.error = `${error}`
    res.redirect('\admin')
  })
  
}