const express = require('express');
const currencyService = require('./currency.service');

const router = express.Router();

router.get('/currencies', (req, res) => {
    res.json(currencyService.getAllCurrencies());
})

router.get('/currencies/:ticker', (req, res, next) => {
    try {
        res.json(currencyService.getCurrencyByTicker(req.params.ticker));
    } catch (error) {
        next(error);
    }
})

router.post('/currencies', (req, res, next) => {
    try {
        const currency = currencyService.createCurrency(req.body);
        res.status(201).json(currency);
    } catch (error) {
        next(error);
    }
})

router.put('/currencies/:ticker', (req, res, next) => {
    try {
        const currency = currencyService.updateCurrency(req.params.ticker, req.body);
        res.json(currency);
    } catch (error) {
        next(error);
    }
})

router.delete('/currencies/:ticker', (req, res, next) => {
    try {
        currencyService.deleteCurrency(req.params.ticker);
        res.status(204).send();
    } catch (error) {
        next(error);
    }
})

module.exports = router;