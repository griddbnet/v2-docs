# Using the GridDB TimeSeries Expiration Function 

The GridDB Time Series Expiration function allows you to have data automatically removed that is beyond a certain age, allowing simpler management of continual data ingestion systems. There are many useful scenarios where you'd use time series expiration such as managing stored data size or expiring  authentication/verification tokens. 

Time Series Expiration must be set up when a container is created and cannot be changed afterwards. There are three variables used when setting up expiration: 

- Time Unit :  Defined within the GridDB client libraries and can be YEAR, MONTH, DAY, HOUR, MINUTE, SECOND, or MILLISECOND.
- Time or Number : The number of TimeUnits to expire row data after. For example if you set the number to 10 and TimeUnit to DAY, rows with a timestamp 10 days in the past will expire.
- Division Count : Controls when data is actually deleted. If you've set 10 DAYs as the expiry limit, and set division count to 2, all data older than 10 days old will not be present in the query but only 5 days of data (10/2) will be deleted every 5 days. The  [GridDB Technical Reference](http://www.toshiba-sol.co.jp/en/pro/griddb/docs-en/v4_1/GridDB_TechnicalReference.html#sec-4.3.7) explains the concept further.


## Java

In Java, the container must be defined using a ContainerInfo object instead of just specifying class used for the schema. The following code snippet creates a ContainerInfo with two columns (timestamp and value) and sets the row data to expire after 1 TimeUnit.MINUTE with a division count of 5, so data is deleted every 12 seconds.


```
        ContainerInfo containerInfo = new ContainerInfo();

        List<ColumnInfo> columnList = new ArrayList<ColumnInfo>();
        columnList.add(new ColumnInfo("timestamp", GSType.TIMESTAMP));
        columnList.add(new ColumnInfo("value", GSType.FLOAT));
        containerInfo.setColumnInfoList(columnList);

        containerInfo.setRowKeyAssigned(true);

        TimeSeriesProperties tsProp = new TimeSeriesProperties();
        tsProp.setRowExpiration(1, TimeUnit.MINUTE);
        tsProp.setExpirationDivisionCount(5);
        containerInfo.setTimeSeriesProperties(tsProp);


        TimeSeries<Row> tse = store.putTimeSeries(containerName, containerInfo, false);
```


With the container created, we can query and write data to it using the normal putTimeSeries function that takes a class specification as an argument. 

```
        Random r = new Random();
        TimeSeries<TSERow> ts = store.putTimeSeries(containerName ,TSERow.class);

        for(int i=0; i<20; i++) {
            TSERow row = new TSERow();
            row.timestamp = new Date();
            row.value = r.nextFloat();
            ts.put(row);

		    Query<TSERow> query = ts.query("select * order by timestamp asc limit 1");
            RowSet<TSERow> rs = query.fetch(false);
            if(rs.hasNext()) {
                row = rs.next();
                System.out.println("Oldest row is "+row.timestamp);
            }
            Thread.sleep(10000);

        }
```

The above code snippet writes a row to the container every 10 seconds and then reads the oldest row in the container which shows rows older than 1 minute being expired. 

```
Oldest row is Wed May 26 22:00:01 BST 2021
Oldest row is Wed May 26 22:00:01 BST 2021
Oldest row is Wed May 26 22:00:01 BST 2021
Oldest row is Wed May 26 22:00:01 BST 2021
Oldest row is Wed May 26 22:00:01 BST 2021
Oldest row is Wed May 26 22:00:01 BST 2021
Oldest row is Wed May 26 22:00:11 BST 2021
Oldest row is Wed May 26 22:00:11 BST 2021
Oldest row is Wed May 26 22:00:31 BST 2021
Oldest row is Wed May 26 22:00:41 BST 2021
Oldest row is Wed May 26 22:00:41 BST 2021
Oldest row is Wed May 26 22:00:51 BST 2021
Oldest row is Wed May 26 22:01:01 BST 2021
Oldest row is Wed May 26 22:01:11 BST 2021
Oldest row is Wed May 26 22:01:21 BST 2021
Oldest row is Wed May 26 22:01:31 BST 2021
Oldest row is Wed May 26 22:01:41 BST 2021
Oldest row is Wed May 26 22:01:51 BST 2021
Oldest row is Wed May 26 22:02:01 BST 2021
Oldest row is Wed May 26 22:02:11 BST 2021
```


## Python


Containers are usually created with a ColumnInfo object in the GridDB Python client, so to specify Time Series Expiration an ExpirationInfo object needs to be created and passed to the ColumnInfo object as the expiry parameter as demonstrated in the following code snippet:

```

expInfo = griddb.ExpirationInfo(1, griddb.TimeUnit.MINUTE, 5)

conInfo = griddb.ContainerInfo("tsepy",
    [["timestamp", griddb.Type.TIMESTAMP],
	["value", griddb.Type.FLOAT]],
	griddb.ContainerType.TIME_SERIES, expiration=expInfo)

ts = gridstore.put_container(conInfo)
```

Like with Java above, we write 20 rows to the container 10 seconds apart querying the oldest container:

```
i=0
while i < 20:
    ts.put([datetime.datetime.utcnow(), random.random()])

    q = ts.query("select * order by timestamp asc limit 1")
    rs = q.fetch(False)
    if rs.has_next():
        r = rs.next()
        print("Oldest is ",r[0])

    time.sleep(10)
    i=i+1
```

Which produces the following output:

```
Oldest is  2021-05-26 20:16:29.110000
Oldest is  2021-05-26 20:16:29.110000
Oldest is  2021-05-26 20:16:29.110000
Oldest is  2021-05-26 20:16:29.110000
Oldest is  2021-05-26 20:16:29.110000
Oldest is  2021-05-26 20:16:29.110000
Oldest is  2021-05-26 20:16:39.121000
Oldest is  2021-05-26 20:16:49.132000
Oldest is  2021-05-26 20:16:49.132000
Oldest is  2021-05-26 20:16:59.143000
Oldest is  2021-05-26 20:17:09.154000
Oldest is  2021-05-26 20:17:19.165000
Oldest is  2021-05-26 20:17:29.175000
Oldest is  2021-05-26 20:17:39.186000
Oldest is  2021-05-26 20:17:49.197000
Oldest is  2021-05-26 20:17:59.208000
Oldest is  2021-05-26 20:18:09.219000
Oldest is  2021-05-26 20:18:19.230000
Oldest is  2021-05-26 20:18:29.241000
Oldest is  2021-05-26 20:18:39.252000
```

## Conclusion

The complete `TSE.java` and `tse.py` examples can be downloaded from the [GridDB.net Github](https://github.com/griddbnet/Using-the-GridDB-TimeSeries-Expiration-Function).
