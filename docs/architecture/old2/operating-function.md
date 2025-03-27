# Operation function

## User management function

There are 2 types of GridDB user, an OS user which is created during installation and a GridDB user to perform operations/development in GridDB (hereinafter referred to a GridDB user).

### OS user

An OS user has the right to execute operating functions in GridDB and a gsadm user is created during GridDB installation. This OS user is hereinafter referred to gsadm.

All GridDB resources will become the property of gsadm. In addition, all operating commands in GridDB are executed by a gsadm.

Authentication is performed to check whether the user has the right to connect to the GridDB server and execute the operating commands. This authentication is performed by a GridDB user.

### GridDB user　

  - Administrator user and general user
    
    There are 2 types of GridDB user, an administrator user and a general user, which differ in terms of which functions can be used. Immediately after the installation of GridDB, 2 users, a system and an admin user, are registered as default administrator users.
    
    An administrator user is a user created to perform GridDB operations while general users are users used by the application system.
    
    For security reasons, administrator users and general users need to be used differently according to the usage purpose.

  - Creating a user
    
    An administrator user can register or delete a gsadm, and the information is saved in the password file of the definition file directory as a GridDB resource. As an administrator user is saved/managed in a local file of the OS, it has to be placed so that the settings are the same in all the nodes constituting the cluster. In addition, administrator users need to be set up prior to starting the GridDB server. After the GridDB server is started, administrative users are not valid even if they are registered.
    
    An administrator user can create a general user after starting cluster operations in GridDB. A general user cannot be registered before the start of cluster services. A general user can only be registered using NewSQL interface against a cluster as it is created after a cluster is composed in GridDB and maintained as management information in the GridDB database.
    
    Since information is not communicated automatically among clusters, an administrator user needs to make the same settings in all the nodes and perform operational management such as determining the master management node of the definition file and distributing information from the master management node to all the nodes that constitute the cluster.


![GridDB users](/img/func_user.png)



  - Rules when creating a user
    
    There are naming rules to be adopted when creating a user name.   
      - Administrator user: Specify a user starting with "gs\#". After "gs\#", the name should be composed of only alphanumeric characters and the underscore mark. Since the name is not case-sensitive, gs\#manager and gs\#MANAGER cannot be registered at the same time.
    
      - General user: Specify using alphanumeric characters and the underscore mark. The container name should not start with a number. In addition, since the name is not case-sensitive, user and USER cannot be registered at the same time. System and admin users cannot be created as default administrator users.
    
      - Password: No restrictions on the characters that can be specified.
    
    A string of up to 64 characters can be specified for the user name and password.

### Usable function

The operations available for an administrator and a general user are as follows. Among the operations, commands which can be executed by a gsadm without using a GridDB user are marked with "✓✓".

| When the operating target is a single node | Operating details                              | Operating command and I/F used     | gsadm | Administrator user | General user                                                |
| ------------------------------------------ | ---------------------------------------------- | ------------------------ | ----- | ------------------ | ----------------------------------------------------------- |
| Node operations                            | start node                                     | gs\_startnode     |       | ✓                  | ✗                                                           |
|                                            | stop node                                      | gs\_stopnode      |       | ✓                  | ✗                                                           |
| Cluster operations                         | Building a cluster                             | gs\_joincluster   |       | ✓                  | ✗                                                           |
|                                            | Detaching a node from a cluster                | gs\_leavecluster  |       | ✓                  | ✗                                                           |
|                                            | Stopping a cluster                             | gs\_stopcluster   |       | ✓                  | ✗                                                           |
| User management                            | Registering an administrator user              | gs\_adduser              | ✓✓    | ✗                  | ✗                                                           |
|                                            | Deletion of administrator user                 | gs\_deluser              | ✓✓    | ✗                  | ✗                                                           |
|                                            | Changing the password of an administrator user | gs\_passwd               | ✓✓    | ✗                  | ✗                                                           |
|                                            | Creating a general user                        | NewSQL I/F                   |       | ✓                  | ✗                                                           |
|                                            | Deleting a general user                        | NewSQL I/F                   |       | ✓                  | ✗                                                           |
|                                            | Changing the password of a general user        | NewSQL I/F                   |       | ✓                  | ✓: Individual only                                          |
| Database management                        | Creating/deleting a database                   | NewSQL I/F                   |       | ✓                  | ✗                                                           |
|                                            | Assigning/cancelling a user in the database    | NewSQL I/F                   |       | ✓                  | ✗                                                           |
| Data operation                             | Creating/deleting a container or table         | NoSQL/NewSQL I/F                   |       | ✓                  | O : Only when update operation is possible in the user's DB |
|                                            | Registering data in a container or table       | NoSQL/NewSQL I/F                   |       | ✓                  | O : Only when update operation is possible in the user's DB |
|                                            | Searching for a container or table             | NoSQL/NewSQL I/F                   |       | ✓                  | ✓: Only in the DB of the individual                         |
|                                            | Creating index to a container or table         | NoSQL/NewSQL I/F                   |       | ✓                  | O : Only when update operation is possible in the user's DB |


