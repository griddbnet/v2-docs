# パラメータ
<a id="label_parameters"></a>

GridDBの動作を制御するパラメータについて説明します。GridDBのパラメータにはノードの設定情報や利用できるリソースなどの設定を行うノード定義ファイルと、クラスタの動作設定を行うクラスタ定義ファイルがあります。 定義ファイルの項目名と初期状態での設定値とパラメータの意味を説明します。

設定値の単位は以下のように指定します。

-   バイトサイズ: TB、GB、MB、KB、B、T、G、M、K、またはこれらの小文字表記で指定可能。特に記載のない限り、単位の省略はできません。

-   時間: h、min、s、msで指定可能。特に記載のない限り、単位の省略はできません。

　

## クラスタ定義ファイル（gs_cluster.json)


クラスタ定義ファイルは、クラスタを構成する全ノードで同一の設定にしておく必要があります。partitionNum,storeBlockSizeパラメータはデータベースの構造を決める重要なパラメータのため、GridDBの初期起動後は値の変更ができません。

クラスタ定義ファイルの各設定項目の意味を以下に説明します。

初期状態で含まれていない項目も項目名を追加することでシステムに認識させることができます。 変更の欄ではパラメータの値の変更可否と変更タイミングを示します。
-   変更不可　：ノードを一度起動したのちは変更はできません。変更したい場合データベースを初期化する必要があります。
-   起動　　　：クラスタを構成する全ノードを再起動することで、変更できます。
-   オンライン：オンライン稼働中にパラメータを変更できます。ただし、変更内容は永続化されないため、定義ファイルの内容を手動で変更する必要があります。

　

