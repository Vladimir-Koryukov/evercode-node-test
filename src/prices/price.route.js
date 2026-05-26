const express = require('express');
const priceService = require('./price.service');

const router = express.Router();

router.get('/price', async (req, res, next) => {
    try {
        const prices = await priceService.getPricesByCurrency(req.query.currency);
        res.json(prices);
    } catch (error) {
        next(error);
    }
});

module.exports = router;