# Installation - Rocky Linux

We have confirmed the operation on Rocky Linux 9.4.

## Install with yum/dnf

You can install GridDB using DNF. 

First create the Yum Repo File:
```bash
sudo cat > /etc/yum.repos.d/griddb.repo << EOF
[griddb]
name=GridDB.net
baseurl=https://griddb.net/yum/el7/5.9/
enabled=1
gpgcheck=1
gpgkey=https://griddb.net/yum/RPM-GPG-KEY-GridDB.txt
EOF
```

Then install GridDB:

```bash
$ sudo dnf update
$ sudo dnf -y install griddb-meta
```

#### :warning: Note
If you would like to use a previous version of GridDB, you can change the baseurl to match that version (for example, version 5.5) 


With that command, GridDB, the c-client, the JDBC connector, the GridDB CLI, and the GridDB WebAPI will be installed onto your machine.

## Starting GridDB Server

And now, you can start your GridDB server

```bash
$ sudo systemctl start gridstore
```

To stop your server: 

```bash
$ sudo systemctl stop gridstore
```

### Starting GridDB Shell & GridDB WebAPI

Once your server is running, you can drop into the shell (java is required): 

```bash
$ sudo su gsadm
$ gs_sh
```

You can also start up the GridDB Web API: 

```bash
$ service griddb-webapi start

GridDB Web API is now running on port 8081
```

And then to use: 

```
$ curl --location -I 'http://localhost:8081/griddb/v2/myCluster/dbs/public/checkConnection' \
--header 'Authorization: Basic YWRtaW46YWRtaW4='

HTTP/1.1 200 
Content-Length: 0
Date: Wed, 09 Apr 2025 16:37:44 GMT
```
The Basic Auth credentials used here are in the style of `user:pass` encoded to base64. If using the defaults like shown in the example above, the values should be set to `admin:admin`.
	
### User and directory structure after installation

The following are the default values when you install and start a new GridDB instance.

This is the output of `gs_stat -u <user>/<pass>` (the default user and password are both `admin`)

```bash
gsadm@server:/home$ gs_stat -u admin/admin
A00105: GS_HOME, GS_LOG environment variable not set.
gsadm@server:/home$ source ~/.bash_profile
gsadm@server:/home$ gs_stat -u admin/admin

{
    "checkpoint": {
        "autoArchive": false,
        "backupOperation": 0,
        "duplicateLog": 0,
        "endTime": 1749149925097,
        "mode": "RECOVERY_CHECKPOINT",
        "normalCheckpointOperation": 0,
        "pendingPartition": 0,
        "periodicCheckpoint": "ACTIVE",
        "requestedCheckpointOperation": 0,
        "startTime": 1749149923277
    },
    "cluster": {
        "activeCount": 1,
        "applyRuleLimitTime": "2025-06-05T18:59:28.104Z",
        "autoGoal": "ACTIVE",
        "clusterName": "myCluster",
        "clusterRevisionId": "d0c19c5e-ddf0-4fa5-ac50-15f9606c1a88",
        "clusterRevisionNo": 5,
        "clusterStatus": "MASTER",
        "currentRule": "Initial",
        "designatedCount": 1,
        "goalCurrentRule": "DEFAULT",
        "goalDefaultRule": "DEFAULT",
        "loadBalancer": "ACTIVE",
        "master": {
            "address": "127.0.0.1",
            "port": 10040
        },
        "nodeList": [
            {
                "address": "127.0.0.1",
                "port": 10040
            }
        ],
        "nodeStatus": "ACTIVE",
        "notificationMode": "FIXED_LIST",
        "partitionStatus": "NORMAL",
        "startupTime": "2025-06-05T18:58:42.104Z",
        "syncCount": 2
    },
    "currentTime": "2025-06-05T18:59:03Z",
    "performance": {
        "backgroundMinRate": 0.1,
        "backupCount": 0,
        "checkpointFileFlushCount": 128,
        "checkpointFileFlushTime": 30,
        "checkpointWrite": 0,
        "checkpointWriteCompressTime": 0,
        "checkpointWriteSize": 0,
        "checkpointWriteTime": 0,
        "currentTime": 1749149943584,
        "dataFileAllocateSize": 327680,
        "dataFileSize": 327680,
        "dataFileUsageRate": 0.6,
        "expirationDetail": {
            "batchScanNum": 2000,
            "batchScanTotalNum": 0,
            "batchScanTotalTime": 0,
            "erasableExpiredTime": "",
            "estimatedBatchFree": 0,
            "estimatedErasableExpiredTime": "",
            "lastBatchFree": 0,
            "latestExpirationCheckTime": "Under measurement"
        },
        "logFileFlushCount": 256,
        "logFileFlushTime": 1609,
        "numBackground": 0,
        "numConnection": 1,
        "numNoExpireTxn": 0,
        "numSession": 0,
        "numTxn": 0,
        "ownerCount": 128,
        "peakProcessMemory": 65404928,
        "poolBufferMemory": 65536,
        "processMemory": 65404928,
        "sqlNumConnection": 1,
        "sqlPeakTotalMemory": 258984,
        "sqlStoreSwapRead": 0,
        "sqlStoreSwapReadSize": 0,
        "sqlStoreSwapReadTime": 0,
        "sqlStoreSwapWrite": 0,
        "sqlStoreSwapWriteSize": 0,
        "sqlStoreSwapWriteTime": 0,
        "sqlTotalMemory": 258984,
        "sqlTotalMemoryLimit": 0,
        "storeCompressionMode": "NO_BLOCK_COMPRESSION",
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
                "storeUse": 65536,
                "swapRead": 0,
                "swapWrite": 0
            },
            "metaData": {
                "storeMemory": 65536,
                "storeUse": 65536,
                "swapRead": 1,
                "swapWrite": 0
            },
            "rowData": {
                "storeMemory": 0,
                "storeUse": 65536,
                "swapRead": 0,
                "swapWrite": 0
            }
        },
        "storeMemory": 65536,
        "storeMemoryLimit": 1073741824,
        "storeTotalUse": 196608,
        "swapRead": 1,
        "swapReadSize": 65536,
        "swapReadTime": 0,
        "swapReadUncompressTime": 0,
        "swapWrite": 0,
        "swapWriteCompressTime": 0,
        "swapWriteSize": 0,
        "swapWriteTime": 0,
        "totalBackupLsn": 0,
        "totalLockConflictCount": 0,
        "totalOtherLsn": 0,
        "totalOwnerLsn": 3,
        "totalReadOperation": 0,
        "totalRowRead": 0,
        "totalRowWrite": 0,
        "totalWriteOperation": 0,
        "txnDetail": {
            "totalBackgroundOperation": 0
        }
    },
    "recovery": {
        "progressRate": 1
    },
    "version": "5.8.0-40624 CE"
}
```

