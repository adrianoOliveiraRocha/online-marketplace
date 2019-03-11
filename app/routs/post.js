module.exports = (application) => {

  application.get('/new_post', (req, res) => {
    application.app.control.post.new_post(req, res, application);
  });

  application.post('/new_post', (req, res) => {
    application.app.control.post.new_post(req, res, application);
  });

  application.get('/show_posts', (req, res) => {
    application.app.control.post.show_posts(req, res, application);
  });

  application.get('/details_post', (req, res) => {
    application.app.control.post.details_post(req, res, application);
  });

  application.post('/edit_post', (req, res) => {
    application.app.control.post.edit_post(req, res, application);
  });

}