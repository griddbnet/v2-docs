# User management function

There are 2 types of GridDB user, an OS user which is created during
installation and a GridDB user to perform operations/development in
GridDB (hereinafter referred to a GridDB
user).

### <span class="header-section-number">7.1.1</span> OS user

An OS user has the right to execute operating functions in GridDB and a
gsadm user is created during GridDB installation. This OS user is
hereinafter referred to gsadm.

All GridDB resources will become the property of gsadm. In addition, all
operating commands in GridDB are executed by a gsadm.

Authentication is performed to check whether the user has the right to
connect to the GridDB server and execute the operating commands. This
authentication is performed by a GridDB user.

### <span class="header-section-number">7.1.2</span> GridDB user　

  - Administrator user and general user
    
    There are 2 types of GridDB user, an administrator user and a
    general user, which differ in terms of which functions can be used.
    Immediately after the installation of GridDB, 2 users, a system and
    an admin user, are registered as default administrator users.
    
    An administrator user is a user created to perform GridDB operations
    while general users are users used by the application system.
    
    For security reasons, administrator users and general users need to
    be used differently according to the usage purpose.

  - Creating a user
    
    An administrator user can register or delete a gsadm, and the
    information is saved in the password file of the definition file
    directory as a GridDB resource. As an administrator user is
    saved/managed in a local file of the OS, it has to be placed so that
    the settings are the same in all the nodes constituting the cluster.
    In addition, administrator users need to be set up prior to starting
    the GridDB server. After the GridDB server is started,
    administrative users are not valid even if they are registered.
    
    An administrator user can create a general user after starting
    cluster operations in GridDB. A general user cannot be registered
    before the start of cluster services. A general user can only be
    registered using NewSQL interface against a cluster as it is
    created after a cluster is composed in GridDB and maintained as
    management information in the GridDB database.
    
    Since information is not communicated automatically among clusters,
    an administrator user needs to make the same settings in all the
    nodes and perform operational management such as determining the
    master management node of the definition file and distributing
    information from the master management node to all the nodes that
    constitute the cluster.

![GridDB users](img/func_user.png)

  - Rules when creating a user
    
    There are naming rules to be adopted when creating a user name.
    
      - Administrator user: Specify a user starting with "gs\#". After
        "gs\#", the name should be composed of only alphanumeric
        characters and the underscore mark. Since the name is not
        case-sensitive, gs\#manager and gs\#MANAGER cannot be registered
        at the same time.
    
      - General user: Specify using alphanumeric characters and the
        underscore mark. The container name should not start with a
        number. In addition, since the name is not case-sensitive, user
        and USER cannot be registered at the same time. System and admin
        users cannot be created as default administrator users.
    
      - Password: No restrictions on the characters that can be
        specified.
    
    A string of up to 64 characters can be specified for the user name
    and password.

### <span class="header-section-number">7.1.3</span> Usable function

The operations available for an administrator and a general user are as
follows. Among the operations, commands which can be executed by a gsadm
without using a GridDB user are marked with
"✓✓".

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

### <span class="header-section-number">7.1.4</span> Database and users

Access to a cluster database in GridDB can be separated on a user basis.
The separation unit is known as a database. The following is a cluster
database in the initial state.

  - public
      - The database can be accessed by all administrator user and
        general users.
      - This database is used when connected without specifying the
        database at the connection point.

Multiple databases can be created in a cluster database. Creation of
databases and assignment to users are carried out by an administrator
user.

The rules for creating a database are as shown below.

  - The maximum no. of users and the maximum no. of databases that can
    be created in a cluster database is 128.
  - A string consisting of alphanumeric characters, the underscore mark,
    the hyphen mark, the dot mark, the slash mark and the equal mark can
    be specified for the database. The container name should not start
    with a number.
  - A string consisting of 64 characters can be specified for the
    database name.
  - Although the case sensitivity of the database name is maintained, a
    database which has the same name when it is not case-sensitive
    cannot be created. For example, both database and DATABASE cannot be
    registered.
  - Public and "information\_schema" cannot be specified for default DB.

When assigning general users to a database, specify permissions as
follows :

  - ALL
      - All operations to a container are allowed such as creating a
        container, adding a row, searching, and creating an index.
  - READ
      - Only search operations are allowed.

Only assigned general users and administrator users can access the
database. Administrator user can access all databases. The following
rules apply when assign a general user to a database.

  - Multiple general users can be assigned to one database.
  - When assigning general users to a database, only one type of
    permission can be granted.
  - When assigning multiple general users to one database, different
    permission can be granted for each user.
  - Multiple databases can be assigned to 1 user

