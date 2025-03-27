# Release Notes

## v5.1

Main changes in GridDB CE V5.1 are as follows:

- Configuration for communication path between client and server

    - Multiple communication paths can now be configured from the GridDB client and server. The new setting makes it possible for GridDB clients to configure access to GridDB cluster, allowing communication via the private and public networks in parallel. (This feature is currently supported by the Java client, JDBC driver.)

Note: Until now, the server setting has limited the client to a single communication route, either the internal or external communication route, and the client could not individually select which communication route to use.

---

### Configuration for communication path between client and server

#### Settings for GridDB Server

When you use both the external and internal communication,
edit the node definition file and the cluster definition file.

Set the following parameters in the node definition file (gs_node.json).
  * /transaction/publicServiceAddress (New): external communication address for accessing transaction services
  * /sql/publicServiceAddress (New): external communication address for accessing SQL services

Note: /transaction/localServiceAddress, /sql/localServiceAddress have been removed.

Example:

```
{
                 :
                 :
    "transaction":{
        "serviceAddress":"172.17.0.44",
        "publicServiceAddress":"10.45.1.10",        
        "servicePort":10001
    },      
    "sql":{
      "serviceAddress":"172.17.0.44",
      "publicServiceAddress":"10.45.1.10",      
      "servicePort":20001
    },
                 :
                 : 
```

Set the following parameters in the cluster definition file (gs_cluster.json) with fixed list method.
  * /transactionPublic (New): external communication address and port number for accessing transaction services
  * /sqlPublic (New): external communication address and port number for accessing SQL services

Example:

```
{
                             :
                             :
    "cluster":{
        "clusterName":"yourClusterName",
        "replicationNum":2,
        "heartbeatInterval":"5s",
        "loadbalanceCheckInterval":"180s",
        "notificationMember": [
            {
                "cluster": {"address":"172.17.0.44", "port":10010},
                "sync": {"address":"172.17.0.44", "port":10020},
                "system": {"address":"172.17.0.44", "port":10040},
                "transaction": {"address":"172.17.0.44", "port":10001},
                "sql": {"address":"172.17.0.44", "port":20001},
                "transactionPublic": {"address":"10.45.1.10", "port":10001},
                "sqlPublic": {"address":"10.45.1.10", "port":20001}
            }
        ]
    },
                             :
                             :
}
```

#### Settings for GridDB Client

When multiple communication routes are configured for the GridDB cluster (server side), the communication route can be selected.
- The internal communication is selected by default.
- When you use the external communication, set "PUBLIC" in the connectionRoute property (New).

Example: 

(Java client)
```Java
Properies prop = new Properties();
props.setProperty("notificationMember", "10.45.1.10:10001");
props.setProperty("connectionRoute", "PUBLIC");
...
GridStore store = GridStoreFactory.getInstance().getGridStore(prop);
```

(JDBC driver)
```
url = "jdbc:gs:///yourClusterName/?notificationMember=10.45.1.10:20001&connectionRoute=PUBLIC"
```

## v5.0

### Performance improvement for large-scale data

1. Core scaling improvement

    - By restarting a node, concurrency (/dataStore/concurrency in the node definition file) can now be changed.

2. Faster scan and data deletion

    - By setting the string **#unique** as hint information for data affinity, it is now possible to occupy blocks on a per container (table) basis to place data.

3. Reduction of the disk I/O load when performing a checkpoint

    - It is now possible to write logs in several smaller batches during a checkpoint. The number of batches (splits) can be modified by /checkpoint/partialCheckpointInterval in the node definition file. It is 5 by default. While increasing the settings value can decrease the amount of writing to a checkpoint log file at a time, this may increase the recovery time during a startup.

### Functionality enhancement

4. Renaming a column using SQL

    - The following SQL is supported:

    ALTER TABLE *table name* RENAME COLUMN *column name before renaming* TO *column name after renaming*;

5. GridDB Service

    - When the OS starts (stops), we can start (stop) GridDB Server. Please refer to [GridDB_Service.md](GridDB_Service.md) for details.

