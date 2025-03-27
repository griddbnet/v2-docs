# クエリ言語

## TQL



### TQLとは？?
TQLは、GridDBで使用されるクエリ言語です。 SQLに非常に似ていますが、いくつかの大きなな違いがあります。 このブログ記事では、クエリステートメントの基本構造と、返される結果を変更するためのいくつかの方法について説明します。 最初に、最も単純なTQLクエリを見てみましょう。

```sql
select *
```

SQLとは異なり、テーブルやコンテナは指定されません。 これは、クエリが特定のコンテナ、コレクションオブジェクトに対して実行されるためです。 集計クエリを実行していない限り、個々の列を指定することはできません。 集約の詳細については、ブログ記事[GridDBの集計関数](https://griddb.net/ja/blog/aggregation-with-griddb/)をご覧ください。

### 条件演算子
SQLと同様に、where演算子、and、not、orおよび括弧は、特定の条件セットを満たす取得データを選択するために使用されます。 
``` sql
select * where temperature > 25.0 and (dayofweek = "Saturday" or dayofweek = "Sunday") 
```
Date・TIMESTAMP列で条件演算子を使用する場合は、文字列の日付またはUnixエポック値と比較するだけではなく、代わりに組み込み関数を使用する必要があります。 
```sql
select * where timestamp > TO_TIMESTAMP_MS(1560208106016) 
```
あるいは 
```sql
select * where timestamp > TIMESTAMP('2019-01-01T18:00:00Z') 
```
ブール値の条件演算子も、SQLの対応する演算子とわずかに異なります。 たとえば、SQLでは、列がTrueまたはFalseに等しいかどうかを確認します。 しかし、TQLでは、
```sql
select * where completed
```
あるいは
```sql
select * where not completed
```
順序
デフォルトでは、GridDBはデータベースに挿入された順序で結果を返します。つまり最も古い結果が最初に返されます。 これを変更するには、order by演算子をascまたはdesc 演算子とともに使用します。 ascまたは昇順は、最初に最低値の結果を返しますが、descは反対に、最高値の結果を最初に返し、次に二番目に高い値の結果を返します。 
```sql
select * order by timestamp asc
```
```sql
select * order by timestamp desc
```amp desc
```

制限とオフセットSQLと同様に、TQLはクエリによって返される行数を制限する制限演算子をサポートしています。 
```sql
select * limit 100 
```
次の100行をフェッチするために、オフセットを使用します。 
```sql
select * limit 100 offset 100 
```
マルチクエリでlimitおよびoffsetを使用する場合、指定する数値はコンテナごとに指定する必要があります。まとめると、次のようになります。
```sql
select * where temperature > 20.0 order by timestamp desc limit 100
```