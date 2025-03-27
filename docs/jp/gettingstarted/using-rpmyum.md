# インストール - CentOS

CentOS 7.9で動作を確認しました。

## Yumでインストール

または、Yumを使用してGridDBをインストールすることも可能です。 

まず、Yum Repo Fileを作成します。

    sudo cat > /etc/yum.repos.d/griddb.repo << EOF
    [griddb]
    name=GridDB.net
    baseurl=https://griddb.net/yum/el7/5.1/
    enabled=1
    gpgcheck=1
    gpgkey=https://griddb.net/yum/RPM-GPG-KEY-GridDB.txt
    EOF

その後、GridDBをインストールします。
    
    $ sudo yum update
    $ sudo yum -y install griddb-meta
    
#### :warning: Note
GridDBの旧バージョンを使用したい場合は、baseurlをそのバージョンに合わせて変更します（例：バージョン4.3）。 


このコマンドにより、GridDB、C-client、GridDB CLI がマシンにインストールされます。

そして、GridDBサーバを起動することができます。

    $ sudo systemctl start gridstore

サーバーを停止するには :

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
                   conf/                 #Definition file directory
                        gs_cluster.json  #Cluster definition file
                        gs_node.json     #Node definition file
                        password         #User definition file
                   data/                 #Database file directory
                   log/                  #Log directory
```

###### インストールディレクトリ
```
Installation directory
            bin/                        #Operation command, module directory
            conf/                       #Definition file directory
                gs_cluster.json         #Custer definition file
                gs_node.json            #Node definition file
                password                #User definition file
            3rd_party/                  
            docs/
                manual/
                sample/
```

## RPMでインストール

GridDBのGithubページから、適切なパッケージファイルをダウンロードしてください。

その後、ターゲットOSのパッケージをインストールしてください。
	
	(CentOS)
    $ sudo rpm -ivh griddb_nosql-X.X.X-linux.x86_64.rpm
    
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

GridDBが不要になった場合は、パッケージをアンインストールしてください。root 権限で以下の手順を実行します。

[例]

    (CentOS)
    $ sudo rpm -e griddb_nosql

#### :warning: Note
- 定義ファイルやデータファイルなど、GridDB のホームディレクトリ以下のファイルはアンインス トールされません。不要な場合は、手動で削除してください。

---
