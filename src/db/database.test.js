const database = require('./database');

describe('database transactions', () => {
    test('executes concurrent transactions sequentially', async () => {
        const events = [];

        let releaseFirstTransaction;
        const firstTransactionCanFinish = new Promise((resolve) => {
            releaseFirstTransaction = resolve;
        });

        let markFirstTransactionStarted;
        const firstTransactionStarted = new Promise((resolve) => {
            markFirstTransactionStarted = resolve;
        });

        const firstTransaction = database.transaction(async () => {
            events.push('first started');
            markFirstTransactionStarted();

            await firstTransactionCanFinish;

            events.push('first finished');
        });

        await firstTransactionStarted;

        const secondTransaction = database.transaction(async () => {
            events.push('second started');
        });

        await Promise.resolve();

        expect(events).toEqual(['first started']);

        releaseFirstTransaction();

        await Promise.all([
            firstTransaction,
            secondTransaction,
        ]);

        expect(events).toEqual([
            'first started',
            'first finished',
            'second started',
        ]);
    });
});