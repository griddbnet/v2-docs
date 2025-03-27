# Parameter

Describes the parameters to control the operations in GridDB. In the GridDB parameters, there is a node definition file to configure settings such as the setting information and usable resources etc., and a cluster definition file to configure operational settings of a cluster.  Explains the meanings of the item names in the definition file and the settings and parameters in the initial state.

The unit of the setting is set as shown below.

-   The byte size can be specified in the following units: TB, GB, MB, KB, B, T, G, M, K, or lowercase notations of these units. Unit cannot be omitted unless otherwise stated.

-   Time can be specified in the following units: h, min, s, ms. Unit cannot be omitted unless otherwise stated.



## Cluster definition file (gs_cluster.json)


The same setting in the cluster definition file needs to be made in all the nodes constituting the cluster. As the partitionNum and storeBlockSize parameters are important parameters to determine the database structure, they cannot be changed after GridDB is started for the first time.

The meanings of the various settings in the cluster definition file are explained below.

The system can be caused to recognize an item not included in the initial state by adding its name as a property. In the change field, indicate whether the value of that parameter can be changed and the change timing.
-   Disallowed: Node cannot be changed once it has been started. The database needs to be initialized if you want to change the setting.
-   Restart: Parameter can be changed by restarting all the nodes constituting the cluster.
-   Online: Parameters that are currently in operation online can be changed. However, the contents in the definition file need to be manual amended as the change details will not be perpetuated.