![Database and
users](img/func_database.png)

## <span class="header-section-number">7.2</span> Failure process function

In GridDB, recovery for a single point failure is not necessary as
replicas of the data are maintained in each node constituting the
cluster. The following action is carried out when a failure occurs in
GridDB.

1.  When a failure occurs, the failure node is automatically isolated
    from the cluster.
2.  Failover is carried out in the backup node in place of the isolated
    failure node.
3.  Partitions are rearranged autonomously as the number of nodes
    decreases as a result of the failure (replicas are also arranged).

A node that has been recovered from a failure can be incorporated online
into a cluster operation. A node can be incorporated into a cluster
which has become unstable due to a failure using the gs\_joincluster
command. As a result of the node incorporation, the partitions will be
rearranged autonomously and the node data and load balance will be
adjusted.

In this way, although advance recovery preparations are not necessary in
a single failure, recovery operations are necessary when operating in a
single configuration or when there are multiple overlapping failures in
the cluster configuration.

When operating in a cloud environment, even when physical disk failure
or processor failure is not intended, there may be multiple failures
such as a failure in multiple nodes constituting a cluster, or a
database failure in multiple
nodes.

### <span class="header-section-number">7.2.1</span> Type and treatment of failures

An overview of the failures which occur and the treatment method is
shown in the table below.

A node failure refers to a situation in which a node has stopped due to
a processor failure or an error in a GridDB server process, while a
database failure refers to a situation in which an error has occurred in
accessing a database placed in a
disk.

| Configuration of GridDB | Type of failure           | Action and treatment                                                                                                                                                                                                                                                                                                                                                                               |
| ----------------------- | ------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Single configuration    | Node failure              | Although access from the application is no longer possible, data in a transaction which has completed processing can be recovered simply by restarting the transaction, except when caused by a node failure. Recovery by another node is considered when the node failure is prolonged.                                                                                                           |
| Single configuration    | Database failure          | The database file is recovered from the backup data in order to detect an error in the application. Data at the backup point is recovered.                                                                                                                                                                                                                                                         |
| Cluster configuration   | Single node failure       | The error is covered up in the application, and the process can continue in nodes with replicas. Recovery operation is not necessary in a node where a failure has occurred.                                                                                                                                                                                                                       |
| Cluster configuration   | Multiple node failure     | If both owner/backup partitions of a replica exist in a failure target node, the cluster will operate normally even though the subject partitions cannot be accessed. Except when caused by a node failure, data in a transaction which has completed processing can be recovered simply by restarting the transaction. Recovery by another node is considered when the node failure is prolonged. |
| Cluster configuration   | Single database failure   | Since data access will continue through another node constituting the cluster when there is a database failure in a single node, the data can be recovered simply by changing the database deployment location to a different disk, and then starting the node again.                                                                                                                              |
| Cluster configuration   | Multiple database failure | A partition that cannot be recovered in a replica needs to be recovered at the point backup data is sampled from the latest backup data.                                                                                                                                                                                                                                                           |

### <span class="header-section-number">7.2.2</span> Client failover

If a node failure occurs when operating in a cluster configuration, the
partitions (containers) placed in the failure node cannot be accessed.
At this point, a client failover function to automatically connect to
the backup node again and continue the process is activated in the
client API. To automatically perform a failover countermeasure in the
client API, the application developer does not need to be aware of the
error process in the node.

However, due to a network failure or simultaneous failure of multiple
nodes, an error may also occur and access to the target application
operations may not be possible.

Depending on the data to be accessed, the following points need to be
considered in the recovery process after an error occurs.

  - For a collection in which the timeseries container or row key is
    defined, the data can be recovered by executing the failed operation
    or transaction again.

  - For a collection in which the row key is not defined, the failed
    operation or transaction needs to be executed again after checking
    the contents of the DB.

\[Note\]

  - In order to simplify the error process in an application, it is
    recommended that the row key be defined when using a collection. If
    the data cannot be uniquely identified by a single column value but
    can be uniquely identified by multiple column values, a column
    having a value that links the values of the multiple columns is
    recommended to be set as the row key so that the data can be
    uniquely
identified.

## <span class="header-section-number">7.3 Event log function

An event log is a log to record system operating information and
messages related to event information e.g. exceptions which occurred
internally in a GridDB node etc.

An event log is created with the file name gridstore-%Y%m%d-n.log in the
directory shown in the environmental variable GS\_LOG (Example:
gridstore-20150328-5.log). 22/5000 The file switches at the following
timing:

  - When the log is written first after the date changes
  - When the node is restarted
  - When the size of one file exceeds 1MB

