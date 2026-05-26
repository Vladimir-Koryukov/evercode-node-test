const { ExternalApiError } = require('../errors');

const BINANCE_PRICE_URL = 'https://api.binance.com/api/v3/ticker/price';

function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchBinancePrices(options = {}) {
    const retries = options.retries || 3;
    const retryDelayMs = options.retryDelayMs || 300;

    for (let attempt = 1; attempt <= retries; attempt++) {
        try {
            const response = await fetch(BINANCE_PRICE_URL);

            if (!response.ok) {
                throw new ExternalApiError('Binance Api return error', {
                    status: response.status,
                });
            }

            const data = await response.json();

            if (!Array.isArray(data)) {
                throw new ExternalApiError('Invalid Binance API responce');
            }

            return data;
        } catch (error) {
            if (attempt >= retries) {
                if (error instanceof ExternalApiError) {
                    throw error;
                }

                throw new ExternalApiError('Failed to fetch prices from Binance', {
                    originalError: error.message,
                });
            }

            await sleep(retryDelayMs);
        }
    }
}

module.exports = {
    fetchBinancePrices,
};