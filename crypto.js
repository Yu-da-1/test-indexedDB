// ECDSAの鍵をgenerateKeyモジュールを使って生成
// false or trueで非エクスポートするかどうかを設定可能
// todo: 任意の鍵をNon-exportableにする実装
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
    console.log('PublicKey:', Buffer.from(publicKey).toString('hex'));
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

module.exports = {generateNonExtractableKey, generateSignature };