| Configuration of GridDB | Default   | Meaning of parameters and limitation values | Change     |
|----------------------------------------------|-----------|--------------------------------------------------|----------|
| /notificationAddress                         | 239.0.0.1 | Standard setting of a multi-cast address. This setting will become valid if a parameter with the same cluster, transaction name is omitted. If a different value is set, the address of the individual setting is valid.  | Restart     |
| /dataStore/partitionNum                      | 128       | Specify a common multiple that will allow the number of partitions to be divided and placed by the number of constituting clusters.  Integer: Specify an integer that is 1 or higher and 10000 or lower.   | Disallowed |
| /dataStore/storeBlockSize                    | 64KB      | Specify the disk I/O size from 64KB,1MB,4MB,8MB,16MB,32MB. Larger block size enables more records to be stored in one block, suitable for full scans of large tables, but also increases the possibility of conflict. Select the size suitable for the system. Cannot be changed after server is started.                                            | Disallowed |
| /cluster/clusterName                         | \-        | Specify the name for identifying a cluster. Mandatory input parameter.              | Restart     |
| /cluster/replicationNum                      | 2         | Specify the number of replicas. Partition is doubled if the number of replicas is 2.             | Restart     |
| /cluster/notificationAddress                 | 239.0.0.1 | Specify the multicast address for cluster configuration                      | Restart     |
| /cluster/notificationPort                    | 20000     | Specify the multicast port for cluster configuration.  Specify a value within a specifiable range as a multi-cast port no.  | Restart     |
| /cluster/notificationInterval                | 5s        | Multicast period for cluster configuration.  Specify the value more than 1 second and less than 2<sup>31</sup> seconds.     | Restart     |
| /cluster/heartbeatInterval                   | 5s        | Specify a check period (heart beat period) to check the node survival among clusters.  Specify the value more than 1 second and less than 2<sup>31</sup> seconds.  | Restart     |
| /cluster/loadbalanceCheckInterval            | 180s      | To adjust the load balance among the nodes constituting the cluster, specify a data sampling period, as a criteria whether to implement the balancing process or not.  Specify the value more than 1 second and less than 2<sup>31</sup> seconds.                                         | Restart     |
| /cluster/notificationMember                  | \-        | Specify the address list when using the fixed list method as the cluster configuration method.            | Restart     |
| /cluster/notificationProvider/url            | \-        | Specify the URL of the address provider when using the provider method as the cluster configuration method.   | Restart     |
| /cluster/notificationProvider/updateInterval | 5s        | Specify the interval to get the list from the address provider. Specify the value more than 1 second and less than 2<sup>31</sup> seconds.   | Restart     |
| /sync/timeoutInterval                        | 30s       | Specify the timeout time during data synchronization among clusters.   If a timeout occurs, the system load may be high, or a failure may have occurred.  Specify the value more than 1 second and less than 2<sup>31</sup> seconds.      | Restart     |
| /transaction/notificationAddress             | 239.0.0.1 | Multi-cast address that a client connects to initially. Master node is notified in the client.      | Restart     |
| /transaction/notificationPort                | 31999     | Multi-cast port that a client connects to initially. Specify a value within a specifiable range as a multi-cast port no.    | Restart     |
| /transaction/notificationInterval            | 5s        | Multi-cast period for a master to notify its clients. Specify the value more than 1 second and less than 2<sup>31</sup> seconds.           | Restart     |
| /transaction/replicationMode                 | 0         | Specify the data synchronization (replication) method when updating the data in a transaction. Specify a string or integer, "ASYNC"or 0 (non-synchronous), "SEMISYNC"or 1 (quasi-synchronous).             | Restart     |
| /transaction/replicationTimeoutInterval      | 10s       | Specify the timeout time for communications among nodes when synchronizing data in a quasi-synchronous replication transaction. Specify the value more than 1 second and less than 2<sup>31</sup> seconds.                              | Restart     |
| /transaction/authenticationTimeoutInterval   | 5s        | Specify the authentication timeout time.                             | Restart       |
| /sql/notificationAddress                     | 239.0.0.1 | Multi-cast address when the JDBC/ODBC client is connected initially. Master node is notified in the client.  | Restart     |
| /sql/notificationPort                        | 41999     | Multi-cast port when the JDBC/ODBC client is connected initially. Specify a value within a specifiable range as a multi-cast port no. | Restart     |
| /sql/notificationInterval                    | 5s        | Multi-cast period for a master to notify its JDBC/ODBC clients. Specify the value more than 1 second and less than 2<sup>31</sup> seconds.      | Restart     |
| /security/authentication | INTERNAL  | Specify either INTERNAL (internal authentication) or LDAP (LDAP authentication) as an authentication method to be used. | Restart     |
| /security/ldapRoleManagement | USER  | Specify either USER (mapping using the LDAP user name) or GROUP (mapping using the LDAP group name) as to which one the GridDB role is mapped to. | Restart     |
| /security/ldapUrl   |  | Specify the LDAP server with the format: ldaps://host[:port] | Restart     |
| /security/ldapUserDNPrefix |   | To generate the user's DN (identifier), specify the string to be concatenated in front of the user name. | Restart     |
| /security/ldapUserDNSuffix |  | To generate the user's DN (identifier), specify the string to be concatenated after the user name. | Restart     |
| /security/ldapBindDn |   | Specify the LDAP administrative user's DN. | Restart     |
| /security/ldapBindPassword |  | Specify the password for the LDAP administrative user. | Restart     |
| /security/ldapBaseDn |  | Specify the root DN from which to start searching. | Restart     |
| /security/ldapSearchAttribute | uid  | Specify the attributes to search for. | Restart     |
| /security/ldapMemberOfAttribute | memberof | Specify the attributes where the group DN to which the user belongs is set (valid if ldapRoleManagement=GROUP).     |
| /system/serverSslMode | DISABLED  | For SSL connection settings, specify DISABLED (SSL invalid), PREFERRED (SSL valid, but non-SSL connection is allowed as well), or REQUIRED (SSL valid; non-SSL connection is not allowed ). | Restart     |
| /system/sslProtocolMaxVersion | TLSv1.2 | As a TLS protocol version, specify either TLSv1.2 or TLSv1.3. | Restart     |  


## Node definition file (gs_node.json)

A node definition file defines the default settings of the resources in nodes constituting a cluster. In an online operation, there are also parameters whose values can be changed online from the resource, access frequency, etc., that have been laid out.

The meanings of the various settings in the node definition file are explained below.

The system can be caused to recognize an item not included in the initial state by adding its name as a property. In the change field, indicate whether the value of that parameter can be changed and the change timing.
-   Disallowed: Node cannot be changed once it has been started. The database needs to be initialized if you want to change the setting.
-   Restart: The value of the parameter can be changed by restarting the target nodes.
-   Online: Parameters that are currently in operation online can be changed. However, the contents in the definition file need to be manual amended as the change details will not be perpetuated.

