module.exports = (application) => {

  application.get('/new_post', (req, res) => {
    application.app.control.post.new_post(req, res, application);
  });

  application.post('/new_post', (req, res) => {
    application.app.control.post.new_post(req, res, application);
  });

}