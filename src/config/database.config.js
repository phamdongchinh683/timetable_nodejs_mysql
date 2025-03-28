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

const connectDB = async () => {
  try {
    const connection = await pool.getConnection();
    console.log("MySQL Connected!".green.bold);
    connection.release();
  } catch (err) {
    console.error(`MySQL Connection Failed: ${err.message}`.red.bold);
  }
};

const initConnect = pool.getConnection();

module.exports = { connectDB, pool, initConnect };