| GridDBの構成                                 | 初期値    | パラメータの意味と制限値                          | <span style="white-space: nowrap;">変更</span>     |
|----------------------------------------------|-----------|--------------------------------------------------|----------|
| /notificationAddress                         | 239.0.0.1 | マルチキャストアドレスの標準設定です。cluster,transactionの同じ名前のパラメータが省略された場合、本設定が有効になります。異なる値が設定されている場合、個別設定のアドレスが有効です。 | 起動     |
| /dataStore/partitionNum                      | 128       | パーティション数を構成するクラスタ台数で分割配置できる公倍数で指定します。 整数: 1以上、10000以下で指定します。  | 変更不可 |
| /dataStore/storeBlockSize                    | 64KB      | ディスクI/Oのサイズ(64KB,1MB,4MB,8MB,16MB,32MB)を指定します。ブロックサイズを大きくすると１ブロックに格納できるレコードが増えるため、大規模テーブルのフルスキャンに向きますが、競合が発生する可能性が高くなります。システムにあったサイズを十分に検討して設定してください。サーバ起動後は変更できません。                                           | 変更不可 |
| /cluster/clusterName                         | なし      | クラスタを識別するための名称を指定します。必須入力のパラメータです。             | 起動     |
| /cluster/replicationNum                      | 2         | レプリカ数を指定します。レプリカ数が2の場合、パーティションが2重化されます。            | 起動     |
| /cluster/notificationAddress                 | 239.0.0.1 | クラスタ構成用マルチキャストアドレスを指定します。                     | 起動     |
| /cluster/notificationPort                    | 20000     | クラスタ構成用マルチキャストポートを指定します。 ポート番号として指定可能な範囲の値を指定します。 | 起動     |
| /cluster/notificationInterval                | 5秒       | クラスタ構成用マルチキャスト周期です。 1s以上、2<sup>31</sup>s未満の値を指定します。    | 起動     |
| /cluster/heartbeatInterval                   | 5秒       | クラスタ間でのノードの生存確認チェック周期（ハートビート周期）です。 1s以上、2<sup>31</sup>s未満の値を指定します。 | 起動     |
| /cluster/loadbalanceCheckInterval            | 180秒     | クラスタを構成するノード間の負荷バランス調整のため、バランス処理を実施するか否かのデータ採取周期を指定します。 1s以上、2<sup>31</sup>s未満の値を指定します。                                        | 起動     |
| /cluster/notificationMember                  | なし      | クラスタ構成方式を固定リスト方式にする際に、アドレスリストを指定します。           | 起動     |
| /cluster/notificationProvider/url            | なし      | クラスタ構成方式をプロバイダ方式にする際に、アドレスプロバイダのURLを指定します。  | 起動     |
| /cluster/notificationProvider/updateInterval | 5秒       | アドレスプロバイダからリストを取得する間隔を指定します。1s以上、2<sup>31</sup>s未満の値を指定します。  | 起動     |
| /sync/timeoutInterval                        | 30秒      | クラスタ間のデータ同期時のタイムアウト時間を指定します。　タイムアウトが発生した場合、システムの負荷が高い、障害発生などの可能性があります。 1s以上、2<sup>31</sup>s未満の値を指定します。     | 起動     |
| /transaction/notificationAddress             | 239.0.0.1 | クライアントが初期に接続するマルチキャストアドレスです。クライアントにはマスタノードが通知されます。     | 起動     |
| /transaction/notificationPort                | 31999     | クライアントが初期に接続するマルチキャストポートです。ポート番号として指定可能な範囲の値を指定します。   | 起動     |
| /transaction/notificationInterval            | 5秒       | クライアントへのマスタ通知用マルチキャスト周期。1s以上、2<sup>31</sup>s未満の値を指定します。          | 起動     |
| /transaction/replicationMode                 | 0         | トランザクションでデータ更新をする時のデータの同期（レプリケーション）方法を指定します。文字列または整数で、 "ASYNC"または0(非同期)、"SEMISYNC"または1(準同期)を指定します。            | 起動     |
| /transaction/replicationTimeoutInterval      | 10秒      | トランザクションが準同期レプリケーションでデータを同期する際のノード間通信のタイムアウト時間を指定します。1s以上、2<sup>31</sup>s未満の値を指定します。                             | 起動     |
| /transaction/authenticationTimeoutInterval   | 5秒       | 認証タイムアウト時間を指定します。                            | 起動       |
| /sql/notificationAddress                     | 239.0.0.1 | JDBC/ODBCクライアントが初期に接続するマルチキャストアドレスです。クライアントにはマスタノードが通知されます。 | 起動     |
| /sql/notificationPort                        | 41999     | JDBC/ODBCクライアントが初期に接続するマルチキャストポートです。ポート番号として指定可能な範囲の値を指定します。| 起動     |
| /sql/notificationInterval                    | 5秒       |JDBC/ODBCクライアントへのマスタ通知用マルチキャスト周期です。1s以上、2<sup>31</sup>s未満の値を指定します。     | 起動     |
| /security/authentication | INTERNAL       | 認証方式として、INTERNAL(内部認証) / LDAP(LDAP認証)のいずれかを指定。| 起動     |
| /security/ldapRoleManagement | USER      | GridDBのロールとマッピングする対象として、USER(LDAPユーザ名でマッピング) / GROUP(LDAPグループ名でマッピング)のいずれかを指定。| 起動     |
| /security/ldapUrl           |       | LDAPサーバを次の形式で指定。ldaps://host[:port] | 起動     |
| /security/ldapUserDNPrefix |         | ユーザのDN（識別子）を生成するために、ユーザ名の前に連結する文字列を指定。| 起動     |
| /security/ldapUserDNSuffix |        | ユーザのDN(識別子)を生成するために、ユーザ名の後に連結する文字列を指定。| 起動     |
| /security/ldapBindDn |         | LDAP管理ユーザのDNを指定。| 起動     |
| /security/ldapBindPassword |        | LDAP管理ユーザのパスワードを指定。| 起動     |
| /security/ldapBaseDn |        | 検索を開始するルートDNを指定。| 起動     |
| /security/ldapSearchAttribute |  uid     | 検索対象となる属性を指定。| 起動     |
| /security/ldapMemberOfAttribute | memberof | ユーザが所属するグループDNが設定された属性を指定。(ldapRoleManagement=GROUPの場合に有効)| 起動     |
| /system/serverSslMode | DISABLED        | SSL接続設定として、DISABLED(SSL無効)、PREFERRED(SSL有効、ただし非SSL接続も許容)、REQUIRED(SSL有効、非SSL接続は不可)のいずれかを指定。| 起動     |
| /system/sslProtocolMaxVersion | TLSv1.2 | TLSプロトコルバージョンとして、TLSv1.2, TLSv1.3のいずれかを指定。| 起動     |　