### Database and users

Access to a cluster database in GridDB can be separated on a user basis. The separation unit is known as a database. The following is a cluster database in the initial state.

  - public
      - The database can be accessed by all administrator user and general users.
      - This database is used when connected without specifying the database at the connection point.

Multiple databases can be created in a cluster database. Creation of databases and assignment to users are carried out by an administrator user.

The rules for creating a database are as shown below.

  - The maximum no. of users and the maximum no. of databases that can be created in a cluster database is 128.
  - A string consisting of alphanumeric characters, the underscore mark, the hyphen mark, the dot mark, the slash mark and the equal mark can be specified for the database. The container name should not start with a number.
  - A string consisting of 64 characters can be specified for the database name.
  - Although the case sensitivity of the database name is maintained, a database which has the same name when it is not case-sensitive cannot be created. For example, both database and DATABASE cannot be registered.
  - Public and "information\_schema" cannot be specified for default DB.

When assigning general users to a database, specify permissions as follows :
  - ALL
      - All operations to a container are allowed such as creating a container, adding a row, searching, and creating an index.
  - READ
      - Only search operations are allowed.

Only assigned general users and administrator users can access the database. Administrator user can access all databases. The following rules apply when assign a general user to a database.
  - Multiple general users can be assigned to one database.
  - When assigning general users to a database, only one type of permission can be granted.
  - When assigning multiple general users to one database, different permission can be granted for each user.
  - Multiple databases can be assigned to 1 user


![Database and users](/img/func_database.png)

## Failure process function

In GridDB, recovery for a single point failure is not necessary as replicas of the data are maintained in each node constituting the cluster. The following action is carried out when a failure occurs in GridDB.


1.  When a failure occurs, the failure node is automatically isolated from the cluster.
2.  Failover is carried out in the backup node in place of the isolated failure node.
3.  Partitions are rearranged autonomously as the number of nodes decreases as a result of the failure (replicas are also arranged).

A node that has been recovered from a failure can be incorporated online into a cluster operation. A node can be incorporated into a cluster which has become unstable due to a failure using the gs\_joincluster command. As a result of the node incorporation, the partitions will be rearranged autonomously and the node data and load balance will be adjusted.

In this way, although advance recovery preparations are not necessary in a single failure, recovery operations are necessary when operating in a single configuration or when there are multiple overlapping failures in the cluster configuration.

When operating in a cloud environment, even when physical disk failure or processor failure is not intended, there may be multiple failures such as a failure in multiple nodes constituting a cluster, or a database failure in multiple nodes.

### Type and treatment of failures

An overview of the failures which occur and the treatment method is shown in the table below.

A node failure refers to a situation in which a node has stopped due to a processor failure or an error in a GridDB server process, while a database failure refers to a situation in which an error has occurred in accessing a database placed in a disk.

| Configuration of GridDB | Type of failure           | Action and treatment                                                                                                                                                                                                                                                                                                                                                                               |
| ----------------------- | ------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Single configuration    | Node failure              | Although access from the application is no longer possible, data in a transaction which has completed processing can be recovered simply by restarting the transaction, except when caused by a node failure. Recovery by another node is considered when the node failure is prolonged.                                                                                                           |
| Single configuration    | Database failure          | The database file is recovered from the backup data in order to detect an error in the application. Data at the backup point is recovered.                                                                                                                                                                                                                                                         |
| Cluster configuration   | Single node failure       | The error is covered up in the application, and the process can continue in nodes with replicas. Recovery operation is not necessary in a node where a failure has occurred.                                                                                                                                                                                                                       |
| Cluster configuration   | Multiple node failure     | If both owner/backup partitions of a replica exist in a failure target node, the cluster will operate normally even though the subject partitions cannot be accessed. Except when caused by a node failure, data in a transaction which has completed processing can be recovered simply by restarting the transaction. Recovery by another node is considered when the node failure is prolonged. |
| Cluster configuration   | Single database failure   | Since data access will continue through another node constituting the cluster when there is a database failure in a single node, the data can be recovered simply by changing the database deployment location to a different disk, and then starting the node again.                                                                                                                              |
| Cluster configuration   | Multiple database failure | A partition that cannot be recovered in a replica needs to be recovered at the point backup data is sampled from the latest backup data.                                                                                                                                                                                                                                                           |


