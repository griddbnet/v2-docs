# Quick Start

To get started with GridDB, we have prepared a sandbox of the GridDB server. You can get a quick rundown of the GridDB CLI from [GitHub](https://github.com/griddb/cli/blob/main/Specification_en.md) and from this [blog](https://griddb.net/en/blog/griddb-community-edition-v4-6-new-features/). 

We have pre-loaded some containers for easy access. These containers are called: `Cereal`, `c001`, `t001`, `WeatherStation`, and `InstrumentLog`. Of these containers, `t001`, and `InstrumentLog` are the [Time Series Containers](/architecture/data-model/#type).

To query these containers, you can use either SQL or TQL. If you are unfamiliar with TQL, it is the query language used by GridDB. It very similar to SQL but has some key differences; you can read more about TQL in this [blog](https://griddb.net/en/blog/griddb-query-language/) and [technical document](/tqlreference/tql-syntax-and-calculation-functions/). 

As a rapid fire, here are some examples of commands you can run now to get your feet wet with the shell:

- `showcontainer Cereal`
- `tql Cereal select *;`
- `sql select * from Cereal;`
    - as a follow up: `get` or `get 20`;

## About the Web CLI

Below this is a live GridDB Web CLI which you can use to interact with the GridDB Web server. When it is done loading, you will be assigned into your very own database. You can play around with this sandbox all you want -- you can delete or create containers to your heart's content. 

If you prefer a terminal-style separate window, you can open up a fully interactive GridDB Web CLI using this <a 
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