## ノード定義ファイル(gs_node.json)

ノード定義ファイルでは、クラスタを構成するノードのリソースを初期設定します。オンライン運用では、配置されているリソース、アクセス頻度などから、オンラインで値を変更できるパラメータもあります。

ノード定義ファイルの各設定項目の意味を以下に説明します。

初期状態で含まれていない項目も項目名を追加することでシステムに認識させることができます。 変更の欄ではパラメータの値の変更可否と変更タイミングを示します。
-   変更不可　：ノードを一度起動したのちは変更はできません。変更したい場合データベースを初期化する必要があります。
-   起動　　　：対象ノードを再起動することで、変更できます。
-   オンライン：オンライン稼働中にパラメータを変更できます。ただし、変更内容は永続化されないため、定義ファイルの内容を手動で変更する必要があります。

ディレクトリの指定は、フルパスもしくは、GS_HOME環境変数からの相対パスで指定します。相対パスは、GS_HOMEの初期ディレクトリが基点となります。GS_HOMEの初期設定ディレクトリは、/var/lib/gridstoreです。

| GridDBの構成                         | 初期値                     | パラメータの意味と制限値     | <span style="white-space: nowrap;">変更</span>       |
|--------------------------------------|----------------------------|---------------------------------|-----|
| /serviceAddress                      | なし                       | cluster,transaction,syncの各サービスアドレスの初期値を設定。3項目のアドレスを設定せずに本アドレスの設定のみで各サービスアドレスの初期値を設定できる。  | 起動       |
| /dataStore/dbPath                    | data                       | データファイル、チェックポイントログファイルの配置ディレクトリをフルパスもしくは、相対パスで指定する。   | 起動       |
| /dataStore/transactionLogPath        | txnlog                     | トランザクションログファイルの配置ディレクトリをフルパスもしくは、相対パスで指定する。   | 起動       |
| /dataStore/dbFileSplitCount          | 0 (分割無し)               | データファイルの分割数。   | 不可       |
| /dataStore/backupPath                | backup                     | バックアップファイルの配置ディレクトリのパスを指定。                                  | 起動       |
| /dataStore/syncTempPath              | sync                       | データ同期用一時ファイルの配置ディレクトリのパスを指定。                                  | 起動       |
| /dataStore/storeMemoryLimit          | 1024MB                     | データ管理用メモリの上限。                                                       | オンライン |
| /dataStore/concurrency               | 4                          | 処理の並列度を指定。                                                                        | 起動       |
| /dataStore/logWriteMode              | 1                          | ログ書き出しモード・周期を指定。 -1または0の場合トランザクション終了時にログ書き込み、1以上2<sup>31</sup>未満の場合、秒単位の周期でログ書き込み  | 起動       |
| /dataStore/persistencyMode           | 1(NORMAL)                  | 永続化モードでは、データ更新時の更新ログファイルの保持期間を指定する。1(NORMAL)、2(KEEP_ALL_LOG)　のいずれかを指定。"NORMAL" は、チェックポイントにより、不要になったトランザクションログファイルは削除されます。"KEEP_ALL_LOG"は、全てのトランザクションログファイルを残します。 | 起動       |
| /dataStore/affinityGroupSize         | 4                          | アフィニティグループ数                                                        | 起動       |
| /dataStore/storeCompressionMode      | NO_COMPRESSION   | データブロック圧縮モード                                                                | 起動       |
| /checkpoint/checkpointInterval       | 60秒                       | メモリ上のデータ更新ブロックを永続化するチェックポイント処理の実行周期         | 起動       |
| /checkpoint/partialCheckpointInterval  | 10                       | チェックポイント実行時に、チェックポイントログファイルへブロック管理情報を書き込む処理の分割数          | 起動       |
| /cluster/serviceAddress              | 上位のserviceAddressに従う | クラスタ構成用待ち受けアドレス                                            | 起動       |
| /cluster/servicePort                 | 10010                      | クラスタ構成用待ち受けポート                                             | 起動       |
| /cluster/notificationInterfaceAddress  | ""                       | マルチキャストパケットを送信するインターフェースのアドレスを指定 | 起動       |
| /sync/serviceAddress                 | 上位のserviceAddressに従う | クラスタ間でデータ同期のための受信アドレス                                 | 起動       |
| /sync/servicePort                    | 10020                      | データ同期用待ち受けポート                                              | 起動       |
| /system/serviceAddress               | 上位のserviceAddressに従う | 運用コマンド用待ち受けアドレス                                           | 起動       |
| /system/servicePort                  | 10040                      | 運用コマンド用待ち受けポート                                            | 起動       |
| /system/eventLogPath                 | log                        | イベントログファイルの配置ディレクトリのパス                            | 起動       |
| /system/securityPath | security        | サーバ証明書、秘密鍵の配置ディレクトリをフルパスもしくは、相対パスで指定。 | 起動     |
| /system/serviceSslPort | 10045 | 運用コマンド用待ち受けSSLポート | 起動     |
| /transaction/serviceAddress          | 上位のserviceAddressに従う | クライアント通信向けトランザクション処理用待ち受けアドレス(/transaction/localserviceAddressの指定がない場合、クラスタ内部通信向けも兼ねる)  | 起動       |
| /transaction/localServiceAddress     | 上位のserviceAddressに従う | クラスタ内部通信向けトランザクション処理用待ち受けアドレス  | 起動       |
| /transaction/servicePort             | 10001                      | トランザクション処理用待ち受けポート                                    | 起動       |
| /transaction/connectionLimit         | 5000                       | トランザクション処理接続数の上限                                       | 起動       |
| /transaction/totalMemoryLimit        | 1024MB | トランザクション処理用メモリエリアのサイズ上限値 | 起動 |
| /transaction/transactionTimeoutLimit | 300秒                      | トランザクションタイムアウト時間の上限値                             | 起動       |
| /transaction/reauthenticationInterval  | 0s(無効)                 | 再認証間隔。(指定時間を超えると再認証が行われ、既に接続中の一般ユーザに対する権限等の変更が反映される。) デフォルト(0s)の場合、再認証は無効。| オンライン       |
| /transaction/workMemoryLimit         | 128MB                      | トランザクション処理でのデータ参照(get、TQL)時のメモリの上限サイズ(並列度ごと)       | オンライン       |
| /transaction/notificationInterfaceAddress | ""                    | マルチキャストパケットを送信するインターフェースのアドレスを指定                | 起動       |
| /sql/serviceAddress                  | 上位のserviceAddressに従う | クライアント通信向けNewSQL I/Fアクセスの処理用待ち受けアドレス(/sql/localServiceAddressの指定がない場合、クラスタ内部通信向けも兼ねる)   | 起動       |
| /sql/localServiceAddress             | 上位のserviceAddressに従う | クラスタ内部通信向けNewSQL I/Fアクセスの処理用待ち受けアドレス   | 起動       |
| /sql/servicePort                     | 20001                      | NewSQL I/Fアクセスの処理用待ち受けポート                             | 起動       |
| /sql/storeSwapFilePath               | swap                       | SQL中間ストアのスワップファイルの配置ディレクトリのパス                 | 起動       |
| /sql/storeSwapSyncSize               | 1024MB                     | SQL中間ストアのスワップファイルのsyncおよび物理メモリキャッシュ消去を行うサイズ  | 起動       |
| /sql/storeMemoryLimit                | 1024MB                     | SQL処理でメモリ上に保持する中間データの最大値                                 | 起動       |
| /sql/workMemoryLimit                 | 32MB                       | SQL処理でオペレータが使用するメモリの最大値                                   | 起動       |
| /sql/workCacheMemory                 | 128MB                      | SQL処理でオペレータが使用するメモリのうち、使用後に解放せずにキャッシュするメモリサイズ  | 起動       |
| /sql/connectionLimit                 | 5000                       | NewSQL I/Fアクセスの処理接続数の上限                                      | 起動       |
| /sql/concurrency                     | 4                          | 同時実行スレッド数                                                         | 起動       |
| /sql/traceLimitExecutionTime         | 300秒                      | スロークエリをイベントログに残す実行時間の下限値                           | オンライン |
| /sql/traceLimitQuerySize             | 1000                       | スロークエリに残るクエリ文字列のサイズ上限(バイト)                         | オンライン |
| /sql/notificationInterfaceAddress    | ""                         | マルチキャストパケットを送信するインターフェースのアドレスを指定                       | 起動       |
| /trace/fileCount                     | 30                         | イベントログファイルの上限数                                                 | 起動       |
| /security/userCacheSize |  1000       | キャッシュする一般ユーザ/LDAPユーザエントリ数を指定。 | 起動     |
| /security/userCacheUpdateInterval |  60      | キャッシュの更新間隔（秒）を指定。| 起動     |



