# Go





::: tip Notes
The array type for GridDB is not yet available for the Go Client. If your project absolutely requires the array type, please use the Python/C/Java Client instead.
:::

## インストール
### c_clientをインストールする
GridDB c_client（Goクライアントを使用するための前提条件）は、次の場所にあります：[https://github.com/griddb/c_client](https://github.com/griddb/c_client)。 RPMのダウンロードは[こちら](https://github.com/griddb/c_client/releases)。 最新のRPMを`wget`してインストールします。

``` bash
$ wget \
https://github.com/griddb/c_client/releases/download/v4.2.0/griddb_c_client-4.2.0-1.linux.x86_64.rpm
```
次に、rpmをインストールします。
``` bash
$ sudo rpm -ivh griddb_c_client-4.2.0-1.linux.x86_64.rpm
```
これでc_clientが`/usr/`ディレクトリにインストールされ、準備が整いました。Cクライアントをインストールしたら、`LD_LIBRARY_PATH`環境変数が新しく作成されたファイルを含むディレクトリを指すように設定します。

``` bash
$ export LD_LIBRARY_PATH=$LD_LIBRARY_PATH:/usr/griddb_c_client-4.2.0/lib
$ export LIBRARY_PATH=$LIBRARY_PATH:/usr/griddb_c_client-4.2.0/lib
```
### Goクライアントをインストールする
Goクライアントをインストールするには、いくつかの依存関係があるため、もう少し作業が必要です。 まずはGo言語をインストールして環境を設定してください。 その間、Goクライアントを正常に実行するには以下が必須であることに注意してください。
``` bash
$ export GODEBUG=cgocheck=0
```
これにより、特定のCポインター規則に従うデフォルトのGoの動作が無効になります（デフォルトはcgocheck=1）。このオプションの詳細については、こちらを参照してください：[https://golang.org/cmd/cgo/#hdr-Passing_pointers](https://golang.org/cmd/cgo/#hdr-Passing_pointers)　。
次に、いくつかの依存ソフトウェアをインストールしましょう。 次のコマンドをコピー＆ペーストする場合は、rootユーザーを切り替えてください。
まずはPCREをインストールします。
``` bash
$ wget https://sourceforge.net/projects/pcre/files/pcre/8.39/pcre-8.39.tar.gz
$ tar xvfz pcre-8.39.tar.gz
$ cd pcre-8.39
$ ./configure
$ make
$ make install
```
次はSWIGをインストールします。
``` bash
$ wget https://prdownloads.sourceforge.net/swig/swig-3.0.12.tar.gz
$ tar xvfz swig-3.0.12.tar.gz
$ cd swig-3.0.12
$ ./configure
$ make
$ make install
```
ここでGoクライアントをgithubからインストールします：[https://github.com/griddb/go_client/releases](https://github.com/griddb/go_client/releases)。
``` bash
$ wget \
https://github.com/griddb/go_client/archive/0.8.1.tar.gz
```
tarを解凍して`make`します。
``` bash
$ tar xvzf 0.8.1.tar.gz
$ cd go_client-0.8.1
$ make
```
これでGoクライアントが作成されました。Goクライアントを適切に使用できるよう、GOPATHがgoクライアントを指すように設定します。
``` bash
$ export GOPATH="${GOPATH}:/home/lib/go_client-0.8.1"
```
### インストール中に起こりうる問題
#### Make中に起こりうる問題
よく発生する問題の1つは、次のエラーです。

```
go install github.com/griddb/go_client
can't load package: package github.com/griddb/go_client:
  cannot find package "github.com/griddb/go_client"
```
これは、環境が適切に設定されていないことが原因です。 これが発生した場合、ディレクトリ内でmake cleanを実行して最初から開始し、CGOCHECKが0（無効）に設定され、LD_LIBRARY_PATHがGridDB Cクライアント（このパッケージではprereq/dependency）を指していることを確認してください。

### パッケージをコードにインポートする際に起こりうる問題
その他の起こりうる問題としては、Goがリモートパッケージ（標準ライブラリ外のライブラリ）を整理する方法に関連しています。 Goでは、リモートパッケージはgo getコマンドで取得され、yourgopath/src/packagerepository/accountname/packageに配置されます。 たとえば、Labstackからecho Webフレームワークをダウンロードすると、コードは/home/israel/go/src/github.com/labstack/echoに自動的に配置されます。 したがって、コードimport "github.com/labstack/echo"にエコーWebフレームワークをインポートする場合、Goはこれらのディレクトリを調べてコードを取得します。

これを知っている開発者は、Goクライアントをビルドし、既知のルールを使用して適切なディレクトリに配置し、プロジェクトをgo buildしようとします。 そうすると以下のようなエラーが出ます。

```
can't load package: package github.com/griddb/go_client: no Go files in /home/israel/go/src/github.com/griddb/go_client
```
これは簡単に修正することができます。デフォルトのGoパスや他の場所（/home/lib/など）からディレクトリを移動し、Goパスにこの新しい場所をセットします。

``` bash
$ export GOPATH="${GOPATH}:/home/lib/go_client-0.8.1
```