# Metatables

## About metatables

The metatables are tables that are used for checking metadata of data management in GridDB.

[Memo]
- Metatables can only be referred. It is not allowed to register or delete data in the metatables.
- When [SELECT](#select) data from the metatables, it is necessary to enclose the table name with double quotation marks.

[Points to note]
- The schema of metatables may be changed in future version.

## Table information

Table information can be obtained.

**Table name**

#tables

**Schema**

| Column name                        | Item                                                | Type      |
|----------------------------|-----------------------------------------------------|---------|
| DATABASE_NAME              | Database name                                      | STRING  |
| TABLE_NAME                 | Table name                                          | STRING  |
| TABLE_OPTIONAL_TYPE         | Table type <br>COLLECTION / TIMESERIES           | STRING  |
| DATA_AFFINITY              | Data affinity                                  | STRING  |
| EXPIRATION_TIME            | Expiry release elapsed time                                    | INTEGER |
| EXPIRATION_TIME_UNIT        | Expiry release elapsed time unit                                    | STRING  |
| EXPIRATION_DIVISION_COUNT   | Expiry release division count                                      | STRING  |
| COMPRESSION_METHOD         | Time series compression method                                      | STRING  |
| COMPRESSION_WINDOW_SIZE     | Time series compression max period of thinning                            | INTEGER |
| COMPRESSION_WINDOW_SIZE_UNIT | Time series compression max period unit of thinning                        | STRING  |
| PARTITION_TYPE             | Partitioning type                              | STRING  |
| PARTITION_COLUMN           | Partitioning key                              | STRING  |
| PARTITION_INTERVAL_VALUE    | Interval value (For interval or interval hash)   | INTEGER |
| PARTITION_INTERVAL_UNIT     | Interval unit (For interval of interval hash) | STRING  |
| PARTITION_DIVISION_COUNT    | Division count (For hash)                            | INTEGER |
| SUBPARTITION_TYPE          | Partitioning type<br>("Hash" for interval hash)| STRING  |
| SUBPARTITION_COLUMN        | Partitioning key<br>(for interval hash)| STRING  |
| SUBPARTITION_INTERVAL_VALUE | Interval value                                              | INTEGER |
| SUBPARTITION_INTERVAL_UNIT  | Interval unit                                            | STRING  |
| SUBPARTITION_DIVISION_COUNT | Division count<br> (For interval hash)             | INTEGER |
| EXPIRATION_TYPE            | Expiration type<br> ROW / PARTITION                  | STRING  |

## Index information

Index information can be obtained.

**Table name**

#index_info

**Schema**

| Column name             | Item                         | Item     |
|------------------|------------------------------|--------|
| DATABASE_NAME    | Database name                | STRING |
| TABLE_NAME       | Table name                    | STRING |
| INDEX_NAME       | Index name                        | STRING |
| INDEX_TYPE       | Index type<br> TREE / HASH / SPATIAL     | STRING |
| ORDINAL_POSITION | Column order in index (sequential number from 1)        | SHORT  |
| COLUMN_NAME      | Column name                         | STRING |

## Partitioning information

Data about partitioned tables can be obtained from this metatable.

**Table name**

#table_partitions

**Schema**

| Column name                | Item                                         | Type   |
| -------------------------- | -------------------------------------------- | ------ |
| DATABASE_NAME             | Database name                                | STRING |
| TABLE_NAME                | Partitioned table name                       | STRING |
| PARTITION_BOUNDARY_VALUE | The lower limit value of each data partition | STRING |


**Specifications**

- Each row represents the information of a data partition.
  - For example, when searching rows of a hash partitioned table in which the division count is 128, the number of rows displayed will be 128.
- In the metatable "#table_partitions", the other columns may be displayed besides the above columns.
- It is required to cast the lower limit value to the partitioning key type for sorting by the lower limit value.

**Examples**

- Check the number of data partitions
    
  ``` sh
  SELECT COUNT(*) FROM "#table_partitions" WHERE TABLE_NAME='myIntervalPartition';
    
  COUNT(*)
  -----------------------------------
   8703
  ```

- Check the lower limit value of each data     partition
    
  ``` sh
  SELECT PARTITION_BOUNDARY_VALUE FROM "#table_partitions" WHERE TABLE_NAME='myIntervalPartition'
  ORDER BY PARTITION_BOUNDARY_VALUE;
    
  PARTITION_BOUNDARY_VALUE
  -----------------------------------
  2016-10-30T10:00:00Z
  2017-01-29T10:00:00Z
            :
  ```

- Check the lower limit value of each data partitions on the interval partitioned table "myIntervalPartition2" (partitioning key type:     INTEGER, interval value: 20000)
    
  ``` sh
  SELECT CAST(PARTITION_BOUNDARY_VALUE AS INTEGER) V FROM "#table_partitions"
  WHERE TABLE_NAME='myIntervalPartition2' ORDER BY V;
    
  PARTITION_BOUNDARY_VALUE
  -----------------------------------
  -5000
  15000
  35000
  55000
    :
  ```

## View information

View information can be obtained.

**Table name**

#views

**Schema**

| Column name      | Item                           | Type   |
| ---------------- | ------------------------------ | ------ |
| DATABASE_NAME   | Database name                  | STRING |
| VIEW_NAME       | View name                      | STRING |
| VIEW_DEFINITION | View defining character string | STRING |

## Information about an SQL in execution

The information about SQL , a query or a job, under execution can be obtained.

**Table name**

#sqls

**Schema**

| Column name       | Item                                          | Type      |
| ----------------- | --------------------------------------------- | --------- |
| DATABASE_NAME    | Database name                                 | STRING    |
| NODE_ADDRESS     | address of the node being processed (system)  | STRING    |
| NODE_PORT        | The port of the node being processed (system) | INTEGER   |
| START_TIME       | Processing start time                         | TIMESTAMP |
| APPLICATION_NAME | Application name                              | STRING    |
| SQL               | Query character string                        | STRING    |
| QUERY_ID         | Query ID                                      | STRING    |
| JOB_ID           | Job ID                                        | STRING    |

## Information about an event in execution

The information about the event under execution can be obtained.

**Table name**

#events

**Schema**

| Column name               | Item                                           | Type      |
| ------------------------- | ---------------------------------------------- | --------- |
| NODE_ADDRESS             | address of the node being processed (system)   | STRING    |
| NODE_PORT                | The port of the node being processed (system)  | INTEGER   |
| START_TIME               | Processing start time                          | TIMESTAMP |
| APPLICATION_NAME         | Application name                               | STRING    |
| SERVICE_TYPE             | Service type (SQL/TRANSACTION/CHECKPOINT/SYNC) | STRING    |
| EVENT_TYPE               | Event types (PUT/CP_START/SYNC_START etc.)   | STRING    |
| WORKER_INDEX             | Thread number of a worker                      | INTEGER   |
| CLUSTER_PARTITION_INDEX | Cluster partition number                       | INTEGER   |

## Connection information

The information about the connected connection can be obtained.

**Table name**

#sockets

**Schema**

| Column name               | Item                                                      | Type      |
| ------------------------- | --------------------------------------------------------- | --------- |
| SERVICE_TYPE             | Service type (SQL/TRANSACTION)                            | STRING    |
| SOCKET_TYPE              | Socket type                                               | STRING    |
| NODE_ADDRESS             | Connection source node address (viewed from a node)       | STRING    |
| NODE_PORT                | Connection source node port (viewed from a node)          | INTEGER   |
| REMOTE_ADDRESS           | Connection destination node address (viewed from a node)  | STRING    |
| REMOTE_PORT              | Connection destination node port (viewed from a node)     | INTEGER   |
| APPLICATION_NAME         | Application name                                          | STRING    |
| CREATION_TIME            | Socket generation time                                    | TIMESTAMP |
| DISPATCHING_EVENT_COUNT | Total number of times to start request for event handling | LONG      |
| SENDING_EVENT_COUNT     | Total number of times to start event transmission         | LONG      |

the socket types are as follows.

| Value     | Description                                                                |
| --------- | -------------------------------------------------------------------------- |
| SERVER    | TCP connection between servers                                             |
| CLIENT    | TCP connection with a client                                               |
| MULTICAST | Multicasting socket                                                        |
| NULL      | In case currently unidentified during the cases such as connection attempt |

**Examples**

Only in case of TCP connection with a client (socket type: CLIENT), it can be determined whether the connection is waiting for execution.


Specifically, if DISPATCHING_EVENT_COUNT is larger than SENDING_EVENT_COUNT, it can be determine that the possibility is relatively high that the time waiting for execution existed.


``` sh
SELECT CREATION_TIME, NODE_ADDRESS, NODE_PORT, APPLICATION_NAME FROM "#sockets"
WHERE SOCKET_TYPE='CLIENT' AND DISPATCHING_EVENT_COUNT > SENDING_EVENT_COUNT;

CREATION_TIME             NODE_ADDRESS   NODE_PORT  APPLICATION_NAME
--------------------------------------------------------------------
2019-03-27T11:30:57.147Z  192.168.56.71  20001      myapp
2019-03-27T11:36:37.352Z  192.168.56.71  20001      myapp
          :
```