## --- システムの制限値 ---

## 数値に関する制限

| ブロックサイズ                             | 64KB        | 1MB～32MB          |
|--------------------------------------------|-------------|-------------------|
| 文字列型/空間型のデータサイズ              | 31KB        | 128KB             |
| BLOB型のデータサイズ                       | 1GB - 1Byte | 1GB - 1Byte       |
| 配列長                                     | 4000        | 65000             |
| カラム数                                   | 1024個      | 約7K～32000個(※1) |
| 索引数(コンテナ1個あたり)                  | 1024個      | 16000個           |
| ユーザ数                                   | 128         | 128               |
| データベース数                             | 128個       | 128個             |
| アフィニティグループ数                     | 10000       | 10000             |
| 解放期限付き時系列コンテナの分割数         | 160         | 160               |
| GridDBノードが管理する通信バッファのサイズ | 約2GB       | 約2GB             |

| ブロックサイズ             | 64KB        | 1MB         | 4MB         | 8MB         | 16MB        | 32MB        |
|----------------------------|-------------|-------------|-------------|-------------|-------------|-------------|
| パーティションサイズ       | 約4TB       | 約64TB      | 約256TB     | 約512TB     | 約1PB       | 約2PB       |

- 文字列型
  - 制限値はUTF-8エンコード相当
