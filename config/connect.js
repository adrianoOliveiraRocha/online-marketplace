var mysql = require('mysql');
var connect = function () {
  return mysql.createConnection({
    host: 'localhost',
    user: 'adriano',
    password: '453231',
    database: 'onlinemarketplace'
  });
}
module.exports = function () {
  return connect;
}