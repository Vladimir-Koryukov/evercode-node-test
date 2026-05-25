const currencies = [];

function findAll() {
    return [...currencies];
}

function findByTicker(ticker) {
    return currencies.find((currency) => currency.ticker === ticker);
}

function create(currency) {
    currencies.push(currency);
    return currency;
}

function update(ticker, newCurrency) {
    const currency = findByTicker(ticker);

    if (!currency) {
        return null;
    }

    currency.name = newCurrency.name;
    currency.ticker = newCurrency.ticker;

    return currency;
}

function remove(ticker) {
    const index = currencies.findIndex((currency) => currency.ticker === ticker);

    if (index === -1) {
        return null;
    }

    currencies.splice(index, 1);
    return true;
}

function clear() {
    currencies.length = 0;
}

module.exports = {
    findAll,
    findByTicker,
    create,
    update,
    remove,
    clear,
};