- 空間型
  - 制限値は内部格納形式相当
- (※1) カラム数
  - カラム数の上限には、固定長カラム(ブール型、整数型、浮動小数点数型、時刻型)の合計サイズが59KBまでという制約があります。この制約に当てはまらない場合は、カラム数の上限は32000個になります。
    - 例) LONG型カラムのみのコンテナの場合：カラム上限数は7552 ( 固定長カラムの合計サイズ 8B \* 7552 = 59KB )
    - 例) BYTE型カラムのみのコンテナの場合：カラム上限数は32000 ( 固定長カラムの合計サイズ 1B \* 32000 = 約30KB → 固定長カラムのサイズ制約には当てはまらないので、上限の32000個のカラムを作成できる)
    - 例) STRING型カラムのみのコンテナの場合：カラム上限数は32000 ( 固定長カラムのサイズ制約には当てはまらないので、上限の32000個のカラムを作成できる)

## ネーミングに関する制限

| 名前                   | 使用可能な文字                                     | 長さの上限                    |
|------------------------|----------------------------------------------------|-------------------------------|
| 管理ユーザ             | 先頭が"gs\#"で始まる。それ以外の文字は英数字、'\_' | 64文字                        |
| 一般ユーザ             | 英数字、'\_'、'-'、'.'、'/'、'='                   | 64文字                        |
| ロール            | 英数字、'\_'、'-'、'.'、'/'、'='                   | 64文字                        |
| パスワード             | Unicodeコードポイントを文字とする<br>任意個数の文字の列(NULL文字(U+0000)は不可) | 64バイト(UTF-8エンコード換算) |
| クラスタ名             | 英数字、'\_'、'-'、'.'、'/'、'='                   | 64文字                        |
| データベース名         | 英数字、'\_'、'-'、'.'、'/'、'='                   | 64文字                        |
| コンテナ名<br>テーブル名<br>ビュー名 | 英数字、'\_'、'-'、'.'、'/'、'='<br>(ノードアフィニティを指定する場合のみ'@') | 16384文字(ブロックサイズ64KB)<br>131072文字(ブロックサイズ1MB～32MB) |
| カラム名               | 英数字、'\_'、'-'、'.'、'/'、'='                   | 256文字                       |
| 索引名                 | 英数字、'\_'、'-'、'.'、'/'、'='                   | 16384文字(ブロックサイズ64KB)<br>131072文字(ブロックサイズ1MB～32MB) |
| バックアップ名         | 英数字、'\_'                                       | 12文字                        |
| データアフィニティ     | 英数字、'\_'、'-'、'.'、'/'、'='                   | 8文字                         |

