const fs = require('fs');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const config = require('../config');

const databasePath = config.database.path;
const databaseDir = path.dirname(databasePath);

fs.mkdirSync(databaseDir, { recursive: true });

const db = new sqlite3.Database(databasePath);

db.serialize(() => {
    db.run(`
        CREATE TABLE IF NOT EXISTS currencies(
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            ticker TEXT NOT NULL UNIQUE,
            name TEXT NOT NULL
        )        
    `);
});

db.close((error) => {
    if (error) {
        console.log('Failed to close database connection', error.message);
        process.exit(1);
    }

    console.log('Database initialized successfully');
});