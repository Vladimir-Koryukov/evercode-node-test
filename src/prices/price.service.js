const currencyService = require('../currencies/currency.service');
const priceRepository = require('./price.repository');
const ValidationError = require('../errors/ValidationError');

async function getPricesByCurrency(currencyTicker) {
    if (!currencyTicker || typeof currencyTicker !== 'string' || currencyTicker.trim().length === 0) {
        throw new ValidationError('Currency query parameter should be string and is required', { 
            currency: currencyTicker,
        });
    }

    const normalizedCurrency = currencyTicker.trim().toUpperCase();

    await currencyService.getCurrencyByTicker(normalizedCurrency);

    return priceRepository.findByCurrencyTicker(normalizedCurrency);
}

module.exports = {
    getPricesByCurrency,
}