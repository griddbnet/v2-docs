# クイックスタート

## はじめに
本書では、初めてお使いの方にGridDBの概要と簡単な使い方を説明します。

具体的には、1台のマシンにGridDBをインストールして、GridDBの起動／停止やサンプルプログラムの実行を行う一連の手順を、ソースコードからビルドする場合とRPM/DEBファイルを利用する場合の2ケースについて説明します。

1. [ソースコードを利用する場合](#ソースコードを利用する場合)  
1. [RPM/DEBファイルを利用する場合](#RPM/DEBファイルを利用する場合)

##ソースコードを利用する場合

  CentOS 7.6(gcc 4.8.5)、Ubuntu 18.04(gcc 4.8.5)、openSUSE Leap 15.1(gcc 4.8.5)の環境での動作を確認しています。

### サーバ、クライアント (java) のビルド

GridDBのソースコードをダウンロードしてビルドしてください。また、3つの環境変数を設定してください。

```
    $ git clone https://github.com/griddb/griddb.git
    $ cd griddb
    $ ./bootstrap.sh
    $ ./configure
    $ make

    $ export GS_HOME=$PWD
    $ export GS_LOG=$PWD/log
    $ export PATH=${PATH}:$GS_HOME/bin
````
以下の環境変数が定義されます。


| 環境変数 | 値 | 意味 |
|---------|----|------|
| GS_HOME | ソースコードを展開したディレクトリ | GridDBホームディレクトリ |
| GS_LOG  | $GS_HOME/log | イベントログファイル出力ディレクトリ |

::: tip 注意点

- これら環境変数は、以降で説明する運用コマンドで参照されます。
- デフォルトのビルド環境はトリガ機能を無効にしています。トリガ機能を有効にするにはビルドする際に次のオプションを追加してください。
```
$ ./configure --enable-activemq
```
:::
### 環境設定

#### ネットワークの設定

GridDBでは、クラスタを構成する際にマルチキャスト通信を使用します。
マルチキャスト通信を可能にするためのネットワークの設定を行います。

まず、ホスト名とIPアドレスの対応付けを確認します。
ホストとIPアドレスの設定を確認する "hostname -i" コマンドを実行してください。
次のようにマシンの IPアドレスが表示される場合は設定済みですので、今回のネットワーク設定の作業は不要です。

[実行例]
  ```
  $ hostname -i
  192.168.11.10
  ```

次のようなメッセージやループバックアドレス127.0.0.1が表示される場合は、設定が行われていません。

[実行例]
  ```
  $ hostname -i
  hostname: 名前に対応するアドレスがありません
  ```
  または
  ```
  $ hostname -i
  127.0.0.1
  ```

次の1から4の手順を実施してください。
　
#### ネットワークの設定手順

1. OSで設定されているホスト名を確認する

   [実行例]
    ```
    $ hostname
    MY_HOST
    ```

1. OSで設定されているIPアドレスを確認する

   [実行例]
    ```
    $ ip -f inet -o addr show eth0 | cut -d' ' -f 7 | cut -d/ -f 1
    192.168.11.10
    ```

2. ホスト名とIPアドレスの対応付けを設定する  
1で確認したホスト名とIPアドレスを、rootユーザで/etc/hostsファイルに追加します。

   [実行例]
    ```
    # cd /
    # pwd
    /root
    # echo "192.168.11.10 MY_HOST" >> /etc/hosts
    ```

3. 設定されたことを確認する  
ホストとIPアドレスの設定を確認する「hostname -i」コマンドを実行してください。2で指定したIPアドレスが表示されることを確認してください。

    [実行例]
    ```
    $ hostname -i
    192.168.11.10
    ```

#### GridDB管理ユーザの設定

管理ユーザは、ノードやクラスタへの認証のために用いられます。管理ユーザの情報は、
ユーザ定義ファイル に保存されています。デフォルトでは以下のファイルです。

$GS_HOME/conf/password

インストール直後では、下記のデフォルトユーザが存在します。

| ユーザ | パスワード |
|--------|------------|
| admin  | 未設定     |

上記のデフォルトユーザを含む管理ユーザ情報は、運用コマンドのユーザ管理コマンドを用いて変更できます。

| コマンド          | 機能                                      |
|-------------------|-------------------------------------------|
| gs_adduser        | 管理ユーザを追加する                      |
| gs_deluser        | 管理ユーザを削除する                      |
| gs_passwd         | 管理ユーザのパスワードを変更する          |


デフォルトユーザを利用する場合は、以下のようにパスワードを変更してください。
パスワードは登録の際に暗号化されます。

::: tip Notes
- デフォルトユーザのパスワードは設定されていません。管理ユーザのパスワードが設定されていない場合、サーバは起動できないため必ずパスワードを変更してください。
:::
    ```
    $ gs_passwd admin
    Password:（パスワードを入力します）
    Retype password:（パスワードを再入力します）
    ```
- デフォルト以外の新しい管理ユーザを追加する場合、ユーザ名はgs#で始まる必要があります。

- gs#以降は1文字以上のASCII英数字ならびにアンダースコア 「\_」を使用可能です。

- 管理ユーザを新たに追加する例を次に示します。

    ```
    $ gs_adduser gs#newuser
    Password:（パスワードを入力します）
    Retype password:（パスワードを再入力します）
    ```

#### パラメータの設定

GridDBを動作させるためには、アドレスやクラスタ名などのパラメータの初期設定が必要です。
ここでは、必須項目の「クラスタ名」のみ設定を行い、それ以外はデフォルト値を用います。

クラスタの「クラスタ名」をクラスタ定義ファイルに記述します。
クラスタ定義ファイルは「$GS_HOME/conf/gs_cluster.json」です。

「"clusterName":""」の部分にクラスタ名を記載します。
ここでは、「myCluster」という名前を用います。

[ファイルの記述例]
```
$ vi $GS_HOME/conf/gs_cluster.json

{
        "dataStore":{
                "partitionNum":128,
                "storeBlockSize":"64KB"
        },
        "cluster":{
                "clusterName":"myCluster",
                "replicationNum":2,
                "notificationAddress":"239.0.0.1",
                "notificationPort":20000,
                "notificationInterval":"5s",
                "heartbeatInterval":"5s",
                "loadbalanceCheckInterval":"180s"
        },
        "sync":{
                "timeoutInterval":"30s"
        },
        "transaction":{
                "notificationAddress":"239.0.0.1",
                "notificationPort":31999,
                "notificationInterval":"5s",
                "replicationMode":0,
                "replicationTimeoutInterval":"10s"
        }
}
```

::: tip Notes

- クラスタ名はサブネットワーク上で一意となる名前にすることを推奨します。
- クラスタ名は1文字以上のASCII英数字ならびにアンダースコア「\_」の列で構成されます。ただし、先頭の文字には数字を指定できません。また、大文字・小文字は区別されません。また、64文字以内で指定する必要があります。
:::
#### 設定内容

ネットワーク設定とクラスタ名以外は、デフォルト値の設定のままで動作することができます。主な設定項目を下記の表に示します。これ以降のツールの実行などでは、次の値を用います。

| 設定項目                         | 値 |
|---------------------------------|----------|
| IPアドレス                       | "hostname -i"コマンドで表示されるIPアドレス |
| クラスタ名                       | myCluster |
| マルチキャストアドレス            | 239.0.0.1 (デフォルト値) |
| マルチキャストポート番号           | 31999 (デフォルト値) |
| ユーザ名                          | admin (デフォルト値) |
| ユーザパスワード                   | admin |
| SQLマルチキャストアドレス   | 239.0.0.1 (デフォルト値) |
| SQLマルチキャストポート番号 | 41999 (デフォルト値) |

　
### 起動／停止

GridDBノードの起動／停止、クラスタの開始／停止の操作をやってみましょう。起動や停止の操作方法はいくつかあるようですが、ここでは、運用コマンドを使ってみます。なお、運用コマンドは gsadm ユーザで実行で実行します。

運用コマンド一覧

| コマンド | 機能 |
|---------|------|
| gs_startnode	| ノードを起動する |
| gs_joincluster	| ノードをクラスタに参加する |
| gs_leavecluster	| クラスタからノードを離脱させる |
| gs_stopcluster	| クラスタを停止する |
| gs_stopnode	| ノードを停止する(シャットダウン) |
| gs_stat	| ノードの内部情報を取得する |

::: tip 注意点
- プロキシ変数(http_proxy)が設定されている場合、ノードのアドレス(群)を、no_proxyで設定し、proxyから除外してください。
運用コマンドはREST/http通信を行うため、誤ってproxyサーバ側に接続されてしまい、運用コマンドが動作しません。
:::
   設定例
    ```
    $ export no_proxy=localhost,127.0.0.1,192.168.11.10
    ```

#### 起動操作

GridDBノードのインストールおよびセットアップを行った後、GridDBクラスタの起動の流れは次のようになります。
1.	ノードを起動する
2.	クラスタを開始する

「ノードとクラスタ」で説明した通り、GridDBクラスタはユーザが指定した構成ノード数分のノードがクラスタへ参加することで構成され、サービスが開始されます。
構成ノード数のノードすべてがクラスタに参加するまで、クラスタサービスは開始されず、アプリケーションからはクラスタにアクセスすることはできません。

今回説明するのは、ノード1台で利用する「シングル構成」です。ノードを1台起動したのち、起動したノードをクラスタに参加させて、クラスタを開始します。

#### ノードを起動する

ノードの起動するには、運用コマンドの gs_startnode コマンドを用います。コマンドを用います。  
ユーザ認証オプション-uには管理ユーザadminのユーザ名とパスワードを指定し、ノードの起動を待ち合せる-wオプションを指定します。

[実行例]
```
$ gs_startnode -u admin/admin -w
```

#### クラスタを開始する

クラスタの開始するには、運用コマンドの gs_joincluster コマンドを用います。 ユーザ認証オプション-uには管理ユーザadminのユーザ名とパスワードを指定し、クラスタの開始を待ち合せる-wオプションを指定します。クラスタ名を-cオプションで指定します。。

[実行例]
```
$ gs_joincluster -u admin/admin –w -c myCluster
```

クラスタが開始されているかなどのクラスタの状態を確認するのは、運用コマンドの gs_stat もコマンドを用います。  
ユーザ認証オプション -u には管理ユーザ admin のユーザ名とパスワードを指定します。また、クラスタのステータスを確認するために、"Status"の表記の行のみを grep で抽出した方がよいでしょう。

[実行例]
```
$ gs_stat -u admin/admin | grep Status
        "clusterStatus": "MASTER",
        "nodeStatus": "ACTIVE",
        "partitionStatus": "NORMAL"
```

「gs_stat」で表示される"clusterStatus"、"nodeStatus"、"partitionStatus"の3つのステータスが「実行例」のように表示されていれば、正常に起動しています。アプリケーションからクラスタにアクセスが可能になります。

#### 停止操作

##### 基本の流れ

GridDBクラスタの停止の流れは以下のようになります。
1.	クラスタを停止する
2.	ノードを停止する

起動の流れとは逆に、クラスタを安全に停止してから、各ノードを停止します。クラスタを停止した段階で、アプリケーションからはクラスタにアクセスできなくなります。

#### クラスタを停止する

クラスタ停止コマンドを実行します。クラスタ停止コマンドを実行した時点で、アプリケーションからはクラスタにアクセスできなくなります。

- gs_stopcluster -u ユーザ名/パスワード -w

  - ユーザ認証オプション-uには管理ユーザadminのユーザ名とパスワードを指定し、クラスタの停止を待ち合せる-wオプションを指定します。

[実行例]
```
$ gs_stopcluster -u admin/admin -w
.
The GridDB cluster has been stopped.
$
```

#### ノードを停止する

ノードを停止するには、運用コマンドの gs_stopcluster コマンドを実行します。クラスタ停止コマンドを実行した時点で、アプリケーションからはクラスタにアクセスできなくなります。
ユーザ認証オプション -u には管理ユーザ admin のユーザ名とパスワードを指定し、クラスタの停止を待ち合せる -w オプションを指定します。
- gs_stopnode -u ユーザ名/パスワード -w

  - ユーザ認証オプション-uには管理ユーザadminのユーザ名とパスワードを指定し、ノードの停止を待ち合せる-wオプションを指定します。

[実行例]
```
$ gs_stopnode -u admin/admin -w
The GridDB node is stopped.
.
The GridDB node has been stopped.
```

### サンプルプログラムのビルド・実行方法

プログラムのビルドおよび実行方法の例を示します。

[Javaの場合]

1. 環境変数 CLASSPATHの設定
2. サンプルプログラムをgsSampleディレクトリにコピー
3. ビルド
4. 実行

```
$ export CLASSPATH=${CLASSPATH}:$GS_HOME/bin/gridstore.jar:.
$ mkdir gsSample
$ cp $GS_HOME/docs/sample/program/Sample1.java gsSample/.
$ javac gsSample/Sample1.java
$ java gsSample/Sample1 239.0.0.1 31999 設定したクラスタ名 admin 設定したパスワード
```
---
## RPM/DEBファイルを利用する場合

  CentOS 7.6、Ubuntu 18.04、openSUSE Leap 15.1の環境での動作を確認しています。

::: tip 注意点
- このパッケージをインストールすると、OS内にgsadmユーザが作成されます。運用コマンドはgsadmユーザで操作してください。 
::: 
    例
    ```
    # su - gsadm
    $ pwd
    /var/lib/gridstore
    ```
- gsadmユーザでログインすると環境変数 GS_HOMEとGS_LOGが自動的に設定されます。また、運用コマンドの場所が環境変数 PATHに設定されます。
- Javaクライアントのライブラリ(gridstore.jar)は/usr/share/java上に、サンプルは/usr/griddb-XXX/docs/sample/program上に配置されます。
- Ubuntu用、openSUSE用のパッケージはトリガ機能を含んでいません。

### インストール

対象OSのパッケージをインストールします。

    (CentOS)
    $ sudo rpm -ivh griddb_nosql-X.X.X-linux.x86_64.rpm

    (Ubuntu)
    $ sudo dpkg -i griddb_nosql-X.X.X_amd64.deb

    (openSUSE)
    $ sudo zypper install griddb_nosql-X.X.X-opensuse.x86_64.rpm

    ※ X.X.Xはバージョンを意味します。

#### インストール後のユーザやディレクトリ構成

GridDBパッケージのインストールを行うと、次のようなユーザやディレクトリ構成が作成されます。

#### GridDBユーザとグループ

OSのグループgridstoreとユーザgsadmが作成されます。ユーザgsadmは、GridDBを運用するためのユーザとして使用します。

| ユーザ | 所属グループ | ホームディレクトリ |
|---------|-------|---------------------|
| gsadm | gridstore | /var/lib/gridstore |

ユーザ gsadm (の .bash_profile ファイル) には、次の環境変数が定義されます。

| 環境変数 | 値 | 意味 |
|---------|----|------|
| GS_HOME | /var/lib/gridstore | ユーザgsadm/GridDBホームディレクトリ |
| GS_LOG  | /var/lib/gridstore/log | ノードのイベントログファイルの出力ディレクトリ |



#### ディレクトリ構成

ノードの定義ファイルやデータベースファイルなどを配置するGridDBホームディレクトリと、インストールしたファイルを配置するインストールディレクトリが作成されます。

#### GridDBホームディレクトリ
```
/var/lib/gridstore/                      # GridDBホームディレクトリ
                   conf/                 # 定義ファイルディレクトリ
                        gs_cluster.json  # クラスタ定義ファイル
                        gs_node.json     # ノード定義ファイル
                        password         # ユーザ定義ファイル
                   data/                 # データベースファイルディレクトリ
                   log/                  # ログディレクトリ
```

#### インストールディレクトリ
```
/usr/griddb/                            # インストールディレクトリ
            bin/                        # 運用コマンド、モジュールディレクトリ
            conf/                       # 定義ファイルディレクトリ
                gs_cluster.json         # クラスタ定義ファイル
                gs_node.json            # ノード定義ファイル
                password                # ユーザ定義ファイル
            3rd_party/                  
            docs/
                manual/
                sample/
```

### 環境設定

「[ソースコードを利用する場合](#ソースコードを利用する場合)」の「[環境設定](#環境設定)」と同じです。

### 起動／停止

gsadmユーザで操作してください。それ以外は「[ソースコードを利用する場合](#ソースコードを利用する場合)」の「起動／停止」と同じです。

### サンプルプログラムのビルド・実行方法

プログラムのビルドおよび実行方法の例を示します。

[Javaの場合]

1. 環境変数の設定
2. サンプルプログラムをgsSampleディレクトリにコピー
3. ビルド
4. 実行

```
$ export CLASSPATH=${CLASSPATH}:/usr/share/java/gridstore.jar:.
$ mkdir gsSample
$ cp /usr/gridstore-X.X.X/docs/sample/program/Sample1.java gsSample/.
$ javac gsSample/Sample1.java
$ java gsSample/Sample1 239.0.0.1 31999 設定したクラスタ名 admin 設定したパスワード
```


## GridDBのアンインストール

GridDBが不要となった場合にはパッケージをアンインストールします。root権限で、以下の手順でアンインストールを実行してください。

[実行例]

    (CentOS)
    $ sudo rpm -e griddb_nosql

    (Ubuntu)
    $ sudo dpkg -r griddb_nosql

    (openSUSE)
    $ sudo zypper remove griddb_nosql

::: tip 注意点

- 定義ファイルやデータファイルなど、GridDBホームディレクトリ下のファイルはアンインストールされません。不要な場合は手動で削除して下さい。
:::

---