Specify the directory by specifying the full path or a relative path from the GS_HOME environmental variable. For relative path, the initial directory of GS_HOME serves as a reference point. Initial configuration directory of GS_HOME is /var/lib/gridstore.

| Configuration of GridDB | Default   | Meaning of parameters and limitation values | Change       |
|--------------------------------------|----------------------------|---------------------------------|-----|
| /serviceAddress | \- | Set the initial value of each cluster, transaction, sync service address. The initial value of each service address can be set by setting this address only without having to set the addresses of the 3 items.   | Restart       |
| /dataStore/dbPath | data | The placement directory of data files and checkpoint log files is specified with the full or relative path. | Restart       |
| /dataStore/transactionLogPath  | txnlog | The placement directory of transaction files is specified with the full or relative path.    | Restart       |
| /dataStore/dbFileSplitCount | 0 (no split) | Number of data file splits    | Disallowed       |
| /dataStore/backupPath | backup | Specify the backup file deployment directory path.                                   | Restart       |
| /dataStore/syncTempPath | sync | Specify the path of the Data sync temporary file directory.                                   | Restart       |
| /dataStore/storeMemoryLimit | 1024MB | Upper memory limit for data management                                                        | Online |
| /dataStore/concurrency | 4 | Specify the concurrency of processing.                                                                         | Restart       |
| /dataStore/logWriteMode | 1 | Specify the log writing mode and cycle.  If the log writing mode period is -1 or 0, log writing is performed at the end of the transaction. If it is 1 or more and less than 2<sup>31</sup>, log writing is performed at a period specified in seconds | Restart       |
| /dataStore/persistencyMode | 1(NORMAL) | In the persistence mode, specify the retention period of an update log file during a data update. Specify either 1 (NORMAL) or 2 (RETAINING_ALL_LOG). In "NORMAL", a transaction log file which is no longer required is deleted by a checkpoint. In"RETAINING_ALL_LOG", all transaction log files are retained.  | Restart       |
| /dataStore/affinityGroupSize | 4 | Number of affinity groups | Restart       |
| /dataStore/storeCompressionMode | NO_COMPRESSION | Data block compression mode | Restart       |
| /checkpoint/checkpointInterval | 60s | Checkpoint process execution period to perpetuate a data update block in the memory | Restart       |
| /checkpoint/partialCheckpointInterval | 10 | The number of split processes that write block management information to checkpoint log files during a checkpoint. | Restart       |
| /cluster/serviceAddress | Comforms to the upper serviceAddress | Standby address for cluster configuration | Restart       |
| /cluster/servicePort | 10010 | Standby port for cluster configuration | Restart       |
| /cluster/notificationInterfaceAddress | "" | Specify the address of the interface which sends multicasting packets. | Restart       |
| /sync/serviceAddress | Comforms to the upper serviceAddress | Reception address for data synchronization among the clusters | Restart       |
| /sync/servicePort | 10020 | Standby port for data synchronization | Restart       |
| /system/serviceAddress | Comforms to the upper serviceAddress | Standby address for operation commands | Restart       |
| /system/servicePort | 10040 | Standby port for operation commands | Restart       |
| /system/eventLogPath | log | Event log file deployment directory path | Restart       |
| /system/securityPath | security  | Specify the full path or relative path to the directory where the server certificate and the private key are placed.  | Restart     |
| /system/serviceSslPort | 10045 | SSL listen port for operation commands | Restart     |
| /transaction/serviceAddress | Comforms to the upper serviceAddress | Standby address for transaction processing for client communication, used also for cluster internal communication when /transaction/localserviceAddress is not specified. | Restart       |
| /transaction/localServiceAddress | Comforms to the upper serviceAddress | Standby address for transaction processing for cluster internal communication | Restart       |
| /transaction/servicePort | 10001 | Standby port for transaction process | Restart       |
| /transaction/connectionLimit | 5000 | Upper limit of the no. of transaction process connections | Restart       |
| /transaction/totalMemoryLimit        | 1024 MB | The maximum size of the memory area for transaction processing. | Restart |
| /transaction/transactionTimeoutLimit | 300s | Transaction timeout upper limit | Restart       |
| /transaction/reauthenticationInterval | 0s (disabled) | Re-authentication interval. (After the specified time has passed, authentication process runs again and updates permissions of the general users who have already been connected.)  The default value, 0 sec, indicates that re-authentication is disabled. | Online       |
| /transaction/workMemoryLimit | 128MB | Maximum memory size for data reference (get, TQL) in transaction processing (for each concurrent processing) | Online       |
| /transaction/notificationInterfaceAddress | "" | Specify the address of the interface which sends multicasting packets. | Restart       |
| /sql/serviceAddress | Comforms to the upper serviceAddress | Standby address for NewSQL I/F access processing for client communication, used also for cluster internal communication when / /sql/localServiceAddress is not specified. | Restart       |
| /sql/localServiceAddress | Comforms to the upper serviceAddress | Standby address for NewSQL I/F access processing for cluster internal communication | Restart       |
| /sql/servicePort | 20001 | Standby port for New SQL access process | Restart       |
| /sql/storeSwapFilePath | swap | SQL intermediate store swap file directory | Restart       |
| /sql/storeSwapSyncSize | 1024MB | SQL intermediate store swap file and cache size | Restart       |
| /sql/storeMemoryLimit | 1024MB | Upper memory limit for intermediate data held in memory by SQL processing. | Restart       |
| /sql/workMemoryLimit | 32MB | Upper memory limit for operators in SQL processing | Restart       |
| /sql/workCacheMemory | 128MB | Upper size limit for cache without being released after use of work memory. | Restart       |
| /sql/connectionLimit | 5000 | Upper limit of the no. of connections processed for New SQL access | Restart       |
| /sql/concurrency | 4 | No. of simultaneous execution threads | Restart       |
| /sql/traceLimitExecutionTime | 300s | The lower limit of execution time of a query to write in an event log | Online |
| /sql/traceLimitQuerySize | 1000 | The upper size limit of character strings in a slow query (byte) | Online |
| /sql/notificationInterfaceAddress | "" | Specify the address of the interface which sends multicasting packets. | Restart       |
| /trace/fileCount | 30 | Upper file count limit for event log files. | Restart       |
| /security/userCacheSize | 1000  | Specify the number of entries for general and LDAP users to be cached.  | Restart     |
| /security/userCacheUpdateInterval | 60  | Specify the refresh interval for cache in seconds. | Restart     |



