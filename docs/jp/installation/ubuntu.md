# インストール - Ubuntu

Ubuntu 18.04で動作を確認しました。

## apt-getでインストール

または、aptを使用してGridDBをインストールすることも可能です。

まず、Apt Repo Fileを作成します。

    sudo sh -c 'echo "deb https://www.griddb.net/apt griddb/5.1 multiverse" >>  /etc/apt/sources.list.d/griddb.list'

そして、キーをインポートします。

    wget -qO - https://www.griddb.net/apt/griddb.asc | sudo apt-key add -

その後、GridDBをインストールします。
    
    $ sudo apt update
    $ sudo apt install griddb-meta


このコマンドにより、GridDB、C-client、GridDB CLI がマシンにインストールされます。


そして、GridDBサーバを起動することができます。

    $ sudo systemctl start gridstore

サーバーを停止するには ：

    $ sudo systemctl stop gridstore

サーバーが起動したら、このようにシェルにドロップすることができます。

    $ sudo su gsadm
    $ gs_sh
	
### インストール後のユーザーとディレクトリ構成



#### :warning: Note
- 本パッケージをインストールすると、OSにgsadm OSユーザが作成されます。gsadmユーザーで操作してください。  
   実行例
   ```
   # su - gsadm
   $ pwd
   /var/lib/gridstore
   ```
- 環境変数 GS_HOME と GS_LOG を設定する必要はありません。また、操作するコマンドの場所は、環境変数PATHに設定されます。
- usr/share/java に Java クライアントライブラリ (gridstore.jar) が、/usr/gridb-XXX/docs/sample/programs にサンプルが用意されています。


GridDB パッケージをインストールすると、以下のユーザとディレクトリ構造が作成されます。

#### GridDBユーザーとグループ

OSグループgridstoreとユーザgsadmを作成します。ユーザ gsadm を GridDB のオペレータとして使用します。

| User | Group |  GridDB home directory path |
|---------|-------|---------------------|
| gsadm | gridstore | /var/lib/gridstore |

ユーザーgsadmには、以下の環境変数が定義されています（.bash_profileファイル内）。

| Environment variables | Value | Meaning |
|---------|----|------|
| GS_HOME | /var/lib/gridstore | ユーザー gsadm/GridDB ホームディレクトリ |
| GS_LOG | /var/lib/gridstore/log | ノードのイベントログファイルの出力先ディレクトリ |



#### ディレクトリの階層

以下の2つのディレクトリが作成されます。GridDB のホームディレクトリ（ノード定義ファイル、データベースファイル等）、 インストールディレクトリ（インストールファイル等）。

###### GridDBのホームディレクトリ
```
/var/lib/gridstore/                      #GridDB home directory
                   conf/                 # Definition file directory
                        gs_cluster.json  #Cluster definition file
                        gs_node.json     #Node definition file
                        password         #User definition file
                   data/                 # Database file directory
                   log/                  # Log directory
```

###### インストールディレクトリ
```
Installation directory
            bin/                        # Operation command, module directory
            conf/                       #Definition file directory
                gs_cluster.json         # Custer definition file
                gs_node.json            #Node definition file
                password                #User definition file
            3rd_party/                  
            docs/
                manual/
                sample/
```

## debでインストール

GridDBのGithubページから、適切なパッケージファイルをダウンロードしてください。

その後、ターゲットOSのパッケージをインストールしてください。
	
	(Ubuntu)
    $ sudo dpkg -i griddb_-X.X.X-linux.amd64.deb
    
	X.X.X はバージョン

## ビルド/実行方法

プログラムの構築と実行の例を示します。

[Java]

1. 環境変数の設定
2. サンプルプログラムを gsSample ディレクトリにコピーする。
3. ビルド
4. 実行

```
$ export CLASSPATH=${CLASSPATH}:/usr/share/java/gridstore.jar:.
$ mkdir gsSample
$ cp /usr/gridstore-X.X.X/docs/sample/program/Sample1.java gsSample/.
$ javac gsSample/Sample1.java
$ java gsSample/Sample1 239.0.0.1 31999 setup_cluster_name admin your_password
```


## GridDBのアンインストール

GridDBが不要になった場合は、パッケージをアンインストールしてください。root 権限で以下の手順を実行する。

[例]

    (CentOS)
    $ sudo apt remove griddb

#### :warning: Note
- 定義ファイルやデータファイルなど、GridDB のホームディレクトリ以下のファイルはアンインス トールされません。不要な場合は、手動で削除してください。

---
