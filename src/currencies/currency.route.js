const express = require('express');
const currencyService = require('./currency.service');

const router = express.Router();

router.get('/currencies', async (req, res, next) => {
    try {
        const currencies = await currencyService.getAllCurrencies();
        res.json(currencies);
    } catch (error) {
        next(error);
    }
})

router.get('/currencies/:ticker', async (req, res, next) => {
    try {
        const currency = await currencyService.getCurrencyByTicker(req.params.ticker);
        res.json(currency);
    } catch (error) {
        next(error);
    }
})

router.post('/currencies', async (req, res, next) => {
    try {
        const currency = await currencyService.createCurrency(req.body);
        res.status(201).json(currency);
    } catch (error) {
        next(error);
    }
})

router.put('/currencies/:ticker', async (req, res, next) => {
    try {
        const currency = await currencyService.updateCurrency(req.params.ticker, req.body);
        res.json(currency);
    } catch (error) {
        next(error);
    }
})

router.delete('/currencies/:ticker', async (req, res, next) => {
    try {
        await currencyService.deleteCurrency(req.params.ticker);
        res.status(204).send();
    } catch (error) {
        next(error);
    }
})

module.exports = router;