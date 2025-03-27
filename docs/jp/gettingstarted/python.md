# Python


## インストール
### c_clientをインストールする

GridDB c_client（Pythonクライアントを使用するための前提条件）はここにあります： [https://github.com/griddb/c_client](https://github.com/griddb/c_client)。RPMのダウンロードは[こちら](https://github.com/griddb/c_client/releases).  最新のRPMを`wget`してインストールします。

``` bash
$ wget \
https://github.com/griddb/c_client/releases/download/v4.2.0/griddb_c_client-4.2.0-1.linux.x86_64.rpm
```
次に、rpmをインストールします
``` bash
$ sudo rpm -ivh griddb_c_client-4.2.0-1.linux.x86_64.rpm
```
これで c_clientが`/usr/`ディレクトリにインストールされ、準備が整いました。

## Python クライアントをインストールする
Pythonクライアントのインストールは少し複雑ですが、それでも簡単です。 まず、GitHubからファイルをダウンロードしましょう。

``` bash
$ wget \
https://github.com/griddb/python_client/archive/0.8.1.tar.gz
```
そして、解凍します。

``` bash
$ tar xvzf 0.8.1.tar.gz
```
次に、依存するソフトウェアをインストールします。
``` bash
$ wget https://prdownloads.sourceforge.net/swig/swig-3.0.12.tar.gz
tar xvfz swig-3.0.12.tar.gz
cd swig-3.0.12
./configure
make 
sudo make install
```
必要に応じて、pcreをインストールします
``` bash
$ sudo yum install pcre2-devel.x86_64
```
次に、Pythonクライアントを `make` します
``` bash
$ cd ../python_client
make
```
Pythonクライアントを作成しようとした時に次のエラーが発生した場合、

    /usr/bin/ld: cannot find -lgridstore
簡単に修正できるので心配はありません。 原因は、`Makefile`がc_clientを指すように設定していないことです。 つまり、`c_client/bin`の場所をLDFLAGSオプションに追加することで問題は解決します

    SWIG = swig -DSWIGWORDSIZE64
    CXX = g++
    
    ARCH = $(shell arch)
    
    LDFLAGS = -L/home/israel/c_client/bin -lpthread -lrt -lgridstore #added /home/israel/c_client_bin right here
    
    CPPFLAGS = -fPIC -std=c++0x -g -O2
    INCLUDES = -Iinclude -Isrc
    
    INCLUDES_PYTHON = $(INCLUDES)   \
                                    -I/usr/include/python3.6m
    
    PROGRAM = _griddb_python.so
    EXTRA = griddb_python.py griddb_python.pyc
    
    SOURCES =         src/TimeSeriesProperties.cpp \
                      src/ContainerInfo.cpp                 \
                      src/AggregationResult.cpp     \
                      src/Container.cpp                     \
                      src/Store.cpp                 \
                      src/StoreFactory.cpp  \
                      src/PartitionController.cpp   \
                      src/Query.cpp                         \
                      src/QueryAnalysisEntry.cpp                    \
                      src/RowKeyPredicate.cpp       \
                      src/RowSet.cpp                        \
                      src/TimestampUtils.cpp                        \
    
    all: $(PROGRAM)
    
    ... snip ...
適切な修正を行うと、`make`は意図したとおりに動作するはずです。 次に環境変数を設定します。 適切な場所を指定します。

``` bash
$ export LIBRARY_PATH=$LIBRARY_PATH:[insert path to c_client]
$ export  PYTHONPATH=$PYTHONPATH:[insert path to python_client]
$ export LIBRARY_PATH=$LD_LIBRARY_PATH:[insert path to c_client/bin]
```
これで、GridDB Clusterでcとpythonの両方を使用できるようになりました。

# IoTデータセットのシミュレーションを行う

このセクションでは、PythonとGridDBの併用方法を紹介することを目的としたPythonスクリプトについて説明します。また、模擬のIoT（Internet of Things）データセットを作成する方法も紹介します。

この生成データセットでは、IoTデータセットを作成する際に最もよく使用される`TIMESERIES`コンテナを使用します。

## Pythonを使用する

PythonでGridDBを利用するには、GitHubから[GridDB c_client](https://github.com/griddb/c_client)をダウンロードしてください。 その際、 [Python Client](https://github.com/griddb/python_client)も必要になります。 また、[こちら](https://pypi.org/project/griddb-python-client/)から`pip`経由でインストールすることもできます。

### GridDBの接続とスキーマを取得する

まず、GridDB の接続設定と gridstore obj を取得します。ここでは、すべてのパラメータにデフォルト値を使用します。GridDB の公式ドキュメントに従って設定をしていれば、この方法でもデータベースを直接操作できるはずです。

接続する前にまず、GridDBコネクタのインポートと変数の設定を行います。

```python
import griddb_python
griddb = griddb_python
factory = griddb.StoreFactory.get_instance()

store = factory.get_store(
    host="239.0.0.1",
    port=31999,
    cluster_name="defaultCluster",
    username="admin",
    password="admin"
)
```

store変数に、現在稼働しているGridDBサーバへの正確な接続設定がなされると、その変数で直接Gridstore関数を実行できるようになります。

次に、スキーマを見てみましょう。IoTデータでは、一般的に多くのセンサーが、プロジェクトにとって重要な1つまたは2つのデータポイントを出力します。このケースでは、1つのセンサーの温度と1つの任意の'data'ポイントをシミュレートし、両方をフロートとします。

```python
    for i in range(numSensors):
        conInfo = griddb.ContainerInfo("sensor_" + str(i),
					[["timestamp", griddb.Type.TIMESTAMP],
		            ["data", griddb.Type.FLOAT],
                    ["temperature", griddb.Type.FLOAT]],
		            griddb.ContainerType.TIME_SERIES, True)
        
        col = store.put_container(conInfo)
```

上の例では、ユーザーが選択した変数`numSensors`をループさせて、その数のセンサーを偽のデータセットに`put`しています。このスクリプトをそのまま使用すると、5つの異なるセンサーが挿入されます。

## データのシミュレーションを行う


まず、このスクリプトの実際の使用方法を説明します。データセットのシミュレーションを行いたいときは、スクリプト全体を次のように実行します。

```bash
$ python3 generate_data.py 24 5
```

最初の数字はシミュレーションを行う時間数、2番目の数字は増分（分単位）です。このスクリプトは、`now`から`now`の24時間後までのデータセットを、N個のセンサーから5分ごとに出力して、GridDBサーバに生成します。

### ランダムなデータポイントを生成する

スクリプトを実行する際に最初に行うことは、パラメータの設定です。今回の例では、`numSensors`変数を編集して、増加したタイムスパンごとにデータを'emit'したいセンサーの数を設定します。デフォルトでは、`numSensors = 5`と、5に設定されています。

ここからは、ユーザーのコマンドライン引数を`ints`に変換するだけで、スクリプトを動作させることができるようになります。

```python
numSensors = 5
hours = int(argv[1])
minutes = int(argv[2])
```

次に、ユーザーが設定したパラメータを統一された単位（ミリ秒）に変換します。この値をもとに、生成されたデータがどれだけの数のエミットを生み出すかを計算します（`arrLen`変数）。

```python
    duration = hours * 3600000
    increment = minutes * 60000

    arrLen = ( int(duration) / int(increment) ) * numSensors
```

ここからは、いくつかの`for loops`を使用して、目的のタイムスタンプごとに異なる数値やフロートを作成し、最終的に関数によって返されるオブジェクトに格納します。


```python
containerEntry = {}
    collectionListRows = []
    for i in range(int(arrLen)):
        for j in range(numSensors):
            addedTime = i * minutes
			
            incTime = now + timedelta(minutes=addedTime)

            randData =  random.uniform(0,10000)
            randTemp = random.uniform(0,100)
            print("Data being inserted: " + str(j) + " " + str(incTime) + " " + str(randData) + "  " + str(randTemp))
            collectionListRows.append([incTime, randData, randTemp])
            containerEntry.update({"sensor_" + str(j): collectionListRows})
    store.multi_put(containerEntry)
```

スクリプトのこの部分は、pythonのランダムライブラリからランダムなスクリプトを作成します。また、実際のIoTデータセットをシミュレートするために、`now`からループを繰り返すたびに時間を加算します。


この部分の最後の行は、GridDBの`multiPut`です。それについては[こちら](https://griddb.net/en/blog/griddb-optimization-with-multi-put-and-query/)で詳しく説明しています。

## クエリ

基本的なクエリを実行するために、GridDBのバージョン4.6から搭載された[GridDB Shell](https://docs.griddb.net/gettingstarted/go/)を使ってみましょう。まず、シェルに入って、データがあるかどうか基本的なチェックをします。

```bash
gs> load default.gsh

gs> connect $defaultCluster
The connection attempt was successful(NoSQL).
The connection attempt was successful(NewSQL).

gs[public]> sql select * from testing_0;
31,149 results. (26 ms)

gs[public]> get 10
timestamp,data,temperature
2021-07-28T21:01:00.282Z,72.40626,101.7
2021-07-28T21:07:43.152Z,33.06072,47.99
2021-07-28T21:09:52.166Z,8.167625,26.82
2021-07-28T21:49:33.682Z,80.57002,3.53
2021-07-28T21:54:38.294Z,28.507494,63.16
2021-07-28T21:55:24.377Z,18.945627,51.04
2021-07-28T21:56:09.467Z,13.514397,99.64
2021-07-28T21:58:40.906Z,88.73552,101.73
2021-07-28T21:58:55.059Z,43.575638,28.93
2021-07-28T21:59:42.647Z,38.931076,40.61
The 10 results had been acquired.
```
最初のセンサーで31k行が挿入されたことが分かります。

次に、時間を指定してみましょう。6時間前から現在までの間の全ての結果から照会することができます。

```python
gs[public]> tql testing_0 select * where timestamp > TIMESTAMPADD(HOUR, NOW(), -6);
20,810 results. (3 ms)

gs[public]> get 3
timestamp,data,temperature
2021-08-04T16:28:34.566Z,7.682323,70.7
2021-08-04T16:29:28.943Z,22.910458,33.14
2021-08-04T16:30:34.566Z,89.90703,101.03
The 3 results had been acquired.
```

## 結論
これで、概念実証に必要な量のIoTデータを生成できるようになりました。

今回使ったソースコード一式は、[GridDB.net GitHub](https://github.com/griddbnet/tutorials)からダウンロードできます。
