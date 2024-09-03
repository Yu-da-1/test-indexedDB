// ECDSAの鍵をgenerateKeyモジュールを使って生成
const { error } = require("console");
const { setupIndexedDB, saveKeyToIndexedDB, getKeyFromIndexedDB } = require("./db");

// false or trueで非エクスポートするかどうかを設定可能
async function generateNonExtractableKey() {
    const keyPair = await crypto.subtle.generateKey(
        {
            name: "ECDSA",
            namedCurve: "P-256",
        },
        false,
        ["sign"]
    );
    const publicKey = await crypto.subtle.exportKey("spki", keyPair.publicKey);
    //console.log('PublicKey:', Buffer.from(publicKey).toString('hex'));
    return keyPair;
}

// 署名の生成
async function generateSignature(keyPair, data) {
    const encoder = new TextEncoder();
    const encodedData = encoder.encode(data);
    const signature = await crypto.subtle.sign(
        {
            name: "ECDSA",
            hash: { name: "SHA-256" },
        },
        keyPair.privateKey,
        encodedData
    );
    return signature;
}

// 鍵の保存
async function saveGenerateKey(key) {
    const db = await setupIndexedDB();
    await saveKeyToIndexedDB(db, key);
    console.log('Key saved to IndexedDB');
}

// 鍵の読み込み
async function loadKeyFromDB(id) {
    const db = await setupIndexedDB();
    const storedKey = await getKeyFromIndexedDB(db, id);
    //console.log('Key loaded from IndexedDB:', storedKey);
    return storedKey;
}

// 署名の検証
async function verifySignature(exportedPublicKey, signature, message) {
    try {
        // publickeyのインポート
        const importPublicKey = await crypto.subtle.importKey(
            "spki",
            exportedPublicKey,
            {
                name: "ECDSA",
                namedCurve: "P-256"
            },
            true,
            ["verify"]
        );

        //署名を検証
        const isValid = await crypto.subtle.verify(
            {
                name: "ECDSA",
                hash: {name: "SHA-256"},
            },
            importPublicKey,
            signature,
            new TextEncoder().encode(message)
        );
        return isValid;
    } catch (error) {
        console.error('署名の検証中にエラー:', error);
        throw error;
    }
}

module.exports = {generateNonExtractableKey, generateSignature, saveGenerateKey, loadKeyFromDB, verifySignature };