const currencyRepository = require('./currency.repository');
const { ValidationError, NotFoundError, ConflictError } = require('../errors');

function validateCurrencyData(data) {
    if (!data || typeof data.name !== 'string' || data.name.trim().length === 0) {
        throw new ValidationError('Currency name should be string and is required', { name: data && data.name });
    }
    
    if (!data || typeof data.ticker !== 'string' || data.ticker.trim().length === 0) {
        throw new ValidationError('Currency ticker should be string and is required', { ticker: data && data.ticker });
    }
}

function normalizeTicker(ticker) {
    return ticker.trim().toUpperCase();
}

async function getAllCurrencies() {
    return currencyRepository.findAll();
}

async function getCurrencyByTicker(ticker) {
    const normalizedTicker = normalizeTicker(ticker);
    const currency = await currencyRepository.findByTicker(normalizedTicker);

    if (!currency) {
        throw new NotFoundError('Currency is not found', { ticker: normalizedTicker });
    }

    return currency;
}

async function createCurrency(currency) {
    validateCurrencyData(currency);

    const normalizedCurrency = {
        name: currency.name.trim(),
        ticker: normalizeTicker(currency.ticker),
    };

    const existingCurrency = await currencyRepository.findByTicker(normalizedCurrency.ticker);

    if (existingCurrency) {
        throw new ConflictError('Currency already exist', { ticker: normalizedCurrency.ticker });
    }

    return currencyRepository.create(normalizedCurrency);
}

async function updateCurrency(ticker, newCurrency) {
    validateCurrencyData(newCurrency);

    const normalizedTicker = normalizeTicker(ticker);
    const normalizedCurrency = {
        name: newCurrency.name.trim(),
        ticker: normalizeTicker(newCurrency.ticker),
    };

    const updatedCurrency = await currencyRepository.update(normalizedTicker, normalizedCurrency);

    if (!updatedCurrency) {
        throw new NotFoundError('Currency is not found', { ticker: normalizedTicker });
    }

    return updatedCurrency;
}

async function deleteCurrency(ticker) {
    const normalizedTicker = normalizeTicker(ticker);
    const deletedCurrency = await currencyRepository.remove(normalizedTicker);

    if (!deletedCurrency) {
        throw new NotFoundError('Currency is not found', { ticker: normalizedTicker } );
    }
}

function clearAll() {
    return currencyRepository.clear();
}

module.exports = {
    getAllCurrencies,
    getCurrencyByTicker,
    createCurrency,
    updateCurrency,
    deleteCurrency,
    clearAll,
};