const mysql = require("mysql2");
require("dotenv").config();

const db = mysql
  .createConnection({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASS,
    database: process.env.MYSQL_DATABASE,
  })
  .promise();

module.exports = db;
