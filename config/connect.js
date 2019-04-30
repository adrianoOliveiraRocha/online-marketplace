var mysql = require('mysql');

var connect = function () {
  return mysql.createPool({
    connectionLimit: 10,
    host: 'localhost',
    user: 'adriano',
    password: '453231',
    database: 'onlinemarketplace',
    multipleStatements: true,
  });
}

module.exports = function() {
  return connect
}