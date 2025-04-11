## CLI Quickstart

```bash{7}
$ sudo su gsadm
$ gs_sh

Loading "/var/lib/gridstore/.gsshrc"
The connection attempt was successful(NoSQL).
The connection attempt was successful(NewSQL).
gs[public]>
```


You can get a quick rundown of the GridDB CLI from [GitHub](https://github.com/griddb/cli/blob/main/Specification_en.md) and from this [blog](https://griddb.net/en/blog/griddb-community-edition-v4-6-new-features/). 


## Create Containers

You can easily create a timeseries container like so: 

createtimeseries &lt;Container name&gt; &lt;Compression method&gt; &lt;Column name&gt; &lt;Column type&gt; [&lt;Column name&gt; &lt;Column type&gt; ...]

So in action it looks like:

`createtimeseries ts NO colTS timestamp`

With this command, you will create a Time Series Container called ts, using the `NO` compression method (other options: `SS` and `HI`), with a singular column called colTS of type timestamp. 

Once you do that, enter

`showcontainer ts` 

to verify creation of timeseries container.

To do accomplish the same with a Collection container, the command is essentially the same: 

createcollection &lt;Container name&gt; &lt;Column name&gt; &lt;Column type&gt; [&lt;Column name&gt; &lt;Column type&gt; ...]

`createcollection col col01 string`

and then

`showcontainer col`

## Put Rows

To insert data into your collection container like so: 

putrow containername value [value...]

`putrow col test`

to verify your contents: 

`tql col select *;`

and then: 

`get`

## Querying

### SQL

To do a basic SQL query, begind your command with `sql` and ends with a semi-colon.

`sql select * from c001;`

This will perform a search. Once the search is completed, you can simply run `get` to show the results. You can also specificy the number of rows to show: `get 2`.

And because it's full SQL, you can do more advanced calls like `sql select * from Cereal ORDER BY CALORIES DESC;`

You can also do an aggregate call: `sql SELECT AVG(sugars) from Cereal;`. 

### TQL

In TQL, you start the command with the letters `tql` and the container name and then end with a semi-colon. You can order your results like:

`tql t001 select * order by localtime asc;`

You can also use conditional operators like `where`. Here's an example: 

`tql t001 where localtime > TO_TIMESTAMP_MS(1357068660000)`

It should return 4 out 6 results.