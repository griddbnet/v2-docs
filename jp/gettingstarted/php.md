# PHP

GridDBのPHPプログラミング言語用のデータベースコネクタをリリースしました。 GridDB用のPython、Ruby、Go APIと同様に、[SWIG](http://www.swig.org/)ライブラリを使い構築しました。 このコネクタはPHP 7以降のバージョンをサポートしており、CentOSバージョン7.4以上で動作します。

PHP、Hypertext Preprocessorは、Rasmus Lerdorf氏によって開発されたオープンソースのプログラミング言語です。

## PHPクライアントのセットアップとインストール
まずはじめに、PHPクライアントのgithubリポジトリをクローンします。
``` bash
$ git clone https://github.com/griddb/php_client.git
```
PHPクライアントをビルドするには、 [GridDB C](https://github.com/griddb/c_client)クライアントをビルドしてインストールする必要があります。 あまり詳しくない方は、[このブログ](https://griddb.net/ja/blog/using-griddbs-cpythonruby-apis/)に従って、Cクライアントの設定とテストを行ってください。
::: warning Note
システム上にPHPクライアントをmakeする前に、PHP バージョン7以上をインストール済であることを確認してください。これから入手し設定する場合は、 この[ページ](https://linuxize.com/post/install-php-7-on-centos-7/) のインストラクションに沿ってインストールしてください。
:::
Githubからソースコードを入手したら、PHPクライアントの[Github page](https://github.com/griddb/php_client)の`README`にあるインストラクションに従って進めてください。

## PHPクライアントを使用してGridDBに接続する
PHPプログラムでGridDBに接続したい場合は、 `include('griddb_php_client.php');`を使ってPHP APIをインポートします。PHP用のGridDBパッケージの名前は、`StoreFactory`です。

そこから、`get_default()`;を使用してインスタンスを取得し、ファクトリインスタンスの`->get_store`メソッドを使用してGridDBクラスタに接続します。 このメソッドに与えるパラメータは、`array`(オブジェクトです。配列の要素は、GridDBに接続するために指定したい設定フィールドです。

::: warning Note
ポートは整数として指定する必要がありますが、ホスト名やクラスタ名などのその他のデータベース設定値はすべて文字列にすることができます。
:::

``` php
<?php
  include('griddb_php_client.php');
  $factory = StoreFactory::get_default();
  $update = true;
  try {
      //Get GridStore object
      $gridstore = $factory->get_store(array("notificationAddress" => $argv[1],
                        "notificationPort" => $argv[2],
                        "clusterName" => $argv[3],
                        "user" => $argv[4],
                        "password" => $argv[5]
                    ));
    } catch(GSException $e){
        echo($e->what()."\n");
        echo($e->get_code()."\n");
    }
?>
```
## PHPで行スキーマを作成する
コンテナおよび行のスキーマは、GridDB APIタイプの配列を使用して作成することができます。

インターフェイスの 2次元配列を使用するだけで、コンテナの列タイプをマップできます。 そこから`->put_container()`メソッドを使用してコンテナスキーマ`(array(array()))`を作成できます。 これらのスキーマを使用して挿入すると、コンテナを作成することができます。

行は、GridDB API固有の関数を使用してモデル化できます。行を作成するには、行オブジェクト `( $row = $ts->create_row();)` を作成し、GridDB API関数を使用して各フィールドを設定し、各インデックスをそれぞれの対応する値にマッピングします。

``` php
// Creating container info
#Create ContainerInfo
        $conInfo =
// Creating schema for our TimeSeries Container
// The first column is always the row key
#Create TimeSeries
        $ts = $gridstore->put_container("point01", array(array("timestamp" => GS_TYPE_TIMESTAMP),
                        array("active" => GS_TYPE_BOOL),
                        array("voltage" => GS_TYPE_DOUBLE)),
                        GS_CONTAINER_TIME_SERIES);
        #Create and set row data
        $row = $ts->create_row();
        $row->set_field_by_timestamp(0, TimestampUtils::current());
        $row->set_field_by_bool(1, false);
        $row->set_field_by_double(2, 100);
        #Put row to timeseries with current timestamp
        $ts->put_row($row);
```
行オブジェクトの名前を持つコンテナの`get_next();`メソッドを呼び出すだけで、行を取得することもできます。 前述のとおり、GridDB APIメソッドを使用して行が作成されます。列値にアクセスするには、列の行インデックスを参照します。

``` php
        //Create Collection
        $col = $gridstore->put_container("col01", array(array("name" => GS_TYPE_STRING),
                  array("status" => GS_TYPE_BOOL),
                  array("count" => GS_TYPE_LONG),
                  array("lob" => GS_TYPE_BLOB)),
                  GS_CONTAINER_COLLECTION);
        //Change auto commit mode to false
        $col->set_auto_commit(false);
        //Set an index on the Row-key Column
        $col->create_index("name", GS_INDEX_FLAG_DEFAULT);
        //Set an index on the Column
        $col->create_index("count", GS_INDEX_FLAG_DEFAULT);
        //Create and set row data
        $row = $col->create_row(); //Create row for refer
        $row->set_field_by_string(0, "name01");
        $row->set_field_by_bool(1, False);
        $row->set_field_by_long(2, 1);
        $row->set_field_by_blob(3, "ABCDEFGHIJ");
        //Put row: RowKey is "name01"
        $col->put_row($row);
        $col->commit();
        $row2 = $col->create_row(); //Create row for refer
        $col->get_row_by_string("name01", True, $row2); //Get row with RowKey "name01"
        $col->delete_row_by_string("name01"); //Remove row with RowKey "name01"
        //Put row: RowKey is "name02"
        $col->put_row_by_string("name02", $row);
        $col->commit();
        //Create normal query
        $query = $col->query("select * where name = 'name02'");
        //Execute query
        $rrow = $col->create_row();
        $rs = $query->fetch($update);
        while ($rs->has_next()){
            $rs->get_next($rrow);
            $name = $rrow->get_field_as_string(0);
            $status = $rrow->get_field_as_bool(1);
            $count = $rrow->get_field_as_long(2) + 1;
            $lob = $rrow->get_field_as_blob(3);
            echo("Person: name=$name status=");
            echo $status ? 'true' : 'false';
            echo(" count=$count lob=$lob\n");
            //Update row
            $rrow->set_field_by_long(2, $count);
            $rs->update_current($rrow);
        }
        //End transaction
        $col->commit();
```
## クエリとデータ管理
コンテナにデータが格納され、GridDBに挿入されると、データのクエリとフェッチが可能になります。 Python APIやJava APIと同様に、コンテナオブジェクト`$query = $ts->query("select * ");`からクエリメソッドを使用して、コンテナに発行したい特定のクエリでクエリオブジェクトを構成します。 これが完了したら、クエリの結果を取得してクエリオブジェクトに格納します。

::: warning Note
更新する特定の行を選択する場合は、更新しようとしているコンテナのコミットモードを false に設定する必要があります。
:::

行の値の更新が完了したら、変更を`->commit();`します。

PHPを使用することで、GridDBクラスタの接続、管理が非常に簡単にできるようになります。 GridDB PHPクライアントによって提供される様々なユーティリティを使いこなせば、データを格納したり、GridDBで高性能なPHPアプリケーションを開発することが可能になります。ぜひ使ってみてください。

### 参照
GridDB PHP clientのソースコードは [official Github repository](https://github.com/griddb/php_client)から入手できます。