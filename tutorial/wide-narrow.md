# Wide vs Narrow Data Tables

## Introduction

When beginning a new project which include structured data storage and retrieval, it is important to plan the schema with as much detail as possible. Will the application benefit from being more flexible or will sheer efficiency be more important? These sorts of questions can help shape the project and its schema into something more beneficial.

In this article, we will look at the differences between wide and narrow tables schemas. When describing tabular data as either wide or narrow, it simply means to describe a very general way in which that data is organized -- either into many columns where each column has a unique data variable or narrow tables, where one column contains the data variable name and the other column contains its value.

## Overview

Data in a wide form will have *all* variables in separate columns. This means, for example, that a table of sensor data with a timestamp as a rowkey, will have all pertinent info for that time span in the same row.

For narrow tables, one column defines the timestamp, one column the sensor id and another column shows the sensor value:

 | TIMESTAMP               | Sensor | Value  |
|-------------------------|-----------| ------|
| 2021-07-15 21:05:58.898 | 0         | 76.85 |
| 2021-07-15 21:05:58.898 | 1         | 63.66 |
| 2021-07-15 21:05:59.398 | 2         | 56.12 |
| 2021-07-15 21:05:59.998 | 3         |  27.79 |
| 2021-07-15 21:06:58.898 | 0         | 74.85 |
| 2021-07-15 21:06:58.898 | 1         | 65.66 |
| 2021-07-15 21:06:59.398 | 2         | 54.12 |
| 2021-07-15 21:06:59.998 | 3         |  29.79 |
| 2021-07-15 21:07:58.898 | 0         | 75.85 |
| 2021-07-15 21:07:58.898 | 1         | 62.66 |
| 2021-07-15 21:07:59.398 | 2         | 53.12 |
| 2021-07-15 21:07:59.998 | 3         |  28.79 |


For the wide table, each row contains the sensor value for all 3 sensors:

| TIMESTAMP | Sensor 0 | Sensor 1 | Sensor 2 | Sensor 3 | 
|-----------|------|-----|-------|------|-------|
| 2021-07-15 21:05:58.898 | 76.85 | 63.66 | 56.12 | 27.79 |
| 2021-07-15 21:05:58.898 | 74.85 | 65.66 | 54.12 | 29.85 |
| 2021-07-15 21:05:58.898 | 75.85 | 62.66 | 53.12 | 28.79 |

There are, of course, pros and cons to each method of organizing the data in these specific ways. For narrow columns, its main benefit is supreme flexibility -- it will always be extremely easy and hassle-free to additional metrics to track. For example, if you wanted to add a new sensor, you could simply write the row with that sensor ID. With a wide column table, you would either need to add a column or create a new schema and migrate the data. 

There are some downsides to narrow tables, while writes are easy, reads can be more difficult to build meaningfuly object schemas. Narrow tables also usually require [composite row keys](https://griddb.net/en/blog/composite-row-keys-and-griddb/) to ensure unique records and it easier to introduce erroneous data into the dataset as each data variable are in different rows. Some of the most useful queries for Narrow data schemas usually involve JOINs which are not available in TQL and most other NoSQL query languages and come with a large performance penality in SQL.

## Wide vs Narrow In GridDB

As an example, this is what a narrow collection container would look like in GridDB:

```python
    conInfo = griddb.ContainerInfo(name="narrow_collection",
                                   column_info_list=
                                   [["timestamp", griddb.Type.TIMESTAMP],
                                    ["sensor", griddb.Type.STRING],
                                    ["value", griddb.Type.FLOAT]],
                                   type=griddb.ContainerType.TIME_SERIES,
                                   row_key=True)
    col = gridstore.put_container(conInfo)
```

In this example, the signifying information would be found in the "value" column. With this schema, we can easily append new sensors without breaking a sweat. To query the data and put it into wide column data schema requires something like this:

```
data = {}
q = col.query("select *") 
rs = q.fetch(False)

while rs.has_next()
    row = rs.next()
    if data.has_key(row[0]):
        data[row[0]][row[1]] = row[2]
    else:
        data[row[0]] = { row[1] : row[2] }

```

An example schema for a wide time series container: 

```python
    conInfo = griddb.ContainerInfo(name="wide_collection",
                                   column_info_list=
                                   [["timestamp", griddb.Type.TIMESTAMP],
                                    ["sensor_0", griddb.Type.FLOAT],
                                    ["sensor_1", griddb.Type.FLOAT],
                                    ["sensor_2", griddb.Type.FLOAT],
                                    ["sensor_3", griddb.Type.FLOAT]],
                                   type=griddb.ContainerType.TIME_SERIES,
                                   row_key=True)
    col = gridstore.put_container(conInfo)
```

The standard rowset functions return all the data grouped together so no additional logic is required to group data from a certain timestamp.

## Wide vs. Narrow with Key-Container Architecture

GridDB's Key Container Architecture also impacts schema design allowing you to group like variables in one container as a wide column store, but also be able to add new containers with either heterogeneous (containers may be different) and homogeneous (all containers are different) schemas. Using containers can allow some of the flexibility of a narrow data schema while retaining the data consistency that makes wide data schemas high performing and easy to use.

## Conclusion

GridDB offers the ability to implement both narrow and wide data schemas. Narrow schemas offer great flexibility while wide data schemas offer simplicity.