6. [Export/Import tool](https://github.com/griddb/expimp)

    - A tool to export/import data from and to a GridDB cluster.

### Specification Changes

#### Database files placement

Prior to V5, checkpoint file and transaction log file are placed on the "data" directory.

In V5, the arrangement is as follows: 

  * Conventional checkpoint file is divided into data file (extension: "dat") for writing data and checkpoint log file (extension: "cplog") for writing block management information.
  * Data files and checkpoint log files are written to the "data" directory, and the transaction log files are written to  the "txnlog" directory.
  * Within the "data" ("txnlog") directory, a directory is created for each partition and files are placed in the partition directory.

#### Added Parameters

The following parameters are added to the node definition file (gs_node.json).

  * /dataStore/transactionLogPath : Specify the full or relative path to the location directory for a transaction log file. The default value is txnlog.

  * /checkpoint/partialCheckpointInterval : Specify the number of splits in write processing of block management information to checkpoint log files during a checkpoint.

### Notations

- Current version is not compatible with the previous GridDB versions. To use V4 data, please retrieve data using the export tool and store them in V5 database using the import tool.
- Hash index, Row expiry release, Timeseries compression and Trigger function have been discontinued in V5.
Please use Tree index, Partition expiry release, and Block data compression instead of Hash index, Row expiry release, and Timeseries compression.

## v4.6

### Enhanced Functionality and Performance Improvement for SQL

- Aggregate functions with DISTINCT and WINDOW function are added.
- SQL processing for various data types has been improved.

### CLI(Command Line Interface)

- The GridDB CLI provides command line interface tool to manage GridDB cluster operations and data operations.

## v4.5

### NoSQL and SQL dual interface

GridDB CE v4.5 combines NoSQL and SQL dual interface capabilities, offering high performance and an improved ease of use.

1. Added SQL Interface and JDBC Driver
    - In addition to the NoSQL interface, it is now possible to access the database using SQL with the JDBC driver.
    - SQL92 compliant such as Group By and Join between different tables.
2. Added Table Partitioning functionality
   - By allocating the data of a huge table in a distributed manner, it is now possible to execute the processors in parallel and speed up access.
3. Multiple nodes clustering is changed to a single node setup.

## v4.3

Main changes in GridDB CE v4.3 are as follows:

### Scale Up Enhancement

1. Larger Block Size
   - Selectable block size increased to 32MB. A larger block size means more data can be managed per node, and a better performance in scanning large amount of data can be achieved.
2. Split Checkpoint File Placement
   - Checkpoint files can be split and distributed on multiple directories, thus increasing the amount of data that can be managed per node. Disk access performance also improves.
3. Network Interface Isolation
   - Different network interface can be set for external communication between client and nodes, and internal communication between nodes. As a result, network load can be distributed.

### Performance Improvement

4. Composite Index
    - Index can be set across multiple columns. Using composite index can improve performance.

### Enhanced Functionality

5. Composite RowKey
    - Rowkey can be set across multiple columns. Values across the columns must be unique. Database design is easier as composite rowkey can be used in place of surrogate key.
6. TimeZone
    - TimeZone's timestamp expression can now be specified with "+hh:mm" or "-hh:mm" format.

---

#### 1. Larger Block Size

Selectable block size are 64KB, 1MB, 4MB, 8MB, 16MB, 32MB. For normal usage, please use the default 64KB block size.

Block size setting can be found in the cluster definition file (gs_cluster.json) under /dataStore/storeBlockSize.

#### 2. Split Checkpoint File Placement

Checkpoint files can be split and distributed to multiple directories.

Set the following parameters in the node definition file (gs_node.json).
- /dataStore/dbFileSplitCount: Split number
- /dataStore/dbFilePathList: Location of the checkpoint files.

Ex.)

    ```    
	"dataStore":{
        "dbFileSplitCount": 2,
        "dbFilePathList": ["/stg01", "/stg02"],
    ```    

#### 3. Network Interface Isolation

GridDB node supports 2-type of communications for transaction processing: external communication between client and nodes and internal communication between nodes.

Prior to this update, both communications used the same network interface. It is now possible to separate the networks.

