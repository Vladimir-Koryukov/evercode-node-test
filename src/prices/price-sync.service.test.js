const currencyService = require('../currencies/currency.service');
const priceRepository = require('./price.repository');
const priceSyncService = require('./price-sync.service');

describe('priceSyncService', () => {
    beforeEach(async () => {
        await currencyService.clearAll();
        await priceRepository.clear();

        global.fetch = jest.fn().mockResolvedValue({
            ok: true,
            json: async () => [
                { symbol: 'BTCUSDT', price: '70000.00' },
                { symbol: 'ETHBTC', price: '0.03' },
                { symbol: 'ETHUSDT', price: '2100.00' },
                { symbol: 'INVALID' },
                null,
            ],
        });
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    test('saves Binance prices related to stored currencies', async () => {
        await currencyService.createCurrency({
            name: 'Bitcoin',
            ticker: 'BTC',
        });

        const savedPriceCount = await priceSyncService.synchronizePrices();

        expect(savedPriceCount).toBe(2);
        expect(await priceRepository.findByCurrencyTicker('BTC')).toEqual([
            { symbol: 'BTCUSDT', price: '70000.00' },
            { symbol: 'ETHBTC', price: '0.03' },
        ]);
    });

    test('clears saved prices without requesting Binance when currencies are empty', async () => {
        await priceRepository.replaceAll([
            { symbol: 'BTCUSDT', price: '70000.00' },
        ], new Date().toISOString());

        const savedPriceCount = await priceSyncService.synchronizePrices();

        expect(savedPriceCount).toBe(0);
        expect(global.fetch).not.toHaveBeenCalled();
        expect(await priceRepository.findByCurrencyTicker('BTC')).toEqual([]);
    });
});