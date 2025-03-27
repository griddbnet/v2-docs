# Query Language

## TQL

If you prefer learning via video:

### What is TQL?
TQL is the query language used by GridDB; it is very similar to SQL but with some notable differences. In this blog post, we'll go over the basic structure of the query statement and the different methods to alter what results are returned. First, let's look at the simplest TQL query: 

```sql
select *
```

Unlike SQL, no table or container is specified. This is because the query is run against a specific container/collection object. Unless you're performing an aggregation query, you cannot specify individual columns. More info on aggregation can be found in the [Aggregation blog post]((https://griddb.net/ja/blog/aggregation-with-griddb/)).

### Conditional Operators
Just like SQL, the where operator along with and, not, or, and parentheses are used to only select fetch data that meet a certain set of conditions. 
``` sql
select * where temperature > 25.0 and (dayofweek = "Saturday" or dayofweek = "Sunday") 
```
If you want to use a conditional operator on a Date/TIMESTAMP column you cannot just compare against a String date or Unix Epoch value, instead you need to use built-in functions: 
```sql
select * where timestamp > TO_TIMESTAMP_MS(1560208106016) 
```
or 
```sql
select * where timestamp > TIMESTAMP('2019-01-01T18:00:00Z') 
```
Conditional operators for booleans slightly differ from its SQL counterpart as well. For example, in SQL, you'd check to see if the column is equal to True or False. But in TQL: 
```sql
select * where completed
```
or
```sql
select * where not completed
```
Ordering
By default GridDB will return results in the order they were inserted into the database: oldest results are returned first. To change this, the order by operator is used along with either the asc or desc operator. asc or ascending will return the lowest result first while desc is the opposite, returning the highest result first followed by the next highest and so on. 
```sql
select * order by timestamp asc
```
```sql
select * order by timestamp desc
```

Limits and Offsets
Just like SQL, TQL supports the limit operator, which limits the number of rows returned by a query. 
```sql
select * limit 100 
```
To fetch the next 100 rows, offset is also used: 
```sql
select * limit 100 offset 100 
```
One important thing to note, when using limit and offset with multi-query: the specified numbers are per container. Now, if we put everything together, we end up with: 
```sql
select * where temperature > 20.0 order by timestamp desc limit 100
```