The default value of the maximum number of event log files is 30. If it
exceeds 30 files, it will be deleted from the old file. The maximum
number can be changed with the node definition file.

Output format of event log is as follows.

  - (Date and time) (host name) (thread no.) (log level) (category)
    \[(error trace no.): (error trace no. and name)\] (message) \<
    (base64 detailed information: Detailed information for problem
    analysis in the support service)\>
    
    An overview of the event can be found using the error trace number.


<!-- end list -->

``` sh
2014-11-12T10:35:29.746+0900 TSOL1234 8456 ERROR TRANSACTION_SERVICE [10008:TXN_CLUSTER_NOT_SERVICING] (nd={clientId=2, address=127.0.0.1:52719}, pId=0, eventType=CONNECT, stmtId=1) <Z3JpZF9zdG9yZS9zZXJ2ZXIvdHJhbnNhY3Rpb25fc2VydmljZS5jcHAgQ29ubmVjdEhhbmRsZXI6OmhhbmRsZUVycm9yIGxpbmU9MTg2MSA6IGJ5IERlbnlFeGNlcHRpb24gZ3JpZF9zdG9yZS9zZXJ2ZXIvdHJhbnNhY3Rpb25fc2VydmljZS5jcHAgU3RhdGVtZW50SGFuZGxlcjo6Y2hlY2tFeGVjdXRhYmxlIGxpbmU9NjExIGNvZGU9MTAwMDg=>
```

## <span class="header-section-number">7.4</span> Checking operation state

### <span class="header-section-number">7.4.1</span> Performance and statistical information

GridDB performance and statistical information can be checked in GridDB
using the operating command gs\_stat. gs\_stat represents information
common in the cluster and performance and statistical information unique
to the nodes.

Among the outputs of the gs\_stat command, the performance structure is
an output that is related to the performance and statistical
information.

An example of output is shown below. The output contents vary depending
on the version.

