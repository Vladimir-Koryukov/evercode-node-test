const priceRepository = require('./price.repository');

const updatedAt = '2026-06-09T12:00:00.000Z';

describe('priceRepository', () => {
    beforeEach(async () => {
        await priceRepository.clear();
    });

    test('saves prices and finds them by currency ticker', async () => {
        await priceRepository.replaceAll([
            { symbol: 'BTCUSDT', price: '70000.00' },
            { symbol: 'ETHBTC', price: '0.03' },
            { symbol: 'ETHUSDT', price: '2100.00' },
        ], updatedAt);

        const prices = await priceRepository.findByCurrencyTicker('BTC');

        expect(prices).toEqual([
            { symbol: 'BTCUSDT', price: '70000.00' },
            { symbol: 'ETHBTC', price: '0.03' },
        ]);
    });

    test('replaces the previous price snapshot', async () => {
        await priceRepository.replaceAll([
            { symbol: 'BTCUSDT', price: '70000.00' },
        ], updatedAt);

        await priceRepository.replaceAll([
            { symbol: 'ETHUSDT', price: '2100.00' },
        ], updatedAt);

        expect(await priceRepository.findByCurrencyTicker('BTC')).toEqual([]);
        expect(await priceRepository.findByCurrencyTicker('ETH')).toEqual([
            { symbol: 'ETHUSDT', price: '2100.00' },
        ]);
    });

    test('keeps the previous snapshot when replacement fails', async () => {
        await priceRepository.replaceAll([
            { symbol: 'BTCUSDT', price: '70000.00' },
        ], updatedAt);

        await expect(priceRepository.replaceAll([
            { symbol: 'ETHUSDT', price: '2100.00' },
            { symbol: 'ETHUSDT', price: '2200.00' },
        ], updatedAt)).rejects.toThrow();

        expect(await priceRepository.findByCurrencyTicker('BTC')).toEqual([
            { symbol: 'BTCUSDT', price: '70000.00' },
        ]);
    });
});