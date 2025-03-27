# Parameter

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
