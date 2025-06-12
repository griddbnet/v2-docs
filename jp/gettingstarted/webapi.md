## GridDB Web API Quickstart

GridDBをFIXED_LISTモード（これはデフォルトモードです！）で使用する場合は、web-apiの設定に以下の変更を加えてください。

```bash
$ cd /var/lib/gridstore/webapi/conf
$ sudo vim repository.json
```
旧
```bash
{
  "clusters" : [
    {
      "name" : "",
      "mode" : "MULTICAST",
      "address" : "239.0.0.1",
      "port" : 31999,
      "jdbcAddress" : "239.0.0.1",
      "jdbcPort" : 41999,
      "transactionMember": "",
      "sqlMember": "",
      "providerUrl": null
    }
  ]
}
```
更新後

```bash
{
  "clusters" : [
    {
      "name" : "myCluster",
      "mode" : "FIXED_LIST",
      "transactionMember": "127.0.0.1:10001",
      "sqlMember": "127.0.0.1:20001",
      "providerUrl": null
    }
  ]
}
```

次のコマンドでサービスを開始／停止できます。

例：

```bash
$ service griddb-webapi start
```

そして、

```
$ curl --location -I 'http://localhost:8081/griddb/v2/myCluster/dbs/public/checkConnection' \
--header 'Authorization: Basic YWRtaW46YWRtaW4='

HTTP/1.1 200 
Content-Length: 0
Date: Wed, 09 Apr 2025 16:37:44 GMT
```
ここで使用されているBasic認証の認証情報は、ユーザー名:パスワード の形式をBase64でエンコードしたものです。上記の例のようにデフォルトを使用する場合、値は admin:admin に設定してください。