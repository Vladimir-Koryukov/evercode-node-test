const currencyService = require('../currencies/currency.service');
const binanceClient = require('../external/binance.client');
const priceRepository = require('./price.repository');

function isRelevantPrice(price, tickers) {
    if (
        !price ||
        typeof price.symbol !== 'string' ||
        typeof price.price !== 'string'
    ) {
        return false;
    }

    return tickers.some((ticker) => price.symbol.includes(ticker));
}

async function synchronizePrices() {
    const currencies = await currencyService.getAllCurrencies();
    const tickers = currencies.map((currency) => currency.ticker);

    if (tickers.length === 0) {
        await priceRepository.replaceAll([], new Date().toISOString());
        return 0;
    }

    const binancePrices = await binanceClient.fetchBinancePrices();

    const relevantPrices = binancePrices.filter((price) => {
        return isRelevantPrice(price, tickers);
    });

    await priceRepository.replaceAll(
        relevantPrices,
        new Date().toISOString(),
    );

    return relevantPrices.length;
}

module.exports = {
    synchronizePrices,
};