## System limiting values

## Limitations on numerical value

| Block size                                                              | 64KB        | 1MB - 32MB          |
|--------------------------------------------|-------------|-------------------|
| STRING/GEOMETRY data size                                               | 31KB        | 128KB             |
| BLOB data size                                                          | 1GB - 1Byte | 1GB - 1Byte       |
| Array length                                                            | 4000        | 65000             |
| No. of columns                                                          | 1024        | Approx. 7K - 32000 (\*1) |
| No. of indexes (Per container)                                          | 1024        | 16000           |
| No. of users                                                            | 128         | 128               |
| No. of databases                                                        | 128         | 128             |
| Number of affinity groups                                               | 10000       | 10000             |
| No. of divisions in a timeseries container with a cancellation deadline | 160         | 160               |
| Size of communication buffer managed by a GridDB node                   | Approx. 2GB | Approx. 2GB             |

| Block size     | 64KB        | 1MB          | 4MB           | 8MB           | 16MB        | 32MB        |
|----------------------------|-------------|-------------|-------------|-------------|-------------|-------------|
| Partition size | Approx. 4TB | Approx. 64TB | Approx. 256TB | Approx. 512TB | Approx. 1PB | Approx. 2PB       |

- STRING
  - Limiting value is equivalent to UTF-8 encode
- Spatial-type
  - Limiting value is equivalent to the internal storage format
