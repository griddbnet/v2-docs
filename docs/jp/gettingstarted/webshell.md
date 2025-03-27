# クイックスタート

GridDBを始めるにあたり、GridDBサーバーのサンドボックスを用意しました。GridDBのCLIについては、[GitHub](https://github.com/griddb/cli/blob/main/Specification_ja.md)やこちらの[ブログ](https://griddb.net/ja/blog/griddb-community-edition-v4-6-new-features//)で簡単に紹介されています。

簡単にアクセスできるようにいくつかのコンテナをあらかじめ用意しています。`Cereal`, `c001`, `t001`, `WeatherStation`, と`InstrumentLog` のコンテナが登録されています。これらのコンテナのうち、`t001` と `InstrumentLog` は [Time Series Containers](/ja/architecture/data-model/#種別) と呼ばれるコンテナです。

コンテナのクエリはSQLまたはTQLを使用します。TQLは、GridDBで使用されるクエリ言語です。TQLについては、こちらの[ブログ](https://griddb.net/ja/blog/griddb-query-language/)や [技術資料](/ja/tqlreference/tql-syntax-and-calculation-functions/) で詳しく説明されています。

シェルを使い始めるために実行できるコマンドの例をいくつか紹介します。

- `showcontainer Cereal`
- `tql Cereal select *;`
- `sql select * from Cereal;`
    - 続いて、 `get` or `get 20`;

## Web CLIについて

この下に、GridDBのWebサーバと対話するためのGridDB Web CLIがあります。ロードが完了すると、自分専用のデータベースにアサインされます。このサンドボックスは、コンテナを削除したり作成したりと、自由に遊んでください。

ターミナル形式の別ウィンドウがお好みなら、次のようにして完全に対話的な GridDB Web CLI を開くことができます。 <a 
onclick="window.open(this.href, 'mywin',
'left=20,top=20,width=500,height=500,toolbar=1,resizable=0'); return false;" 
href="https://demo.griddb.net">link </a>.

<div style="display:flex; justify-content:space-around;">
<iframe id="inlineFrameExample"
    title="Inline Frame Example"
    width="600"
    height="400"
    src="https://demo.griddb.net">
</iframe>
</div>


## コンテナの作成

このように簡単に時系列コンテナを作成することができます。

createtimeseries &lt;Container name&gt; &lt;Compression method&gt; &lt;Column name&gt; &lt;Column type&gt; [&lt;Column name&gt; &lt;Column type&gt; ...]

例えば：

`createtimeseries ts NO colTS timestamp`

このコマンドでは、tsという名前の時系列コンテナを作成します。圧縮方法は `NO` (他のオプションは `SS` と `HI`) で、カラム名は timestamp 型の colTS とします。

そのあとは：

`showcontainer ts` 

を使用して、タイムセリーズコンテナの作成を確認します。

Collectionコンテナで同じことを行うには、コマンドは基本的に同じです。

createcollection &lt;Container name&gt; &lt;Column name&gt; &lt;Column type&gt; [&lt;Column name&gt; &lt;Column type&gt; ...]

`createcollection col col01 string`

そして

`showcontainer col`

## 列の書き込み

コレクションコンテナにデータを挿入するには 

putrow containername value [value...]

`putrow col test`

内容を確認してください：

`tql col select *;`

そして: 

`get`

## クエリ

### SQL

基本的なSQLクエリを実行するには、コマンドを`sql`で始め、セミコロンで終了させます。

`sql select * from c001;`

これで検索が実行されます。検索が完了したら、 `get` を実行するだけで結果を表示することができます。また、表示する行数を指定することもできます。 `get 2`。

また、`sql select * from Cereal ORDER BY CALORIES DESC;`のように、より高度な呼び出しを行うことも可能です。

また、アグリゲートコールも可能です。 `sql SELECT AVG(sugars) from Cereal;`. 

### TQL

TQL では、コマンドを `tql` という文字とコンテナ名で開始し、セミコロンで終了します。結果を順序付けることができます。

`tql t001 select * order by localtime asc;`

また、`where`のような条件演算子も使うことができます。以下はその例です。

`tql t001 where localtime > TO_TIMESTAMP_MS(1357068660000)`

6件中4件が表示されます。