- 大文字小文字の区別
  - クラスタ名・バックアップ名、パスワードは、大文字小文字の区別があります。したがって、例に示すような大文字小文字のみ異なる表記は、異なるものとして扱います。

    ```
    例) mycluster, MYCLUSTER
    ```

- それ以外の名前は、大文字小文字の区別がありません。大文字小文字表記は同一視します。
- 作成時に指定された大文字小文字の表記は、データとして保持します。
- TQL/SQL構文で名前を引用符"で囲う場合は、大文字小文字の表記を区別した検索を行います。

  ```
  例) コンテナ名 SensorData の Column1 を検索する場合
      select "Column1" from "SensorData"   検索可能
      select "COLUMN1" from "SENSORDATA"  "SENSORDATA"というコンテナは存在しないので検索不可
  ```

- TQL/SQL構文での名前指定
  - 引用符"で囲わない場合は、英数字、'\_'(数字は先頭不可)の名前しか記述できません。それ以外の名前を記述する場合には引用符で囲んでください。
    ```
    例) select "012column", data_15 from "container.2017-09"
    ```

## --- 付録 ---


## ディレクトリ構成<a href="https://www.global.toshiba/jp/products-solutions/ai-iot/griddb/product/griddb-ee.html?utm_source=griddb.net&utm_medium=referral&utm_campaign=commercial_badge"><badge text="商用版のみ" type="warning"/></a>

GridDBのサーバやクライアントをインストールした時のディレクトリ構成を以下に示します。X.x.xはGridDBのバージョンを表します。

