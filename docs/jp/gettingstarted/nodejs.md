# Node.JS

[Driver](http://griddb.org/nodejs_client/NodejsAPIReference.htm)





## インストール
GridDB c_client（Nodejsパッケージを使用するための前提条件）は次の場所にあります ：[https://github.com/griddb/c_client](https://github.com/griddb/c_client) 。 Node.jsパッケージと同様に、c_clientのインストールも簡素化されたものがあります。 RPMのダウンロードは[こちら](https://github.com/griddb/c_client/releases)。 最新のRPMを`wget`して開始します。

``` bash
$ wget \
https://github.com/griddb/c_client/releases/download/v4.2.0/griddb_c_client-4.2.0-1.linux.x86_64.rpm
```
次に、rpmをインストールします。
``` bash
$ sudo rpm -ivh griddb_c_client-4.2.0-1.linux.x86_64.rpm
```
これでc_clientが`/usr/`ディレクトリにインストールされ、準備が整いました。
Node Package ManagerによりNodejsクライアントを簡単にインストールすることができるようになりました。Node Package Managerを使わずにインストールする場合は、新しいディレクトリと`npm init`を作成します。 これにより、プロジェクトの基礎の枠組みができ、`node_modules`ディレクトリが作成されます。 完了したら、次に進みます。
``` bash
$ npm i griddb_node
```
これで、GridDB Node.jsクライアントがインストールされ、使用できる状態になりました。
注意点として、クライアントにはNode.jsバージョン10が必要です。別のプロジェクトで別のバージョンのNode.jsを使用している場合や最新の何かを使用している場合、nvmを使用することをお勧めします。 Node Version Managerは、bashスクリプトで、Node.jsのバージョン管理に役立ちます。 たとえば、今、バージョン10が必要なので、次のように入力します。
``` bash
$ nvm install 10.16
```
次に、
``` bash
$ nvm use 10.16
```
次のコマンドにて正しくインストールされたことを確認してください。
``` bash
$ node -v
 v10.16.0 
```
これで完了です。
これで、GridDBで`JavaScript`を使用する準備がほぼ整いました。 最後のステップは、`LD_LIBRARY`にc_clientインストールパスを指定することです。
``` bash
$ export LD_LIBRARY_PATH=${LD_LIBRARY_PATH}:/usr/griddb_c_client-4.2-0/lib/
```
これで、GridDBクラスターで`JavaScript`を実行できるようになりました。

## 使用法
クライアントを使用するには、griddbライブラリをプログラムにインポートします。
```
const griddb = require('griddb_node');
const fs = require('fs');
```
実際のクラスターを定義するには、次のようにします。
```
const factory = griddb.StoreFactory.getInstance();
        const store = factory.getStore({
            "host": '239.0.0.1',
            "port": 31999,
            "clusterName": "defaultCluster",
            "username": "admin",
            "password": "admin"
        });
```
コンテナの作成とスキーマの定義も簡単に行うことができます（コレクションコンテナ）。
```
const colConInfo = new griddb.ContainerInfo({
            'name': "Person",
            'columnInfoList': [
                ["name", griddb.Type.STRING],
                ["age", griddb.Type.INTEGER],
            ],
            'type': griddb.ContainerType.COLLECTION, 'rowKey': true
        });
```
Time Series コンテナ：
```
var timeConInfo = new griddb.ContainerInfo({
        'name': "HeartRate",
        'columnInfoList': [
            ["timestamp", griddb.Type.TIMESTAMP],
            ["heartRate", griddb.Type.INTEGER],
            ["activity", griddb.Type.STRING]
        ],
        'type': griddb.ContainerType.TIME_SERIES, 'rowKey': true
    });
```
そして、実際にコンテナにデータを入力（とクエリ）するには、次のようにします。
```
let time_series;
        store.putContainer(timeConInfo, false)
            .then(ts => {
                time_series = ts;
                return ts.put([new Date(), 60, 'resting']);
            })
            .then(() => {
                query = time_series.query("select * where timestamp > TIMESTAMPADD(HOUR, NOW(), -6)");
                return query.fetch();
            })
            .then(rowset => {
                while (rowset.hasNext()) {
                    var row = rowset.next();
                    console.log("Time =", row[0], "Heart Rate =", row[1].toString(), "Activity =", row[2]);
                }
            })
            .catch(err => {
                if (err.constructor.name == "GSException") {
                    for (var i = 0; i < err.getErrorStackSize(); i++) {
                        console.log("[", i, "]");
                        console.log(err.getErrorCode(i));
                        console.log(err.getMessage(i));
                    }
                } else {
                    console.log(err);
                }
            });
```
## おわりに
Node.jsの起動および実行にかかるプロセスが簡略化されたことで、Node.jsを利用するプロジェクトが今後増えていくことを期待しています。 使用法の章で使用したソースコードの全体をご覧になりたい場合は、[こちら](https://griddb.net/en/download/26126/)からソースファイルをダウンロードしてください。