### Client failover

If a node failure occurs when operating in a cluster configuration, the partitions (containers) placed in the failure node cannot be accessed. At this point, a client failover function to automatically connect to the backup node again and continue the process is activated in the client API. To automatically perform a failover countermeasure in the client API, the application developer does not need to be aware of the error process in the node.

However, due to a network failure or simultaneous failure of multiple nodes, an error may also occur and access to the target application operations may not be possible.

Depending on the data to be accessed, the following points need to be considered in the recovery process after an error occurs.

  - For a collection in which the timeseries container or row key is defined, the data can be recovered by executing the failed operation or transaction again.

  - For a collection in which the row key is not defined, the failed operation or transaction needs to be executed again after checking the contents of the DB.

\[Note\]
  - In order to simplify the error process in an application, it is recommended that the row key be defined when using a collection. If the data cannot be uniquely identified by a single column value but can be uniquely identified by multiple column values, a column having a value that links the values of the multiple columns is recommended to be set as the row key so that the data can be uniquely identified.

<a id="label_event_log"></a>
## Event log function

An event log is a log to record system operating information and messages related to event information e.g. exceptions which occurred internally in a GridDB node etc.

An event log is created with the file name gridstore-%Y%m%d-n.log in the directory shown in the environmental variable GS\_LOG (Example: gridstore-20150328-5.log). 22/5000 The file switches at the following timing:

  - When the log is written first after the date changes
  - When the node is restarted
  - When the size of one file exceeds 1MB

The default value of the maximum number of event log files is 30. If it exceeds 30 files, it will be deleted from the old file. The maximum number can be changed with the node definition file.

Output format of event log is as follows.

  - (Date and time) (host name) (thread no.) (log level) (category) \[(error trace no.): (error trace no. and name)\] (message) \< (base64 detailed information: Detailed information for problem  analysis in the support service)\>
    
    An overview of the event can be found using the error trace number.

``` 

2014-11-12T10:35:29.746+0900 TSOL1234 8456 ERROR TRANSACTION_SERVICE [10008:TXN_CLUSTER_NOT_SERVICING] (nd={clientId=2, address=127.0.0.1:52719}, pId=0, eventType=CONNECT, stmtId=1) <Z3JpZF9zdG9yZS9zZXJ2ZXIvdHJhbnNhY3Rpb25fc2VydmljZS5jcHAgQ29ubmVjdEhhbmRsZXI6OmhhbmRsZUVycm9yIGxpbmU9MTg2MSA6IGJ5IERlbnlFeGNlcHRpb24gZ3JpZF9zdG9yZS9zZXJ2ZXIvdHJhbnNhY3Rpb25fc2VydmljZS5jcHAgU3RhdGVtZW50SGFuZGxlcjo6Y2hlY2tFeGVjdXRhYmxlIGxpbmU9NjExIGNvZGU9MTAwMDg=>

```

## Checking operation state

### Performance and statistical information

GridDB performance and statistical information can be checked in GridDB using the operating command gs\_stat. gs\_stat represents information common in the cluster and performance and statistical information unique to the nodes.

Among the outputs of the gs\_stat command, the performance structure is an output that is related to the performance and statistical information.

An example of output is shown below. The output contents vary depending on the version.

