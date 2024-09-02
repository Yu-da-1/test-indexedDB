const readline = require('readline');
const { generateNonExtractableKey, generateSignature, saveGenerateKey, loadKeyFromDB } = require('./crypto');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

async function main() {
    try {
        // ECDSA鍵の生成
        const key = await generateNonExtractableKey();
        console.log('Success!');

        await saveGenerateKey(key);

        // メッセージの入力を促す
        rl.question('Enter message: ', async (message) => {
            try {
                //保存した鍵をindexedDBから取得
                const storedKey = await loadKeyFromDB(1);
                console.log('Key loaded from IndexedDB:', storedKey);

                // メッセージに対して署名を生成
                const signature = await generateSignature(storedKey.key, message);
                console.log('Signature:', Buffer.from(signature).toString('hex'));
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