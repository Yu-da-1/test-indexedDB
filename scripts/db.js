export async function setupIndexedDB() {
    const request = indexedDB.open('keyStoreDB', 1);

    request.onupgradeneeded = function(event) {
        const db = event.target.result;
        db.createObjectStore('keys', { keyPath: 'id', autoIncrement: true});
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

export async function saveKeyToIndexedDB(db, key) {
    const tx = db.transaction('keys', 'readwrite');
    const store = tx.objectStore('keys');
    const id = await new Promise((resolve, reject) => {
        const request = store.add({ key });
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });

    return new Promise((resolve, reject) => {
        tx.oncomplete = () => {
            console.log('Saved key with id:', id);
            resolve(id);
        };
        tx.onerror = () => reject(tx.error);
    });
}

export async function getKeyFromIndexedDB(db, id) {
        const tx = db.transaction('keys', 'readonly');
        const store = tx.objectStore('keys');
        
        const key = await new Promise((resolve, reject) => {
            const request = store.get(id);
            request.onsuccess = () => {
                console.log('IndexedDB get request success:', request.result);
                resolve(request.result);
            };
            request.onerror = () => {
                console.error('IndexedDB get request error:', request.error);
                reject(request.error);
            };
        });
        await tx.done;
        return key;
    }