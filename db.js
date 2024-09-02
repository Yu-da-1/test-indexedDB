const { open } = require('fake-indexeddb/lib/FDBFactory');
const { indexedDB, IDBKeyRange } = require('fake-indexeddb');
const { resolve } = require('path');

global.indexedDB = indexedDB;
global.IDBKeyRange = IDBKeyRange;

// IndexedDBのセットアップ
async function setupIndexedDB() {
    const request = indexedDB.open('keyStoreDB', 1);

    request.onupgradeneeded = function(event) {
        const db = event.target.result;
        db.createObjectStore('keys', { keyPash: 'id', autoIncrement: true});
    };

    return new Promise((resolve, reject) => {
        request.onsuccess = function(event) {
            resolve(event.target.result);
        };
        request.onerror = function(event) {
            reject(event.target.error)
        };
    });
}

async function saveKeyToIndexedDB(db, key) {
    const tx = db.transaction('keys', 'readwrite');
    const store = tx.objectStore('keys');
    await store.add({ key });
    await tx.done;
}

async function getKeyFromIndexedDB(db, id) {
    return new Promise((resolve, reject) => {
        const tx = db.transaction('keys', 'readonly');
        const store = tx.objectStore('keys');
        const request = store.get(id);
        
        request.onsuccess = function(event) {
            resolve(event.target.result);
        };

        request.onerror = function(event) {
            reject(event.target.error);
        };
    })
}

module.exports = { setupIndexedDB, saveKeyToIndexedDB, getKeyFromIndexedDB };