Set the following parameters in the node definition file (gs_node.json).
- /transaction/serviceAddress: external communication address
- /transaction/localServiceAddress(New): internal communication address

Ex.)

    ```    
    "cluster":{
        "serviceAddress":"192.168.10.11",
        "servicePort":10010
    },
    "sync":{
        "serviceAddress":"192.168.10.11",
        "servicePort":10020
    },
    "system":{
        "serviceAddress":"192.168.10.11",
        "servicePort":10040,
              :
    },
    "transaction":{
        "serviceAddress":"172.17.0.11",
        "localServiceAddress":"192.168.10.11",
        "servicePort":10001,
              :
    },

    ```

#### 4. Composite Index

Index can be set across multiple columns for Tree-Index.

When we use Java Client, we can set and get the list of column names (or column identifiers) with the following methods in IndexInfo class.
- void setColumnName(java.lang.String columnName)
- void setColumnList(java.util.List<java.lang.Integer> columns)
- java.util.List<java.lang.String> getColumnNameList()
- java.util.List<java.lang.Integer> getColumnList()

Please refer to (3) in [CreateIndex.java](https://github.com/griddb/griddb_nosql/blob/master/sample/guide/ja/CreateIndex.java).

And when we use C Client, please refer to compositeInfo in [CreateIndex.c](https://github.com/griddb/c_client/blob/master/sample/guide/ja/CreateIndex.c).

#### 5. Composite RowKey

Rowkey can be set to multiple consecutive columns from the first column for Collection container.

When we use Java Client, composite rowkey can be set with the following methods in ContainerInfo class.
- void setRowKeyColumnList(java.util.List<java.lang.Integer> rowKeyColumnList)

Ex.)  
    containerInfo.setRowKeyColumnList(Arrays.asList(0, 1));

Please refer to buildContainerInfo() in [CompositeKeyMultiGet.java](https://github.com/griddb/griddb_nosql/blob/master/sample/guide/ja/CompositeKeyMultiGet.java).

And when we use C Client, please refer to rowKeyColumnList in [CompositeKeyMultiGet.c](https://github.com/griddb/c_client/blob/master/sample/guide/ja/CompositeKeyMultiGet.c).

#### 6. TimeZone

TimeZone's timestamp expression can now be specified with "+hh:mm" or "-hh:mm" format.

The following TimeZone arguments are added to TimestampUtils class for Java Client.
- add(timestamp, amount, timeUnit, zone)
- format(timestamp, zone)
- getFormat(zone)

## v4.2

Main changes in GridDB CE v4.2 are as follows:

### C Client for Windows environment
You can use the C Client library on the Windows environment.

### Designating application names
The application name (applicationName) is added to the connection property. It is output to event logs, and so on. It is useful for specifying the application with problems.

### Controlling buffers for search
The amount of used buffers are controlled monitoring the amount of swap read of a job of queries. It reduces the performance degradation of a register process caused by the swap out of queries.



## v4.1

Main changes in GridDB CE v4.1 are as follows:

1. Online expansion
    - Node addition and detachment can be performed without stopping the cluster.

2. Geometry data
    - Geometry data type has been added. Spatial indexes can also be used.

3. Time-series compression
    - Time-series data compression for use within time-series containers has been added.

4. Expanding the upper limit of the number of columns
    - The upper limit of the number of columns that can be handled on containers. It was 1024; however, it becomes 1024-32000 from V4.1. (It depends on the setting of a block size or the column type of a container.)
5. Improving a dynamic schema change (column addition)
    - It becomes possible to access a container when a column is added to the end of it. It is not possible to access it when the schema of it is changed in versions earlier than V4.1. Moreover, the process of adding columns to the end of a container becomes faster.

---

### Online expansion

When a node is separated online due to maintenance and other work during cluster operation, it can be incorporated after the maintenance work ends. Furthermore, nodes can be added online to reinforce the system. 

The operation commands gs_appendcluster/gs_leavecluster command are used. 

### Geometry data

GEOMETRY data are widely used in map information systems, etc. 

For GEOMETRY, data is written in WKT (Well-known text). WKT is formulated by the Open Geospatial Consortium (OGC), a nonprofit organization promoting standardization of information on geospatial information. 

The following WKT format data can be stored in the GEOMETRY column. 
- POINT 
  + Point represented by two or three-dimensional coordinate. 
  + Example) POINT(0 10 10) 
- LINESTRING 
  + Set of straight lines in two or three-dimensional space represented by two or more points. 
  + Example) LINESTRING(0 10 10, 10 10 10, 10 10 0) 
- POLYGON 
  + Closed area in two or three-dimensional space represented by a set of straight lines. 
  + Example) POLYGON((0 0,10 0,10 10,0 10,0 0)), POLYGON((35 10, 45 45, 15 40, 10 20, 35 10),(20 30, 35 35, 30 20, 20 30)) 