```
(サーバ／クライアントをインストールしたマシン)
/usr/griddb-ee-X.X.X/                                    GridDBインストールディレクトリ
                     Readme.txt
                     bin/
                         gs_xxx                          各種コマンド
                         gsserver                        サーバモジュール
                         gssvc                           サーバモジュール
                     conf/
                     etc/
                     lib/
                         gridstore-tools-X.X.X.jar
                         XXX.jar                         フリーソフトウェア
                     license/
                     misc/
                     prop/
                     sample/

/usr/share/java/gridstore-tools.jar -> /usr/griddb-ee-X.X.X/lib/gridstore-tools-X.X.X.jar

/usr/griddb-ee-webui-X.X.X/                              統合運用管理GUIディレクトリ
                           conf/
                           etc/
                           griddb-webui-ee-X.X.X.jar

/usr/griddb-ee-webui/griddb-webui.jar -> /usr/griddb-ee-webui-X.X.X/griddb-webui-ee-X.X.X.jar

/var/lib/gridstore/                                      GridDBホームディレクトリ(作業ディレクトリ)
                   admin/                                統合運用管理GUIホームディレクトリ(adminHome)
                   backup/                               バックアップファイル格納ディレクトリ
                   conf/                                 定義ファイルの格納ディレクトリ
                        gs_cluster.json                  クラスタ定義ファイル
                        gs_node.json                     ノード定義ファイル
                        password                         ユーザ定義ファイル
                   data/                                 データベースファイル格納ディレクトリ
                   txnlog/                               トランザクションログ格納ディレクトリ
                   expimp/                               Export/Importツールディレクトリ
                   log/                                  イベントログ格納ディレクトリ
                   webapi/                               Web APIディレクトリ

/usr/bin/
         gs_xxx -> /usr/griddb-ee-X.X.X/bin/gs_xxx                       各種コマンドへのリンク
         gsserver -> /usr/griddb-ee-X.X.X/bin/gsserver                   サーバモジュールへのリンク
         gssvc -> /usr/griddb-ee-X.X.X/bin/gssvc                         サーバモジュールへのリンク

/usr/lib/systemd/system
            gridstore.service                            systemd ユニットファイル

/usr/griddb-ee-X.X.X/bin
            gridstore                                    サービススクリプト

(ライブラリをインストールしたマシン)
/usr/griddb-ee-X.X.X/                                    インストールディレクトリ
                     lib/
                         gridstore-X.X.X.jar
                         gridstore-advanced-X.X.X.jar
                         gridstore-call-logging-X.X.X.jar
                         gridstore-conf-X.X.X.jar
                         gridstore-jdbc-X.X.X.jar
                         gridstore-jdbc-call-logging-X.X.X.jar
                         gridstore.h
                         libgridstore.so.0.0.0
                         libgridstore_advanced.so.0.0.0
                         python/                         Pythonライブラリディレクトリ
                         nodejs/                         Node.jsライブラリディレクトリ
                             sample/
                             griddb_client.node
                             griddb_node.js
                         go/                             Goライブラリディレクトリ
                             sample/
                             pkg/linux_amd64/griddb/go_client.a
                             src/griddb/go_client/       Goライブラリのソースディレクトリ
                         conf/                           
                         javadoc/                           

/usr/griddb-ee-webapi-X.X.X/                             Web APIディレクトリ
                     conf/
                     etc/
                     griddb-webapi-ee-X.X.X.jar

/usr/girddb-webapi/griddb-webapi.jar -> /usr/griddb-ee-webapi-X.X.X/griddb-webapi-ee-X.X.X.jar

/usr/share/java/gridstore.jar -> /usr/griddb-ee-X.X.X/lib/gridstore-X.X.X.jar
/usr/share/java/gridstore-advanced.jar -> /usr/griddb-ee-X.X.X/lib/gridstore-advanced-X.X.X.jar
/usr/share/java/gridstore-call-logging.jar -> /usr/griddb-ee-X.X.X/lib/gridstore-call-logging-X.X.X.jar
/usr/share/java/gridstore-conf.jar -> /usr/griddb-ee-X.X.X/lib/gridstore-conf-X.X.X.jar
/usr/share/java/gridstore-jdbc.jar -> /usr/griddb-ee-X.X.X/lib/gridstore-jdbc-X.X.X.jar
/usr/share/java/gridstore-jdbc-call-logging.jar -> /usr/griddb-ee-X.X.X/lib/gridstore-jdbc-call-logging-X.X.X.jar


/usr/include/gridstore.h -> /usr/griddb-ee-X.X.X/lib/gridstore.h

/usr/lib64/                                             ※CentOSの場合は/usr/lib64、Ubuntu Serverの場合は/usr/lib/x86_64-linux-gnu
           libgridstore.so -> libgridstore.so.0
           libgridstore.so.0 -> libgridstore.so.0.0.0
           libgridstore.so.0.0.0 -> /usr/griddb-ee-X.X.X/lib/libgridstore.so.0.0.0
           libgridstore_advanced.so -> libgridstore_advanced.so.0
           libgridstore_advanced.so.0 -> libgridstore_advanced.so.0.0.0
           libgridstore_advanced.so.0.0.0 -> /usr/griddb-ee-X.X.X/lib/libgridstore_advanced.so.0.0.0
```
