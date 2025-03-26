require("colors");
const mysql = require("mysql2/promise");
const {
  _dbName,
  _dbHost,
  _dbUsername,
  _dbPassword,
  _dbPort,
} = require("../globals/secretKey");

const pool = mysql.createPool({
  host: _dbHost,
  port: _dbPort,
  user: _dbUsername,
  password: _dbPassword,
  database: _dbName,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

const connectDB = () => {
  pool.getConnection((err, connection) => {
    if (err) {
      console.error(`MySQL Connection Failed: ${err.message}`.red.bold);
    } else {
      console.log("MySQL Connected!".green.bold);
      connection.release();
    }
  });
};

module.exports = { connectDB, pool };