- POLYHEDRALSURFACE 
  + Area in the three-dimensional space represented by a set of the specified area. 
  + Example) POLYHEDRALSURFACE(((0 0 0, 0 1 0, 1 1 0, 1 0 0, 0 0 0)), ((0 0 0, 0 1 0, 0 1 1, 0 0 1, 0 0 0)), ((0 0 0, 1 0 0, 1 0 1, 0 0 1, 0 0 0)), ((1 1 1, 1 0 1, 0 0 1, 0 1 1, 1 1 1)), ((1 1 1, 1 0 1, 1 0 0, 1 1 0, 1 1 1)), ((1 1 1, 1 1 0, 0 1 0, 0 1 1, 1 1 1))) 

Operations using GEOMETRY can be executed with API or TQL. 

With TQL, management of two or three-dimensional spatial structure is possible. Generating and judgement function are also provided. 

    SELECT * WHERE ST_MBRIntersects(geom, ST_GeomFromText('POLYGON((0 0,10 0,10 10,0 10,0 0))'))

### Time-series compression

In timeseries container, data can be compressed and held. Data compression can improve memory usage efficiency. Compression options can be specified when creating a timeseries container. 

The following compression types are supported: 
- HI: thinning out method with error value 
- SS: thinning out method without error value 
- NO: no compression. 

However, the following row operations cannot be performed on a timeseries container for which compression options are specified. 
- Updating a specified row. 
- Deleting a specified row. 
- Inserting a new row when there is a row at a later time than the specified time. 


## v4.0

**Enhanced flexibility and usability**

Major updates in GridDB CE V4.0 are as follows:  

1. Improvement in large-scale data management
    - GridDB can now accomodate a bigger database size, up to 50TB per node.
2. Partial execution mode for Query Result
    - It is now possible to get a large query results by dividing the data range.
3. Expansion of characters used for naming objects
    - It is now easier to integrate GridDB with other NoSQL database systems.
4. Database file size reduction functionality
    - Added Linux file block deallocation function to reduce database file size.
5. Change of license type for C Client
    - Changed from AGPL V3 to Apache V2.

---

### Improvement in large-scale data management

The maximum database size per node in conventional scale-out database is typically around several TB per node. With this update, GridDB can now accomodate a bigger database size, up to 50TB per node. This corresponds to a fewer number of nodes. 

Specifically, the following improvements have been made.
- Released unused area of data block
- Size reduction of database file meta information
- Improved responsiveness of background processing heavy functions such as container deletion
- Improvement of registration / update performance by improving buffer control

### Partial execution mode for Query Result

For a large search result, by using the "Partial Execution Mode" function,  it is now possible to divide the data range to ensure that the buffer size used for sending and receiving the query results stay within a certain range.

When you use Java client, the partial execution mode(PARTIAL_EXECUTION) can be set with setFetchOption() in Query class.
Example. query.setFetchOption(FetchOption.PARTIAL_EXECUTION, true);

In this version, the partial execution mode can be used for queries satisfying all the following conditions. And it can be used in combination with LIMIT option. Even if the conditions are not satisfied, errors may not be detected when setting the fetch option.
- The query must be specified by TQL.
- The SELECT clause must be consisted of only '*' and an ORDER BY clause must not be specified.
- The target Container must have been set to the auto commit mode at each partial execution of the query.


