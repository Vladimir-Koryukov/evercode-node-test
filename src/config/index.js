require('dotenv').config();

const config = {
  appName: "SelectionTask",
  server: {
    port: 3001,
  },
  auth: {
    token: process.env.AUTHORIZATION_TOKEN,
  },
  scheduler: {
    defaultInterval: 10000,
  },
};

module.exports = config;
