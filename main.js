const readline = require('readline');
const { generateNonExtractableKey, generateSignature, saveGenerateKey, loadKeyFromDB, verifySignature } = require('./crypto');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

async function main() {
    try {
        // ECDSA鍵の生成
        const keyPair = await generateNonExtractableKey();
        console.log('Success!');

        await saveGenerateKey(keyPair);

        //公開鍵をエクスポート
        const exportedPublicKey = await crypto.subtle.exportKey("spki", keyPair.publicKey);
        console.log('PublicKey (exported:', Buffer.from(exportedPublicKey).toString('hex'));

        // メッセージの入力を促す
        rl.question('Enter message: ', async (message) => {
            try {
                //保存した鍵をindexedDBから取得
                const storedKey = await loadKeyFromDB(1);
                //console.log('Key loaded from IndexedDB:', storedKey);

                // メッセージに対して署名を生成
                const signature = await generateSignature(storedKey.key, message);
                console.log('Signature:', Buffer.from(signature).toString('hex'));

                // 署名の検証
                const isValid = await verifySignature(exportedPublicKey, signature, message);
                console.log('Signature is valid:', isValid);
            } catch (error) {
                console.error('署名の生成中にエラー:', error);
            } finally {
                rl.close();
            }
        });
    } catch (error) {
        console.error('鍵の生成中にエラー:', error);
    }
}

main();