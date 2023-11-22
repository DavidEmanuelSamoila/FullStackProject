const mysql = require('mysql');
const debug = require('debug')('database');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'royal', //
  password: 'royal', //
  database: 'royal'
});

connection.connect((err) => {
  if (err) {
    debug(err);
    return;
  }
  debug('Database connected');
});

module.exports = connection;