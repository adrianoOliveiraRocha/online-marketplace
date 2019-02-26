module.exports.index = (req, res, application) => {
  res.render('core/index.ejs');
}

module.exports.register = (req, res, application) => {
  res.render('core/login.ejs');
}