require('dotenv').config();

const config = {
  appName: "SelectionTask",
  server: {
    port: 3001,
  },
  database: {
    path: process.env.DATABASE_PATH || './database/app.db',
  },
  auth: {
    token: process.env.AUTHORIZATION_TOKEN,
  },
  scheduler: {
    defaultInterval: 10000,
  },
};

module.exports = config;