```
-bash-4.1$ gs_stat -u admin/admin -s 192.168.0.1:10040
{
    ：
    "performance": {
        "batchFree": 0,
        "checkpointFileSize": 65536,
        "checkpointFileUsageRate": 0,
        "checkpointMemory": 2031616,
        "checkpointMemoryLimit": 1073741824,
        "checkpointWriteSize": 0,
        "checkpointWriteTime": 0,
        "currentTime": 1428024628904,
        "numConnection": 0,
        "numTxn": 0,
        "peakProcessMemory": 42270720,
        "processMemory": 42270720,
        "recoveryReadSize": 65536,
        "recoveryReadTime": 0,
        "sqlStoreSwapRead": 0,
        "sqlStoreSwapReadSize": 0,
        "sqlStoreSwapReadTime": 0,
        "sqlStoreSwapWrite": 0,
        "sqlStoreSwapWriteSize": 0,
        "sqlStoreSwapWriteTime": 0,
        "storeDetail": {
            "batchFreeMapData": {
                "storeMemory": 0,
                "storeUse": 0,
                "swapRead": 0,
                "swapWrite": 0
            },
            "batchFreeRowData": {
                "storeMemory": 0,
                "storeUse": 0,
                "swapRead": 0,
                "swapWrite": 0
            },
            "mapData": {
                "storeMemory": 0,
                "storeUse": 0,
                "swapRead": 0,
                "swapWrite": 0
            },
            "metaData": {
                "storeMemory": 0,
                "storeUse": 0,
                "swapRead": 0,
                "swapWrite": 0
            },
            "rowData": {
                "storeMemory": 0,
                "storeUse": 0,
                "swapRead": 0,
                "swapWrite": 0
            }
        },
        "storeMemory": 0,
        "storeMemoryLimit": 1073741824,
        "storeTotalUse": 0,
        "swapRead": 0,
        "swapReadSize": 0,
        "swapReadTime": 0,
        "swapWrite": 0,
        "swapWriteSize": 0,
        "swapWriteTime": 0,
        "syncReadSize": 0,
        "syncReadTime": 0,
        "totalLockConflictCount": 0,
        "totalReadOperation": 0,
        "totalRowRead": 0,
        "totalRowWrite": 0,
        "totalWriteOperation": 0
    },
    ：
}
```

Information related to performance and statistical information is explained below. The description of the storeDetail structure is omitted as this is internal debugging information.
  - The type is shown below.
      - CC: Current value of all cluster
      - c: Current value of specified node
      - CS: Cumulative value after service starts for all clusters
      - s: Cumulative value after service starts for all nodes
      - CP: Peak value after service starts for all clusters
      - p: Peak value after service starts for all nodes
  - Check the event figure to be monitored, and show the items that ought to be reviewed in continuing with operations.

