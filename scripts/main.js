import { generateNonExtractableKey, generateSignature, saveGenerateKey, loadKeyFromDB, verifySignature } from './crypto.js';

// 鍵生成ボタン
document.getElementById('generateKey').addEventListener('click', async () => {
    const keyPair = await generateNonExtractableKey();
    await saveGenerateKey(keyPair);
    const exportedPublicKey = await crypto.subtle.exportKey("spki", keyPair.publicKey);
    const publicKeyBase64 = btoa(String.fromCharCode(...new Uint8Array(exportedPublicKey)));
    console.log('PublicKey (exported, Base64):', publicKeyBase64);

    localStorage.setItem('publicKey', publicKeyBase64);
});

// 署名生成ボタン
document.getElementById('signMessage').addEventListener('click', async () => {
    const message = prompt("Enter message to sign:");
    const storedKey = await loadKeyFromDB(1);  // IndexedDBから鍵を読み込む
    const signature = await generateSignature(storedKey.key, message);

    const exportedPublicKey = await crypto.subtle.exportKey("spki", storedKey.key.publicKey);
    const publicKeyBase64 = btoa(String.fromCharCode(...new Uint8Array(exportedPublicKey)));
    console.log('Used Public Key (Base64):', publicKeyBase64);

    // 署名をBase64にエンコードして保存
    const signatureBase64 = btoa(String.fromCharCode(...new Uint8Array(signature)));
    localStorage.setItem('signature', signatureBase64);
    console.log('Signature (Base64):', signatureBase64);
});

// 署名検証ボタン
document.getElementById('verifySignature').addEventListener('click', async () => {
    const message = prompt("Enter message to verify:");
    const signatureBase64 = localStorage.getItem('signature');
    const exportedPublicKeyBase64 = localStorage.getItem('publicKey');

    if (signatureBase64 && exportedPublicKeyBase64) {
        // Base64からUint8Arrayにデコード
        const signature = new Uint8Array(atob(signatureBase64).split("").map(c => c.charCodeAt(0)));
        const exportedPublicKey = new Uint8Array(atob(exportedPublicKeyBase64).split("").map(c => c.charCodeAt(0)));

        // 署名を検証
        const isValid = await verifySignature(exportedPublicKey, signature, message);
        console.log('Signature is valid:', isValid);
    } else {
        console.error("No signature or public key found.");
    }
});