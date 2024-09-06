# Test indexedDB and Cryptography API
Cryptography APIを使用して以下の実装を行なった。
- 鍵の生成
- 鍵の設定(以下の設定を行う)
   - 鍵に種類
   - 鍵をエクスポート可能かどうか
   - 鍵を使用して行える操作の種類  
以下設定例:
```
const keyPair = await crypto.subtle.generateKey(
        {
            name: "ECDSA",
            namedCurve: "P-256",
        },
        false,
        ["sign"]
    );
``` 
※ `publicKey`だけをエクスポート可能にすることも可
- 署名の生成
- 鍵の保存
- 署名の検証

試す方法:  
```shell
npx http-server .
```
出力例:
```
Available on:
  http://127.0.0.1:8080
  http://192.0.0.2:8080
```

ブラウザを開く。  
鍵を生成ボタン
```
Saved key with id: 1
Key saved to IndexedDB
PublicKey (exported, Base64): MFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAEdqpfWWJ2YbrE8dyATXRxL4Q2ql54JEUP47018hTYnrFg5qBi75kPVIyxoH4fX1RQNC4vT5jSqWihb/YdJ8RYeA==
```
署名の生成ボタン
```
IndexedDB get request success: {key: {…}, id: 1}
Used Public Key (Base64): MFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAEdqpfWWJ2YbrE8dyATXRxL4Q2ql54JEUP47018hTYnrFg5qBi75kPVIyxoH4fX1RQNC4vT5jSqWihb/YdJ8RYeA==
Signature (Base64): LJDD8En1X9AGuotfB3o+BdAbz5Xi+f6RMM7uUV8JjiLwnniNONrO8sIm1Ddeo2BLeu45Rths0dqH6PvscKlsNg==
```
署名の検証ボタン
```
Signature is valid: true
```

また、同じ鍵が使用されているかを試すには一度キャッシュを削除し、再度ブラウザでページを開く。  
そして再度署名ボタンを押すと、同じ鍵で署名の生成を試している事がわかる。
