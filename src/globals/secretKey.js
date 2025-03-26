require("dotenv").config();
const _tokenSecret = process.env.ACCESS_TOKEN_SECRET;
const _tokenLife = process.env.ACCESS_TOKEN_LIFE;
const _dbHost = process.env.DB_URL;
const _dbName = process.env.DB_NAME;
const _dbUsername = process.env.DB_USERNAME;
const _dbPassword = process.env.DB_PASSWORD;
const _dbPort = process.env.DB_PORT;

module.exports = {
  _dbPort,
  _tokenLife,
  _tokenSecret,
  _dbHost,
  _dbName,
  _dbUsername,
  _dbPassword,
};
