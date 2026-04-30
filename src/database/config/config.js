require('dotenv').config();

module.exports = {
  development: {
    username: process.env.DB_USERNAME?.trim(),
    password: process.env.DB_PASSWORD?.trim(),
    database: process.env.DB_NAME?.trim(),
    host: process.env.DB_HOST?.trim(),
    port: +process.env.DB_PORT,
    dialect: 'postgres'
  },
  production: {
    username: process.env.DB_USERNAME?.trim(),
    password: process.env.DB_PASSWORD?.trim(),
    database: process.env.DB_NAME?.trim(),
    host: process.env.DB_HOST?.trim(),
    port: +process.env.DB_PORT,
    dialect: 'postgres'
  }
};