| Output parameters          | Type | Description                                                                                                                                                                                                                                   | Event to be monitored                                                                                                                                                                                               |
| -------------------------- | ---- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| checkpointFileSize         | c    | Checkpoint file size (byte)                                                                                                                                                                                                                   |                                                                                                                                                                                                                     |
| checkpointFileUsageRate    | c    | Checkpoint file usage rate                                                                                                                                                                                                                    |                                                                                                                                                                                                                     |
| checkpointMemory           | c    | Checkpoint memory size for checkpoint use (byte)                                                                                                                                                                                              |                                                                                                                                                                                                                     |
| checkpointMemoryLimit      | c    | CheckpointMemoryLimit setting for checkpoint use (byte)                                                                                                                                                                                       |                                                                                                                                                                                                                     |
| checkpointWriteSize        | s    | CP file write size for checkpoint processing (byte)                                                                                                                                                                                           |                                                                                                                                                                                                                     |
| checkpointWriteTime        | s    | CP file write time for checkpoint processing (ms)                                                                                                                                                                                             |                                                                                                                                                                                                                     |
| checkpointFileAllocateSize | c    | The total size of allocated blocks in the checkpoint files (bytes)                                                                                                                                                                            |                                                                                                                                                                                                                     |
| currentTime                | c    | Current time                                                                                                                                                                                                                                  |                                                                                                                                                                                                                     |
| numConnection              | c    | Current no. of connections. Number of connections used in the transaction process, not including the number of connections used in the cluster process. Value is equal to the no. of clients + no. of replicas \* no. of partitions retained. | If the no. of connections is insufficient in monitoring the log, review the connectionLimit value of the node configuration.                                                                                        |
| numSession                 | c    | Current no. of sessions                                                                                                                                                                                                                       |                                                                                                                                                                                                                     |
| numTxn                     | c    | Current no. of transactions                                                                                                                                                                                                                   |                                                                                                                                                                                                                     |
| peakProcessMemory          | p    | Peak value of the memory used in the GridDB server, including the storememory value which is the maximum memory size (byte) used in the process                                                                                               | If the peakProcessMemory or processMemory is larger than the installed memory of the node and an OS Swap occurs, additional memory or a temporary drop in the value of the storeMemoryLimit needs to be considered. |
| processMemory              | c    | Memory space used by a process (byte)                                                                                                                                                                                                         |                                                                                                                                                                                                                     |
| recoveryReadSize           | s    | Checkpoint file size read by the recovery process (byte)                                                                                                                                                                                      |                                                                                                                                                                                                                     |
| recoveryReadTime           | s    | Checkpoint file read time by the recovery processing (ms)                                                                                                                                                                                     |                                                                                                                                                                                                                     |
| sqlStoreSwapRead           | s    | Read count from the file by SQL store swap processing                                                                                                                                                                                         |                                                                                                                                                                                                                     |
| sqlStoreSwapReadSize       | s    | Read size from the file by SQL store swap processing (byte)                                                                                                                                                                                   |                                                                                                                                                                                                                     |
| sqlStoreSwapReadTime       | s    | Read time from the file by SQL store swap processing (ms)                                                                                                                                                                                     |                                                                                                                                                                                                                     |
| sqlStoreSwapWrite          | s    | Write count to the file by SQL store swap processing                                                                                                                                                                                          |                                                                                                                                                                                                                     |
| sqlStoreSwapWriteSize      | s    | Write size to the file by SQL store swap processing (byte)                                                                                                                                                                                    |                                                                                                                                                                                                                     |
| sqlStoreSwapWriteTime      | s    | Write time to the file by SQL store swap processing (ms)                                                                                                                                                                                      |                                                                                                                                                                                                                     |
| storeMemory                | c    | Memory space used in an in-memory database (byte)                                                                                                                                                                                             |                                                                                                                                                                                                                     |
| storeMemoryLimit           | c    | Memory space limit used in an in-memory database (byte)                                                                                                                                                                                       |                                                                                                                                                                                                                     |
| storeTotalUse              | c    | Full data capacity (byte) retained by the nodes, including the data capacity in the database file                                                                                                                                             |                                                                                                                                                                                                                     |
| swapRead                   | s    | Read count from the file by swap processing                                                                                                                                                                                                   |                                                                                                                                                                                                                     |
| swapReadSize               | s    | Read size from the file by swap processing (byte)                                                                                                                                                                                             |                                                                                                                                                                                                                     |
| swapReadTime               | s    | Read time from the file by swap processing (ms)                                                                                                                                                                                               |                                                                                                                                                                                                                     |
| swapWrite                  | s    | Write count to the file by swap processing                                                                                                                                                                                                    |                                                                                                                                                                                                                     |
| swapWriteSize              | s    | Write size to the file by swap processing (byte)                                                                                                                                                                                              |                                                                                                                                                                                                                     |
| swapWriteTime              | s    | Write time to the file by swap processing (ms)                                                                                                                                                                                                |                                                                                                                                                                                                                     |
| syncReadSize               | s    | Read size from the CP file by synchronous processing (byte)                                                                                                                                                                                   |                                                                                                                                                                                                                     |
| syncReadTime               | s    | Read time from the CP file by synchronous processing (ms)                                                                                                                                                                                     |                                                                                                                                                                                                                     |
| totalLockConflictCount     | s    | Row lock competing count                                                                                                                                                                                                                      |                                                                                                                                                                                                                     |
| totalReadOperation         | s    | Search process count                                                                                                                                                                                                                          |                                                                                                                                                                                                                     |
| totalRowRead               | s    | Row reading count                                                                                                                                                                                                                             |                                                                                                                                                                                                                     |
| totalRowWrite              | s    | Row writing count                                                                                                                                                                                                                             |                                                                                                                                                                                                                     |
| totalWriteOperation        | s    | Insert and update process count                                                                                                                                                                                                               |                                                                                                                                                                                                                     |

<a id="operating_commands"></a>
## Operating commands

The following commands are available in GridDB. All the operating command names of GridDB start with gs_.

| Type               | Command             | Functions                                                                                                                                                                                                            |
| ------------------ | ------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Node operations    | gs\_startnode       | start node                                                                                                                                                                                                           |
|                    | gs\_stopnode        | stop node                                                                                                                                                                                                            |
| Cluster operations | gs\_joincluster     | Join a node to a cluster. Join to cluster configuration                                                                                                                                                              |
|                    | gs\_leavecluster    | Cause a particular node to leave a cluster. Used, when causing a particular node to leave from a cluster for maintenance. The partition distributed to the node to leave the cluster will be rearranged (rebalance). |
|                    | gs\_stopcluster     | Cause all the nodes, which constite a cluster, to leave the cluster. Used for stopping all the nodes. The partitions are not rebalanced when the nodes leave the cluster.                                            |                                                                                                                                                                                      |
|                    | gs\_stat            | Get cluster data                                                                                                                                                                                                     |                                                                                                                                                                                  |
| User management    | gs\_adduser         | Registration of administrator user                                                                                                                                                                                   |
|                    | gs\_deluser         | Deletion of administrator user                                                                                                                                                                                       |
|                    | gs\_passwd          | Change a password of an administrator user                                                                                                                                                                           |