``` sh
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

Information related to performance and statistical information is
explained below. The description of the storeDetail structure is omitted
as this is internal debugging information.

  - The type is shown below.
      - CC: Current value of all cluster
      - c: Current value of specified node
      - CS: Cumulative value after service starts for all clusters
      - s: Cumulative value after service starts for all nodes
      - CP: Peak value after service starts for all clusters
      - p: Peak value after service starts for all nodes
  - Check the event figure to be monitored, and show the items that
    ought to be reviewed in continuing with
operations.

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

<span id="operating_commands"></span>

## <span class="header-section-number">7.5</span> Operating commands

The following commands are available in GridDB. All the operating
command names of GridDB start with
gs\_.

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

<span id="label_parameters"></span>

# <span class="header-section-number">8</span> Parameter

Describes the parameters to control the operations in GridDB. In the
GridDB parameters, there is a node definition file to configure settings
such as the setting information and usable resources etc., and a cluster
definition file to configure operational settings of a cluster. Explains
the meanings of the item names in the definition file and the settings
and parameters in the initial state.

The unit of the setting is set as shown below.

  - The byte size can be specified in the following units: TB, GB, MB,
    KB, B, T, G, M, K, or lowercase notations of these units. Unit
    cannot be omitted unless otherwise stated.

  - Time can be specified in the following units: h, min, s, ms. Unit
    cannot be omitted unless otherwise
stated.

　

## <span class="header-section-number">8.1</span> Cluster definition file (gs\_cluster.json)

The same setting in the cluster definition file needs to be made in all
the nodes constituting the cluster. As the partitionNum and
storeBlockSize parameters are important parameters to determine the
database structure, they cannot be changed after GridDB is started for
the first time.

The meanings of the various settings in the cluster definition file are
explained below.

By adding an item name, items that are not included in the initial state
can be recognized by the system. Indicate whether the parameter can be
changed and the change timing in the change field.

  - Disallowed: Node cannot be changed once it has been started. The
    database needs to be initialized if you want to change the setting.
  - Restart: Parameter can be changed by restarting all the nodes
    constituting the cluster.
  - Online: Parameters that are currently in operation online can be
    changed. However, the contents in the definition file need to be
    manual amended as the change details will not be
perpetuated.

　

| Configuration of GridDB                      | Default   | Meaning of parameters and limitation values                                                                                                                                                                                                                                                               | Change     |
| -------------------------------------------- | --------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------- |
| /notificationAddress                         | 239.0.0.1 | Standard setting of a multi-cast address. This setting will become valid if a parameter with the same cluster, transaction name is omitted. If a different value is set, the address of the individual setting is valid.                                                                                  | Restart    |
| /dataStore/partitionNum                      | 128       | Specify a common multiple that will allow the number of partitions to be divided and placed by the number of constituting clusters. Integer: Specify an integer that is 1 or higher and 10000 or lower.                                                                                                   | Disallowed |
| /dataStore/storeBlockSize                    | 64KB      | Specify the disk I/O size from 64KB,1MB,4MB,8MB,16MB,32MB. Larger block size enables more records to be stored in one block, suitable for full scans of large tables, but also increases the possibility of conflict. Select the size suitable for the system. Cannot be changed after server is started. | Disallowed |
| /cluster/clusterName                         | \-        | Specify the name for identifying a cluster. Mandatory input parameter.                                                                                                                                                                                                                                    | Restart    |
| /cluster/replicationNum                      | 2         | Specify the number of replicas. Partition is doubled if the number of replicas is 2.                                                                                                                                                                                                                      | Restart    |
| /cluster/notificationAddress                 | 239.0.0.1 | Specify the multicast address for cluster configuration                                                                                                                                                                                                                                                   | Restart    |
| /cluster/notificationPort                    | 20000     | Specify the multicast port for cluster configuration. Specify a value within a specifiable range as a multi-cast port no.                                                                                                                                                                                 | Restart    |
| /cluster/notificationInterval                | 5s        | Multicast period for cluster configuration. Specify the value more than 1 second and less than 2<sup>31</sup> seconds.                                                                                                                                                                                    | Restart    |
| /cluster/heartbeatInterval                   | 5s        | Specify a check period (heart beat period) to check the node survival among clusters. Specify the value more than 1 second and less than 2<sup>31</sup> seconds.                                                                                                                                          | Restart    |
| /cluster/loadbalanceCheckInterval            | 180s      | To adjust the load balance among the nodes constituting the cluster, specify a data sampling period, as a criteria whether to implement the balancing process or not. Specify the value more than 1 second and less than 2<sup>31</sup> seconds.                                                          | Restart    |
| /cluster/notificationMember                  | \-        | Specify the address list when using the fixed list method as the cluster configuration method.                                                                                                                                                                                                            | Restart    |
| /cluster/notificationProvider/url            | \-        | Specify the URL of the address provider when using the provider method as the cluster configuration method.                                                                                                                                                                                               | Restart    |
| /cluster/notificationProvider/updateInterval | 5s        | Specify the interval to get the list from the address provider. Specify the value more than 1 second and less than 2<sup>31</sup> seconds.                                                                                                                                                                | Restart    |
| /sync/timeoutInterval                        | 30s       | Specify the timeout time during data synchronization among clusters. 　If a timeout occurs, the system load may be high, or a failure may have occurred. Specify the value more than 1 second and less than 2<sup>31</sup> seconds.                                                                        | Restart    |
| /transaction/notificationAddress             | 239.0.0.1 | Multi-cast address that a client connects to initially. Master node is notified in the client.                                                                                                                                                                                                            | Restart    |
| /transaction/notificationPort                | 31999     | Multi-cast port that a client connects to initially. Specify a value within a specifiable range as a multi-cast port no.                                                                                                                                                                                  | Restart    |
| /transaction/notificationInterval            | 5s        | Multi-cast period for a master to notify its clients. Specify the value more than 1 second and less than 2<sup>31</sup> seconds.                                                                                                                                                                          | Restart    |
| /transaction/replicationMode                 | 0         | Specify the data synchronization (replication) method when updating the data in a transaction. Specify a string or integer, "ASYNC"or 0 (non-synchronous), "SEMISYNC"or 1 (quasi-synchronous).                                                                                                            | Restart    |
| /transaction/replicationTimeoutInterval      | 10s       | Specify the timeout time for communications among nodes when synchronizing data in a quasi-synchronous replication transaction. Specify the value more than 1 second and less than 2<sup>31</sup> seconds.                                                                                                | Restart    |
| /transaction/authenticationTimeoutInterval   | 5s        | Specify the authentication timeout time.                                                                                                                                                                                                                                                                  | Restart    |
| /sql/notificationAddress                     | 239.0.0.1 | Multi-cast address when the JDBC client is connected initially. Master node is notified in the client.                                                                                                                                                                                               | Restart    |
| /sql/notificationPort                        | 41999     | Multi-cast port when the JDBC client is connected initially. Specify a value within a specifiable range as a multi-cast port no.                                                                                                                                                                     | Restart    |
| /sql/notificationInterval                    | 5s        | Multi-cast period for a master to notify its JDBC clients. Specify the value more than 1 second and less than 2<sup>31</sup> seconds.                                                                                                                                                                | Restart    |

　

## <span class="header-section-number">8.2</span> Node definition file (gs\_node.json)

A node definition file defines the default settings of the resources in
nodes constituting a cluster. In an online operation, there are also
parameters whose values can be changed online from the resource, access
frequency, etc., that have been laid out. Conversely, note that there
are also values (concurrency) that cannot be changed once set.

The meanings of the various settings in the node definition file are
explained below.

By adding an item name, items that are not included in the initial state
can be recognized by the system. Indicate whether the parameter can be
changed and the change timing in the change field.

  - Disallowed: Node cannot be changed once it has been started. The
    database needs to be initialized if you want to change the setting.
  - Restart: Parameter can be changed by restarting all the nodes
    constituting the cluster.
  - Online: Parameters that are currently in operation online can be
    changed. However, the contents in the definition file need to be
    manual amended as the change details will not be perpetuated.

Specify the directory by specifying the full path or a relative path
from the GS\_HOME environmental variable. For relative path, the initial
directory of GS\_HOME serves as a reference point. Initial configuration
directory of GS\_HOME is /var/lib/gridstore.

<table>
<thead>
<tr class="header">
<th>Configuration of GridDB</th>
<th>Default</th>
<th>Meaning of parameters and limitation values</th>
<th>Change</th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td>/serviceAddress</td>
<td>-</td>
<td>Set the initial value of each cluster, transaction, sync service address. The initial value of each service address can be set by setting this address only without having to set the addresses of the 3 items.</td>
<td>Restart</td>
</tr>
<tr class="even">
<td>/dataStore/dbPath</td>
<td>data</td>
<td>The deployment directory of the database file is specified by the full path or a relative path</td>
<td>Restart</td>
</tr>
<tr class="odd">
<td>/dataStore/dbFileSplitCount</td>
<td>0 (no splitting)</td>
<td>Number of checkpoint file splitting</td>
<td>Disallowed</td>
</tr>
<tr class="even">
<td>/dataStore/dbFilePathList</td>
<td>Empty list</td>
<td>The list of directories where the split checkpoint files are placed when the checkpoint file is to be split.<br />
Required if 1 or more is specified as dbFileSplitCount. More than one can be specified (example: ["/stg01", "/stg02"]). Except that, the number of directories greater than dbFileSplitCount cannot be specified.</td>
<td>Restart</td>
</tr>
<tr class="odd">
<td>/dataStore/backupPath</td>
<td>backup</td>
<td>Specify the backup file deployment directory path.</td>
<td>Restart</td>
</tr>
<tr class="even">
<td>/dataStore/syncTempPath</td>
<td>sync</td>
<td>Specify the path of the Data sync temporary file directory.</td>
<td>Restart</td>
</tr>
<tr class="odd">
<td>/dataStore/storeMemoryLimit</td>
<td>1024MB</td>
<td>Upper memory limit for data management</td>
<td>Online</td>
</tr>
<tr class="even">
<td>/dataStore/concurrency</td>
<td>4</td>
<td>Specify the concurrency of processing.</td>
<td>Disallowed</td>
</tr>
<tr class="odd">
<td>/dataStore/logWriteMode</td>
<td>1</td>
<td>Specify the log writing mode and cycle. If the log writing mode period is -1 or 0, log writing is performed at the end of the transaction. If it is 1 or more and less than 2<sup>31</sup>, log writing is performed at a period specified in seconds</td>
<td>Restart</td>
</tr>
<tr class="even">
<td>/dataStore/persistencyMode</td>
<td>1(NORMAL)</td>
<td>In the perpetuation mode, the period that the update log file is maintained during a data update is specified. Specify either 1 (NORMAL) or 2 (RETAINING_ALL_LOGS). For "NORMAL", a transaction log file which is no longer required will be deleted by the checkpoint. For "RETAINING_ALL_LOGS", all transaction log files are retained.</td>
<td>Restart</td>
</tr>
<tr class="odd">
<td>/dataStore/storeWarmStart</td>
<td>false(invalid)</td>
<td>Specify whether to save in-memory up to the upper limit of the chunk memory during a restart.</td>
<td>Restart</td>
</tr>
<tr class="even">
<td>/dataStore/affinityGroupSize</td>
<td>4</td>
<td>Number of affinity groups</td>
<td>Restart</td>
</tr>
<tr class="odd">
<td>/dataStore/storeCompressionMode</td>
<td>NO_COMPRESSION</td>
<td>Data block compression mode</td>
<td>Restart</td>
</tr>
<tr class="even">
<td>/dataStore/autoExpire</td>
<td>false</td>
<td>Specify whether to delete the rows of a container in which an expiry release is set automatically after the rows become cold data. false: Not delete automatically (Needs to be deleted by executing the long term archive) true: Delete automatically</td>
<td>Online</td>
</tr>
<tr class="odd">
<td>/checkpoint/checkpointInterval</td>
<td>60s</td>
<td>Checkpoint process execution period to perpetuate a data update block in the memory</td>
<td>Restart</td>
</tr>
<tr class="even">
<td>/checkpoint/checkpointMemoryLimit</td>
<td>1024MB</td>
<td>Upper limit of special checkpoint write memory* Pool the required memory space up to the upper limit when there is a update transaction in the checkpoint.</td>
<td>Online</td>
</tr>
<tr class="odd">
<td>/checkpoint/useParallelMode</td>
<td>false(invalid)</td>
<td>Specify whether to execute the checkpoint concurrently. *The no. of concurrent threads is the same as the concurrency.</td>
<td>Restart</td>
</tr>
<tr class="even">
<td>/checkpoint/checkpointCopyInterval</td>
<td>100ms</td>
<td>Output process interval when outputting a block with added or updated data to a disk in a checkpoint process.</td>
<td>Restart</td>
</tr>
<tr class="odd">
<td>/cluster/serviceAddress</td>
<td>Comforms to the upper serviceAddress</td>
<td>Standby address for cluster configuration</td>
<td>Restart</td>
</tr>
<tr class="even">
<td>/cluster/servicePort</td>
<td>10010</td>
<td>Standby port for cluster configuration</td>
<td>Restart</td>
</tr>
<tr class="odd">
<td>/cluster/notificationInterfaceAddress</td>
<td>""</td>
<td>Specify the address of the interface which sends multicasting packets.</td>
<td>Restart</td>
</tr>
<tr class="even">
<td>/sync/serviceAddress</td>
<td>Comforms to the upper serviceAddress</td>
<td>Reception address for data synchronization among the clusters</td>
<td>Restart</td>
</tr>
<tr class="odd">
<td>/sync/servicePort</td>
<td>10020</td>
<td>Standby port for data synchronization</td>
<td>Restart</td>
</tr>
<tr class="even">
<td>/system/serviceAddress</td>
<td>Comforms to the upper serviceAddress</td>
<td>Standby address for operation commands</td>
<td>Restart</td>
</tr>
<tr class="odd">
<td>/system/servicePort</td>
<td>10040</td>
<td>Standby port for operation commands</td>
<td>Restart</td>
</tr>
<tr class="even">
<td>/system/eventLogPath</td>
<td>log</td>
<td>Event log file deployment directory path</td>
<td>Restart</td>
</tr>
<tr class="odd">
<td>/transaction/serviceAddress</td>
<td>Comforms to the upper serviceAddress</td>
<td>Standby address for transaction processing for client communication, used also for cluster internal communication when /transaction/localserviceAddress is not specified.</td>
<td>Restart</td>
</tr>
<tr class="even">
<td>/transaction/localServiceAddress</td>
<td>Comforms to the upper serviceAddress</td>
<td>Standby address for transaction processing for cluster internal communication</td>
<td>Restart</td>
</tr>
<tr class="odd">
<td>/transaction/servicePort</td>
<td>10001</td>
<td>Standby port for transaction process</td>
<td>Restart</td>
</tr>
<tr class="even">
<td>/transaction/connectionLimit</td>
<td>5000</td>
<td>Upper limit of the no. of transaction process connections</td>
<td>Restart</td>
</tr>
<tr class="odd">
<td>/transaction/transactionTimeoutLimit</td>
<td>300s</td>
<td>Transaction timeout upper limit</td>
<td>Restart</td>
</tr>
<tr class="even">
<td>/transaction/reauthenticationInterval</td>
<td>0s (disabled)</td>
<td>Re-authentication interval. (After the specified time has passed, authentication process runs again and updates permissions of the general users who have already been connected.) The default value, 0 sec, indicates that re-authentication is disabled.</td>
<td>Online</td>
</tr>
<tr class="odd">
<td>/transaction/workMemoryLimit</td>
<td>128MB</td>
<td>Maximum memory size for data reference (get, TQL) in transaction processing (for each concurrent processing)</td>
<td>Online</td>
</tr>
<tr class="even">
<td>/transaction/notificationInterfaceAddress</td>
<td>""</td>
<td>Specify the address of the interface which sends multicasting packets.</td>
<td>Restart</td>
</tr>
<tr class="odd">
<td>/sql/serviceAddress</td>
<td>Comforms to the upper serviceAddress</td>
<td>Standby address for NewSQL I/F access processing for client communication, used also for cluster internal communication when / /sql/localServiceAddress is not specified.</td>
<td>Restart</td>
</tr>
<tr class="even">
<td>/sql/localServiceAddress</td>
<td>Comforms to the upper serviceAddress</td>
<td>Standby address for NewSQL I/F access processing for cluster internal communication</td>
<td>Restart</td>
</tr>
<tr class="odd">
<td>/sql/servicePort</td>
<td>20001</td>
<td>Standby port for New SQL access process</td>
<td>Restart</td>
</tr>
<tr class="even">
<td>/sql/storeSwapFilePath</td>
<td>swap</td>
<td>SQL intermediate store swap file directory</td>
<td>Restart</td>
</tr>
<tr class="odd">
<td>/sql/storeSwapSyncSize</td>
<td>1024MB</td>
<td>SQL intermediate store swap file and cache size</td>
<td>Restart</td>
</tr>
<tr class="even">
<td>/sql/storeMemoryLimit</td>
<td>1024MB</td>
<td>Upper memory limit for intermediate data held in memory by SQL processing.</td>
<td>Restart</td>
</tr>
<tr class="odd">
<td>/sql/workMemoryLimit</td>
<td>32MB</td>
<td>Upper memory limit for operators in SQL processing</td>
<td>Restart</td>
</tr>
<tr class="even">
<td>/sql/workCacheMemory</td>
<td>128MB</td>
<td>Upper size limit for cache without being released after use of work memory.</td>
<td>Restart</td>
</tr>
<tr class="odd">
<td>/sql/connectionLimit</td>
<td>5000</td>
<td>Upper limit of the no. of connections processed for New SQL access</td>
<td>Restart</td>
</tr>
<tr class="even">
<td>/sql/concurrency</td>
<td>4</td>
<td>No. of simultaneous execution threads</td>
<td>Restart</td>
</tr>
<tr class="odd">
<td>/sql/traceLimitExecutionTime</td>
<td>300s</td>
<td>The lower limit of execution time of a query to write in an event log</td>
<td>Online</td>
</tr>
<tr class="even">
<td>/sql/traceLimitQuerySize</td>
<td>1000</td>
<td>The upper size limit of character strings in a slow query (byte)</td>
<td>Online</td>
</tr>
<tr class="odd">
<td>/sql/notificationInterfaceAddress</td>
<td>""</td>
<td>Specify the address of the interface which sends multicasting packets.</td>
<td>Restart</td>
</tr>
<tr class="even">
<td>/trace/fileCount</td>
<td>30</td>
<td>Upper file count limit for event log files.</td>
<td>Restart</td>
</tr>
</tbody>
</table>

# <span class="header-section-number">9</span> System limiting values

## <span class="header-section-number">9.1</span> Limitations on numerical value

| Block size                                                              | 64KB        | 1MB - 32MB               |
| ----------------------------------------------------------------------- | ----------- | ------------------------ |
| STRING/GEOMETRY data size                                               | 31KB        | 128KB                    |
| BLOB data size                                                          | 1GB - 1Byte | 1GB - 1Byte              |
| Array length                                                            | 4000        | 65000                    |
| No. of columns                                                          | 1024        | Approx. 7K - 32000 (\*1) |
| No. of indexes (Per container)                                          | 1024        | 16000                    |
| No. of columns subject to linear complementary compression              | 100         | 100                      |
| No. of users                                                            | 128         | 128                      |
| No. of databases                                                        | 128         | 128                      |
| URL of trigger                                                          | 4KB         | 4KB                      |
| Number of affinity groups                                               | 10000       | 10000                    |
| No. of divisions in a timeseries container with a cancellation deadline | 160         | 160                      |
| Size of communication buffer managed by a GridDB node                   | Approx. 2GB | Approx. 2GB              |

| Block size     | 64KB        | 1MB          | 4MB           | 8MB           | 16MB        | 32MB        |
| -------------- | ----------- | ------------ | ------------- | ------------- | ----------- | ----------- |
| Partition size | Approx. 4TB | Approx. 64TB | Approx. 256TB | Approx. 512TB | Approx. 1PB | Approx. 2PB |

  - STRING, URL of trigger
      - Limiting value is equivalent to UTF-8 encode
  - Spatial-type
      - Limiting value is equivalent to the internal storage format
  - (\*1) The number of columns
      - There is a restriction on the upper limit of the number of
        columns. The total size of a fixed length column (BOOL, INTEGER,
        FLOAT, DOUBLE, TIMESTAMP type) must be less than or equal to 59
        KB. The upper limit of the number of columns is 32000 if the
        type is not a fixed length column.
          - Example) If a container consists of LONG type columns: the
            upper limit of the number of columns is 7552 ( The total
            size of a fixed length column 8B \* 7552 = 59KB )
          - Example) If a container consists of BYTE type columns: the
            upper limit of the number of columns is 32000 ( The total
            size of a fixed length column 1B \* 32000 = Approx. 30KB
            -\&gt; Up to 32000 columns can be created because the size
            restriction on a fixed length column does not apply to it )
          - Example) If a container consists of STRING type columns: the
            upper limit of the number of columns is 32000 ( Up to 32000
            columns can be created because the size restriction on a
            fixed length column does not apply to it )

## <span class="header-section-number">9.2</span> Limitations on naming

<table>
<thead>
<tr class="header">
<th>Field</th>
<th>Allowed characters</th>
<th>Maximum length</th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td>Administrator user</td>
<td>The head of name is "gs#" and the following characters are either alphanumeric or '_'</td>
<td>64 characters</td>
</tr>
<tr class="even">
<td>General user</td>
<td>Alphanumeric, '_', '-', '.', '/', and '='</td>
<td>64 characters</td>
</tr>
<tr class="odd">
<td>&lt;Password&gt;</td>
<td>Composed of an arbitrary number of characters<br />
using the unicode code point</td>
<td>64 bytes (by UTF-8 encoding)</td>
</tr>
<tr class="even">
<td>cluster name</td>
<td>Alphanumeric, '_', '-', '.', '/', and '='</td>
<td>64 characters</td>
</tr>
<tr class="odd">
<td>&lt;Database name&gt;</td>
<td>Alphanumeric, '_', '-', '.', '/', and '='</td>
<td>64 characters</td>
</tr>
<tr class="even">
<td>Container name<br />
Table name<br />
View name</td>
<td>Alphanumeric, '_', '-', '.', '/', and '='<br />
(and '@' only for specifying a node affinity)</td>
<td>16384 characters (for 64KB block)<br />
131072 characters (for 1MB - 32MB block)</td>
</tr>
<tr class="odd">
<td>Column name</td>
<td>Alphanumeric, '_', '-', '.', '/', and '='</td>
<td>256 characters</td>
</tr>
<tr class="even">
<td>Index name</td>
<td>Alphanumeric, '_', '-', '.', '/', and '='</td>
<td>16384 characters (for 64KB block)<br />
131072 characters (for 1MB - 32MB block)</td>
</tr>
<tr class="odd">
<td>Trigger name</td>
<td>Alphanumeric, '_', '-', '.', '/', and '='</td>
<td>256 characters</td>
</tr>
<tr class="even">
<td>&lt;Backup name&gt;</td>
<td>Alphanumeric and '_'</td>
<td>12 characters</td>
</tr>
<tr class="odd">
<td>Data Affinity</td>
<td>Alphanumeric, '_', '-', '.', '/', and '='</td>
<td>8 characters</td>
</tr>
</tbody>
</table>

  - Case sensitivity
    
      - Cluster names, trigger names, backup names and passwords are
        case-sensitive. So the names of the following example are
        handled as different names.
        
        ``` sh
        Example) trigger, TRIGGER
        ```

  - Other names are not case-sensitive. Uppercase and lowercase
    characters are identified as the same.

  - Uppercase and lowercase characters in names at the creation are hold
    as data.

  - The names enclosed with '"' in TQL or SQL are case-sensitive. In
    that case, uppercase and lowercase characters are not identified as
    the
    same.
    
    ``` sh
    Example) Search on the container "SensorData" and the column "Column1"
        select "Column1" from "SensorData"   Success
        select "COLUMN1" from "SENSORDATA" Fail (Because "SENSORDATA" container does not exist)
    ```

  - Specifying names by TQL and SQL
    
      - In the case that the name is not enclosed with '"', it can
        contain only alphanumeric and '\_'. To use other characters, the
        name is required to be enclosed with '"'.
        
        ``` sh
        Example) select "012column", data_15 from "container.2017-09"
        ```