### Expansion of characters used for naming objects (e.g. container names).

Permitted characters to be used in cluster names, container names, etc. have been expanded.   
Special characters (hyphen '-', dot '.', slash '/', equal '=') are now supported.  

It is now easier to integrate GridDB with other NOSQL database systems, because object names of other systems can now be used in without rewriting the names.


### Database file size reduction functionality 

This function allows reduction of database file size (disk space) by using Linux file block deallocation processing on unused block areas of database files (checkpoint files). 

Use this function in the following cases. 
- A large amount of data has been deleted.
- There is no plan to update data but there is a necessity to keep the DB for a long term. 
- The disk becomes full when updating data and reducing the DB size temporarily is needed. 

Specify the deallocation option, --releaseUnusedFileBlocks, of the gs_startnode command, when starting GridDB nodes. 

The unused blocks of database files (checkpoint files) are deallocated when starting the node. This will remain deallocated until there is a data update. 

The support environment is the same as block data compression. 

### Change of license type for C Client

GridDB's client have been published under AGPL V3 or Apache V2 licenses. 

With this change, all GridDB's client will be licensed under the Apache License, Version 2.0. 

## v3.0

1. Added two new cluster configuration methods (fixed list and provider)
2. Added block data compression

### New cluster configuration methods (fixed list and provider)

GridDB provides two new cluster configuration methods for configuring addresses list.

The different cluster configuration methods can be used depending on the environment or use case. Connection method of client or operational tool is also different depending on the configuration methods. With using a fixed list method or provider method enables cluster configuration and client connection on the environment where multi-cast is not applicable.

  * Multi-cast method  
    A multi-cast method performs a node of discovery in multi-cast to automatically configure the address list.

  * Fixed list method  
    A fixed list method uses the lists by starting with giving a fixed address list to the cluster definition file. Each GridDB server reads the list only once at node start-up.

  * Provider method  
    A provider method acquires the address lists from the provider and use.
    An address provider can be configured as a web service or a static content.
    No cluster restart is needed for node addition, so provider method is suitable when it is impossible to estimate size. Note that the address provider is required ensuring availability. 

#### Configuration method

The same setting of cluster configuration method in the cluster definition file (gs_cluster.json) needs to be made in all the nodes constituting the cluster.

  * Fixed list method  
    When a fixed address list is given to start a node, the list is used to compose the cluster. 
    When composing a cluster using the fixed list method, configure the parameters in the cluster definition file.   

    /cluster/notificationMember (String) : 
    Specify the address list when using the fixed list method as the cluster configuration method.

    A configuration example of a cluster definition file is shown below. 

    ```
    {
                                 :
                                 :
      "cluster":{
        "clusterName":"yourClusterName",
        "replicationNum":2,
        "heartbeatInterval":"5s",
        "loadbalanceCheckInterval":"180s",
        "notificationMember": [
         {
            "cluster": {"address":"172.17.0.44", "port":10010},
            "sync": {"address":"172.17.0.44", "port":10020},
            "system": {"address":"172.17.0.44", "port":10040},
            "transaction": {"address":"172.17.0.44", "port":10001}
         },
         {
            "cluster": {"address":"172.17.0.45", "port":10010},
            "sync": {"address":"172.17.0.45", "port":10020},
            "system": {"address":"172.17.0.45", "port":10040},
            "transaction": {"address":"172.17.0.45", "port":10001}
         },
         {
            "cluster": {"address":"172.17.0.46", "port":10010},
            "sync": {"address":"172.17.0.46", "port":10020},
            "system": {"address":"172.17.0.46", "port":10040},
            "transaction": {"address":"172.17.0.46", "port":10001}
          }
        ]
      },
                                 :
                                 :
    }
    ```

  * Provider method  
    Get the address list supplied by the address provider to perform cluster configuration. 
    When composing a cluster using the provider method, configure the parameters in the cluster definition file.  
    /cluster/notificationProvider/url (String) : 
    Specify the URL of the address provider when using the provider method as the cluster configuration method.  
    /cluster/notificationProvider/updateInterval (String) : 
    Specify the interval to get the list from the address provider. Specify a value that is 1s or higher and less than 2^31s.

    A configuration example of a cluster definition file is shown below. 

    ```
    {
                                 :
                                 :
      "cluster":{
        "clusterName":"yourClusterName",
        "replicationNum":2,
        "heartbeatInterval":"5s",
        "loadbalanceCheckInterval":"180s",
        "notificationProvider":{
          "url":"http://example.com/notification/provider",
          "updateInterval":"30s"
        }
      },
                                 :
                                 :
    }
    ```

    The address provider can be configured as a Web service or as a static content. The specifications below need to be satisfied.
    * Compatible with the GET method. 
    * When accessing the URL, the node address list of the cluster containing the cluster definition file in which the URL is written is returned as a response.  
      * Response body: Same JSON as the contents of the node list specified in the fixed list method  
      * Response header: Including Content-Type:application/json 

    An example of a response sent from the address provider is as follows. 

    ```
    $ curl http://example.com/notification/provider
    [
      {
        "cluster": {"address":"172.17.0.44", "port":10010},
        "sync": {"address":"172.17.0.44", "port":10020},
        "system": {"address":"172.17.0.44", "port":10040},
        "transaction": {"address":"172.17.0.44", "port":10001},
      },
      {
        "cluster": {"address":"172.17.0.45", "port":10010},
        "sync": {"address":"172.17.0.45", "port":10020},
        "system": {"address":"172.17.0.45", "port":10040},
        "transaction": {"address":"172.17.0.45", "port":10001}
      },
      {
        "cluster": {"address":"172.17.0.46", "port":10010},
        "sync": {"address":"172.17.0.46", "port":10020},
        "system": {"address":"172.17.0.46", "port":10040},
        "transaction": {"address":"172.17.0.46", "port":10001}
      }
    ]
    ```

