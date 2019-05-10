var express = require('express');
var fileUpload = require('express-fileupload');
var consign = require('consign');
var bodyParser = require('body-parser');
var expressValidator = require('express-validator');
var expressSession = require('express-session');
var MySQLStore = require('express-mysql-session')(expressSession);
var options = {
  host: 'localhost',
  port: 3306,
  user: 'adriano',
  password: '453231',
  database: 'onlinemarketplace',
  createDatabaseTable: true,
  endConnectionOnClose: true,
  clearExpired: true,
  schema: {
    tableName: 'sessions',
    columnNames: {
      session_id: 'session_id',
      expires: 'expires',
      data: 'data'
    }
  }
};
var sessionStore = new MySQLStore(options);
var app = express();
app.use(fileUpload());
app.set('view engine', 'ejs'); // Define the template engine
// Atention! This module is called in app.js. Then, take care with the address
//of directory views
app.set('views', './app/views'); // Define where is the views
// app.use(cookieParser());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(expressValidator());
app.use(express.static('./app/public'));
app.use('/upload', express.static('./app/public/upload'));
app.use(expressSession({
  cookieName: 'expressSession',
  secret: 'weareprogrammers-frombrazil-thatisweareit',
  store: sessionStore,
  resave: false,
  rolling: true,
  saveUninitialized: true,
  cookie: {},
  unset: 'keep',
}));
if (app.get('env') === 'production') {
  app.set('trust proxy', 1) // trust first proxy
  expressSession.cookie.secure = true;
}
consign()
  .include('app/routs')
  .then('config/connect.js') //you must put the extension
  .then('app/models')
  .then('app/control')
  .then('app/utils')
  .into(app);

module.exports = app;