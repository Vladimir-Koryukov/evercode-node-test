const currencyService = require('../currencies/currency.service');
const binanceClient = require('../external/binance.client');
const ValidationError = require('../errors/ValidationError');

async function getPricesByCurrency(currencyTicker) {
    if (!currencyTicker || typeof currencyTicker !== 'string' || currencyTicker.trim().length === 0) {
        throw new ValidationError('Currency query parameter should be string and is required', { 
            currency: currencyTicker,
        });
    }

    const normalizedCurrency = currencyTicker.trim().toUpperCase();

    currencyService.getCurrencyByTicker(normalizedCurrency);

    const prices = await binanceClient.fetchBinancePrices();

    return prices.filter((price) => {
        return (
            typeof price.symbol === 'string' &&
            price.symbol.includes(normalizedCurrency)
        );
    });
}

module.exports = {
    getPricesByCurrency,
}