Note: 
  * Specify the serviceAddress and servicePort of the node definition file in each module (cluster,sync etc.) for each address and port. 
  * Set either the /cluster/notificationAddress, /cluster/notificationMember, /cluster/notificationProvider in the cluster definition file to match the cluster configuration method used. 

#### Connection method of client

Set GridStoreFactory parameter of each client for fixed list or provider method.

  * Fixed list method  
    notificationMember : 
    A list of addresses and port pairs in cluster. It is used to connect to cluster which is configured with fixed list mode, and specified as follows.   
    `(Address1):(Port1),(Address2):(Port2),...`  
This property cannot be specified with neither notificationAddress nor notificationProvider properties at the same time.

  * Provider method  
    notificationProvider : 
    The URL of an address provider. It is used to connect to cluster which is configured with provider mode. This property cannot be specified with neither notificationAddress nor notificationMember properties at the same time.

### Block data compression

When GridDB writes in-memory data to the database file, a large capacity database independent to the memory size can be realized. However, cost of storage will rise. To reduce this cost, block data compression function with the ability to compress database file (checkpoint file) is used. Compared to HDD, a flash memory with a high price per unit of capacity can be utilized more efficiently.

#### Compression method

When exporting in-memory data to the database file (checkpoint file), compression is performed to each block of GridDB write unit. The vacant area of Linux's file space due to compression can be deallocated, thereby reducing disk usages.

#### Configuration method

The compression function needs to be configured in every nodes.

Set the following string in the node definition file (gs_node.json)/datastore/storeCompressionMode.
  * To disable compression functionality: NO-COMPRESSION (default)
  * To enable compression functionality: COMPRESSION.

The settings will be applied after GridDB node is restarted.
By restarting GridDB node, enable/disable operation of the compression function can be changed.

Please pay attention to the following.
  * Block data compression can only be applied to checkpoint file. Transaction log files, backup file, and GridDB`s in-memory data are not subject to compression.
  * Due to block data compression, checkpoint file will become sparse file.
  * Even if the compression function is changed effectively, data already written to the checkpoint file cannot be compressed. 

#### Verified Environment

Its operation was verified in the following environment.

  * OS: CentOS 7.2
  * File system: XFS
  * File system block size: 4 KB
