const express = require('express');
const authMiddleware = require('./middlewares/auth');
const errorHandler = require('./middlewares/errorHandler');

const app = express();

app.get('/status', (req, res) => {
    res.send('ok');
});

app.use(authMiddleware);

app.use(errorHandler);

module.exports = app;