In here you can see your version, cluster name, etc.

#### :warning: Note
- When you install this package, a gsadm OS user are created in the OS. Execute the operating command as the gsadm user.   
   Example

```bash
# su - gsadm
$ pwd
/var/lib/gridstore
```

- You do not need to set environment variable GS_HOME and GS_LOG. And the place of operating command is set to environment variable PATH.
- There is Java client library (gridstore.jar) on /usr/share/java and a sample on /usr/gridb-XXX/docs/sample/programs.

When the GridDB package is installed, the following users and directory structure will be created.

#### GridDB users and group

The OS group gridstore and user gsadm are created. Use the user gsadm as the operator of GridDB.

| User | Group |  GridDB home directory path |
|---------|-------|---------------------|
| gsadm | gridstore | /var/lib/gridstore |

The following environment variables are defined for user gsadm (in the .bash_profile file):

| Environment variables | Value | Meaning |
|---------|----|------|
| GS_HOME | /var/lib/gridstore | User gsadm/GridDB home directory |
| GS_LOG | /var/lib/gridstore/log | The output directory of the event log file of a node |



#### Directory hierarchy

The following two directories are created: GridDB home directory which contains files such as a node definition file and database files, the installation directory which contains the installed files.

###### GridDB home directory
```bash
/var/lib/gridstore/                      #GridDB home directory
                   conf/                 # Definition file directory
                        gs_cluster.json  #Cluster definition file
                        gs_node.json     #Node definition file
                        password         #User definition file
                   data/                 # Database file directory
                   log/                  # Log directory
```

###### Installation directory
```bash
Installation directory
            bin/                        # Operation command, module directory
            conf/                       #Definition file directory
                gs_cluster.json         # Custer definition file
                gs_node.json            #Node definition file
                password                #User definition file
            3rd_party/                  
            docs/
                manual/
                sample/
```

## Install with RPM

Please download the appropriate package files from the GridDB Github page.

Then, install the package of your target OS.
```bash	
$ sudo rpm -ivh griddb_nosql-X.X.X-linux.x86_64.rpm
```
	X.X.X means version


## Build/execution method

An example on how to build and execute a program is as shown.

[For Java]

1. Setting environment variables
2. Edit java Sample file to adhere to network mode (GridDB default is now FIXED_LIST mode, this uses `notification_member` instead of `host` & `port`)
2. Copy the sample program to the gsSample directory
3. Build
4. Run

```bash
$ export CLASSPATH=${CLASSPATH}:/usr/share/java/gridstore.jar:.
$ mkdir gsSample
$ vim gsSample/Sample1.java
$ cp /usr/gridstore-X.X.X/docs/sample/program/Sample1.java gsSample/.
$ javac gsSample/Sample1.java
$ java gsSample/Sample1 127.0.0.1:10001 setup_cluster_name admin your_password
```


## GridDB uninstallation

If you no longer need GridDB, uninstall the package. Execute the following procedure with root authority.

[Example]

```bash
$ sudo dnf remove griddb-meta
```

#### :warning: Note
- Files under the GridDB home directory such as definition files and data files will not be uninstalled. If you do not need it, delete it manually.

---