- (*1) The number of columns
  - There is a restriction on the upper limit of the number of columns. The total size of a fixed length column (BOOL, INTEGER, FLOAT, DOUBLE, TIMESTAMP type) must be less than or equal to 59 KB. The upper limit of the number of columns is 32000 if the type is not a fixed length column.
    - Example) If a container consists of LONG type columns: the upper limit of the number of columns is 7552 ( The total size of a fixed length column 8B \* 7552 = 59KB )
    - Example) If a container consists of BYTE type columns: the upper limit of the number of columns is 32000 ( The total size of a fixed length column 1B \* 32000 = Approx. 30KB -\> Up to 32000 columns can be created because the size restriction on a fixed length column does not apply to it )
    - Example) If a container consists of STRING type columns: the upper limit of the number of columns is 32000 ( Up to 32000 columns can be created because the size restriction on a fixed length column does not apply to it )

## Limitations on naming

| Field | Allowed characters | Maximum length                    |
|------------------------|----------------------------------------------------|-------------------------------|
| Administrator user | The head of name is "gs\#" and the following characters are either alphanumeric or '_' | 64 characters                        |
| General user | Alphanumeric, '_', '-', '.', '/', and '=' | 64 characters                        |
| role   | alphanumeric characters, '\_', '-', ', '/', '='     | 64 characters                        |
| &lt;Password&gt; | Composed of an arbitrary number of characters<br />using the unicode code point | 64 bytes (by UTF-8 encoding) |
| cluster name | Alphanumeric, '_', '-', '.', '/', and '=' | 64 characters                        |
| &lt;Database name&gt; | Alphanumeric, '_', '-', '.', '/', and '=' | 64 characters                        |
| Container name<br />Table name<br />View name | Alphanumeric, '_', '-', '.', '/', and '='<br />(and '@' only for specifying a node affinity) | 16384 characters (for 64KB block)<br /> | 131072 characters (for 1MB - 32MB block) |
| Column name | Alphanumeric, '_', '-', '.', '/', and '=' | 256 characters                       |
| Index name | Alphanumeric, '_', '-', '.', '/', and '=' | 16384 characters (for 64KB block)<br />131072 characters (for 1MB - 32MB block) |
| &lt;Backup name&gt; | Alphanumeric and '_' | 12 characters                        |
| Data Affinity | Alphanumeric, '_', '-', '.', '/', and '=' | 8 characters                         |

- Case sensitivity
  - Cluster names, backup names and passwords are case-sensitive. So the names of the following example are handled as different names.

    ```
    Example) mycluster, MYCLUSTER
    ```

- Other names are not case-sensitive. Uppercase and lowercase characters are identified as the same.
- Uppercase and lowercase characters in names at the creation are hold as data.
- The names enclosed with '"' in TQL or SQL are case-sensitive. In that case, uppercase and lowercase characters are not identified as the same.

  ```
  Example) Search on the container "SensorData" and the column "Column1"
    select "Column1" from "SensorData"   Success
    select "COLUMN1" from "SENSORDATA" Fail (Because "SENSORDATA" container does not exist)
  ```

- Specifying names by TQL and SQL
  - In the case that the name is not enclosed with '"', it can contain only alphanumeric and '_'. To use other characters, the name is required to be enclosed with '"'.
    ```
    Example) select "012column", data_15 from "container.2017-09"
    ```

## Appendix


## Directory structure<a href="https://www.global.toshiba/ww/products-solutions/ai-iot/griddb/product/griddb-ee.html?utm_source=griddb.net&utm_medium=referral&utm_campaign=commercial_badge"><badge text="Commercial version" type="warning"/></a>

The directory configuration after the GridDB server and client are installed is shown below. X.X.X indicates the GridDB version.

