const { openDB } = require('idb');

// IndexedDBのセットアップ
async function setupIndexedDB() {
    const db = await openDB('keyStore', 1, {
        upgrade(db) {
            db.createObjectStore('signatures', {keyPath: 'id', autoIncrement: true});
        }
    });
    return db;
}

module.exports = { setupIndexedDB };