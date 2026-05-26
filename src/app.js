const express = require('express');
const authMiddleware = require('./middlewares/auth');
const currencyRoutes = require('./currencies/currency.route');
const priceRoutes = require('./prices/price.route');
const errorHandler = require('./middlewares/errorHandler');

const app = express();

app.get('/status', (req, res) => {
    res.send('ok');
});

app.use(express.json());

app.use(authMiddleware);

app.use(currencyRoutes);

app.use(priceRoutes);

app.use(errorHandler);

module.exports = app;