```
(Machine installed with a server/client)
/usr/griddb-ee-X.X.X/                                    GridDB installation directory
                     Readme.txt
                     bin/
                         gs_xxx                          various commands
                         gsserver                        server module
                         gssvc                           server module
                     conf/
                     etc/
                     lib/
                         gridstore-tools-X.X.X.jar
                         XXX.jar                         Freeware
                     license/
                     misc/
                     prop/
                     sample/

/usr/share/java/gridstore-tools.jar -> /usr/griddb-ee-X.X.X/lib/gridstore-tools-X.X.X.jar

/usr/griddb-ee-webui-X.X.X/                              integrated operation control GUI directory
                           conf/
                           etc/
                           griddb-webui-ee-X.X.X.jar

/usr/griddb-ee-webui/griddb-webui.jar -> /usr/griddb-ee-webui-X.X.X/griddb-webui-ee-X.X.X.jar

/var/lib/gridstore/                                      GridDB home directory (working directory)
                   admin/                                integrated operation control GUI home directory (adminHome)
                   backup/                               backup file directory
                   conf/                                 definition file directory
                        gs_cluster.json                  Cluster definition file
                        gs_node.json                     Node definition file
                        password                         User definition file
                   data/                                 database file directory
                   txnlog/                               transaction log storage directory
                   expimp/                               Export/Import tool directory
                   log/                                  event log directory
                   webapi/                               Web API directory

/usr/bin/
         gs_xxx -> /usr/griddb-ee-X.X.X/bin/gs_xxx                       link to various commands
         gsserver -> /usr/griddb-ee-X.X.X/bin/gsserver                   link to server module
         gssvc -> /usr/griddb-ee-X.X.X/bin/gssvc                         link to server module

/usr/lib/systemd/system
       gridstore.service                            systemd unit file

/usr/griddb-ee-X.X.X/bin
       gridstore                                    rc script

(Machine installed with the library)
/usr/griddb-ee-X.X.X/                                    installation directory
                     lib/
                         gridstore-X.X.X.jar
                         gridstore-advanced-X.X.X.jar
                         gridstore-call-logging-X.X.X.jar
                         gridstore-conf-X.X.X.jar
                         gridstore-jdbc-X.X.X.jar
                         gridstore-jdbc-call-logging-X.X.X.jar
                         gridstore.h
                         libgridstore.so.0.0.0
                         libgridstore_advanced.so.0.0.0
                         python/                         Python library directory
                         nodejs/                         Node.js library directory
                             sample/
                             griddb_client.node
                             griddb_node.js
                         go/                             Go library directory
                             sample/
                             pkg/linux_amd64/griddb/go_client.a
                             src/griddb/go_client/       The source directory of Go library
                         conf/                           
                         javadoc/                           

/usr/griddb-ee-webapi-X.X.X/                             Web API directory
                     conf/
                     etc/
                     griddb-webapi-ee-X.X.X.jar

/usr/girddb-webapi/griddb-webapi.jar -> /usr/griddb-ee-webapi-X.X.X/griddb-webapi-ee-X.X.X.jar

/usr/share/java/gridstore.jar -> /usr/griddb-ee-X.X.X/lib/gridstore-X.X.X.jar
/usr/share/java/gridstore-advanced.jar -> /usr/griddb-ee-X.X.X/lib/gridstore-advanced-X.X.X.jar
/usr/share/java/gridstore-call-logging.jar -> /usr/griddb-ee-X.X.X/lib/gridstore-call-logging-X.X.X.jar
/usr/share/java/gridstore-conf.jar -> /usr/griddb-ee-X.X.X/lib/gridstore-conf-X.X.X.jar
/usr/share/java/gridstore-jdbc.jar -> /usr/griddb-ee-X.X.X/lib/gridstore-jdbc-X.X.X.jar
/usr/share/java/gridstore-jdbc-call-logging.jar -> /usr/griddb-ee-X.X.X/lib/gridstore-jdbc-call-logging-X.X.X.jar


/usr/include/gridstore.h -> /usr/griddb-ee-X.X.X/lib/gridstore.h

/usr/lib64/                                            \* For CentOS, /usr/lib64; for Ubuntu Server, /usr/lib/x86_64-linux-gnu.
           libgridstore.so -> libgridstore.so.0
           libgridstore.so.0 -> libgridstore.so.0.0.0
           libgridstore.so.0.0.0 -> /usr/griddb-ee-X.X.X/lib/libgridstore.so.0.0.0
           libgridstore_advanced.so -> libgridstore_advanced.so.0
           libgridstore_advanced.so.0 -> libgridstore_advanced.so.0.0.0
           libgridstore_advanced.so.0.0.0 -> /usr/griddb-ee-X.X.X/lib/libgridstore_advanced.so.0.0.0
```
