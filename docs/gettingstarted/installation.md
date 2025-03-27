# Installation

## Linux

<p class="iframe-container">
<iframe src="https://www.youtube.com/embed/WHcbhlQhc8I" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
</p>

Head over to the GridDB Github Releases page and download the RPM for the the latest version:

```bash
$ wget \
https://github.com/griddb/griddb_nosql/releases/download/v4.2.0/griddb_nosql-4.2.0-1.linux.x86_64.rpm
$ sudo rpm -Uvh griddb_nosql-4.2.0-1.linux.x86_64.rpm'
```

You may also need to change some firewall settings before you can get GridDB up and running. For brevity's sake, you can simply enter this into your console and make the necessary & permanent changes later:

```bash
$ sudo export no_proxy=127.0.0.1
$ sudo service iptables stop
```

Edit Conf Files
It's easiest to edit the configuration files of GridDB as the gsadm user which you can switch to with a combination of the sudo and su commands:

```bash
$ sudo su - gsadm
$ vim conf/gs_cluster.json
```
First, gs_cluster.json needs to be edited to set the cluster name, we'll set it to the default cluster name of "defaultCluster"

```json
{
        "dataStore":{
                "partitionNum":128,
                "storeBlockSize":"64KB"
        },
        "cluster":{
                "clusterName":"defaultCluster",
                "replicationNum":2,
                "notificationAddress":"239.0.0.1",
                "notificationPort":20000,
                "notificationInterval":"5s",
                "heartbeatInterval":"5s",
                "loadbalanceCheckInterval":"180s"
        },
        "transaction":{
                "notificationAddress":"239.0.0.1",
                "notificationPort":31999,
                "notificationInterval":"5s",
                "replicationMode":0,
                "replicationTimeoutInterval":"10s"
        },
        "sync":{
                "timeoutInterval":"30s"
        }
}
```
The edits to gs_node.json are optional, changing concurrency to the number of CPU cores and storeMemoryLimit to the desired value:
```json
{
        "dataStore":{
                "dbPath":"data",
                "storeMemoryLimit":"4096MB",
                "storeWarmStart":true,
                "concurrency":4,
                "logWriteMode":1,
                "persistencyMode":"NORMAL",
                "affinityGroupSize":4
        },
       ... snip ..
}
```
Set the password for the default admin user (we'll use the very-insecure password, "admin") :

```bash
$ gs_passwd admin
Password: admin
Retype password: admin
```
Start Service
Since GridDB Community Edition doesn't include an init script, you'll need to start GridDB manually, first starting the service and then having it connect to other nodes.

```bash
$ gs_startnode 
$ gs_joincluster -u admin/admin
```

Check GridDB Status
With GridDB running, you can check it's status with gs_stat:
```bash
$ gs_stat -u admin/admin
{
    "checkpoint": {
        "endTime": 1541699864633,
        "mode": "NORMAL_CHECKPOINT",
        "normalCheckpointOperation": 3,
        "pendingPartition": 0,
        "requestedCheckpointOperation": 0,
        "startTime": 1541699857076
    },
    "cluster": {
        "activeCount": 1,
        "clusterName": "defaultCluster",
        "clusterStatus": "MASTER",
        "designatedCount": 1,
        "loadBalancer": "ACTIVE",
        "master": {
            "address": "192.168.1.77",
            "port": 10040
        },
        "nodeList": [
            {
                "address": "192.168.1.77",
                "port": 10040
            }
        ],
        "nodeStatus": "ACTIVE",
        "notificationMode": "MULTICAST",
        "partitionStatus": "NORMAL",
        "startupTime": "2018-11-08T16:57:31Z",
        "syncCount": 2
    },
    "currentTime": "2018-11-08T18:15:15Z",
    "performance": {
        "backupCount": 0,
        "batchFree": 0,
        "checkpointFileAllocateSize": 262144,
        "checkpointFileSize": 262144,
        "checkpointFileUsageRate": 0,
        "checkpointMemory": 0,
        "checkpointMemoryLimit": 1073741824,
        "checkpointWriteSize": 0,
        "checkpointWriteTime": 0,
        "currentCheckpointWriteBufferSize": 0,
        "currentTime": 1541700915329,
        "numBackground": 0,
        "numConnection": 2,
        "numNoExpireTxn": 0,
        "numSession": 0,
        "numTxn": 0,
        "ownerCount": 128,
        "peakProcessMemory": 68169728,
        "processMemory": 68169728,
        "recoveryReadSize": 262144,
        "recoveryReadTime": 0,
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
        "storeMemoryLimit": 4294967296,
        "storeTotalUse": 0,
        "swapRead": 0,
        "swapReadSize": 0,
        "swapReadTime": 0,
        "swapWrite": 0,
        "swapWriteSize": 0,
        "swapWriteTime": 0,
        "syncReadSize": 0,
        "syncReadTime": 0,
        "totalBackupLsn": 0,
        "totalLockConflictCount": 0,
        "totalOtherLsn": 0,
        "totalOwnerLsn": 0,
        "totalReadOperation": 0,
        "totalRowRead": 0,
        "totalRowWrite": 0,
        "totalWriteOperation": 0
    },
    "recovery": {
        "progressRate": 1
    },
    "version": "4.2.0-33128 CE"
}
```
We're now ready to install client software to connect to GridDB.

Java Connector
Download + Install Java
Before downloading, let's switch back to your original user (not the GridDB Admin user)
```bash
$ exit
```
You have two options for using Java: Oracle JDK 1.8.0 (recommended) or OpenJDK. You will be required to make an account to download the latest version of Oracle JDK, so head to Oracle’s download page and get the installation file Java SE Development Kit 8 Downloads.


You may also opt to download the older version of Oracle JDK via terminal using the following command:

```bash
$ wget -c --header "Cookie: oraclelicense=accept-securebackup-cookie" \
http://download.oracle.com/otn-pub/java/jdk/8u131-b11/d54c1d3a095b4ff2b6607d096fa80163/jdk-8u131-linux-x64.rpm
```
Then install:

```bash
$ sudo yum localinstall jdk-8u131-linux-x64.rpm
```
You can also instead choose to install via CentOS(yum) as previously mentioned. To do so:

```bash
$ sudo yum -y install java-1.8.0-openjdk-devel
```
Build + Run Sample
```bash
$ mkdir ~/gsSample/ 
$ cp /usr/griddb-*/docs/sample/program/Sample1.java ~/gsSample 
$ cd ~/gsSample 
$ export CLASSPATH=${CLASSPATH}:/usr/griddb-4.2.0/bin/gridstore-4.2.0.jar
$ javac Sample1.java 
$ cd .. 
$ java gsSample/Sample1 239.0.0.1 31999 defaultCluster admin admin
Person:  name=name02 status=false count=2 lob=[65, 66, 67, 68, 69, 70, 71, 72, 73, 74]
```
The arguments for the Sample are: 1. 239.0.0.1 : Multicast address of the GridDB Server 2. 31999: Multicast port of the GridDB server. 3. defaultCluster: Your clustername 4. admin: Your username. 5. admin: Your password.
Python Connector
Download + Install Python3
GridDB's Python Client requires Python3 which isn't included by default in CentOS. While you can install Python3.4 using EPEL, I prefer using the latest version of Python from IUS.

```bash
$ sudo yum install -y https://centos7.iuscommunity.org/ius-release.rpm 
$ sudo yum install -y python35u python35u-pip
```
Download + Install C Client
The Python Client also requires GridDB's C Client which can be downloaded from the GridDB C client Github Releases page. You can copy the link fo rhte latest release and download and untar it. Once untarred, all thats required is copying the library files to /usr/lib64.

```bash
$ wget  \
https://github.com/griddb/c_client/archive/v4.2.0.tar.gz 
$ tar zxvf griddb_c_client-4.2.0-linux.x86_64.tar.gz 
$ cd c_client-4.2.0/ 
$ sudo cp bin/libgridstore.so* /usr/lib64/
```
Download + Install PyClient
From the GridDB Python Client's Github Releases page copy the link from the latest release and download and untar it.

```bash
$ wget https://github.com/griddb/python_client/archive/0.7.6.tar.gz 
$ tar zxvf 0.7.6.tar.gz 
$ cd python_client-0.7.6/
```
You'll need to edit the Makefile to point to the correct Python include directory, in the case of the IUS Python packages, you'll change -I/usr/include/python3.6 to -I/usr/include/python3.6m and then build the client with make.

```bash
$ make
```
Run Sample
To run the Python sample, you simply copy it beside the GridDB Python files. If you've used the Java sample already, you will want to change the container name, changing conInfo = griddb.ContainerInfo("col01", to conInfo = griddb.ContainerInfo("pycol01",.

```bash
$ cp sample/sample1.py . 
$ python3 sample1.py  239.0.0.1 31999 defaultCluster admin admin
Person: name=name02 status=False count=2 lob=[65, 66, 67, 68, 69, 70, 71, 72, 73, 74]
```
Now, if you're adding GridDB to your own project, simply copy griddb_python.py and _griddb_python.so to directory that contains your Python source files.

## Docker

First off, a user-created Docker network is required to allow clients to easily connect to the GridDB server, which can be created with the following command...

```bash
$ docker network create griddb-net
```
If you prefer to learn via video:


The Server
The server container consists of two parts, the Dockerfile and the griddb_start.sh script. The Dockerfile is quite simple, it installs the GridDB RPM from Github, sets environment variables, exposes the required ports, and then executes the griddb_start.sh script which does most of the heavy lifting.

```bash
$ docker pull griddbnet/griddb
FROM centos:7

RUN rpm -Uvh https://github.com/griddb/griddb_nosql/releases/download/v4.2.1/griddb_nosql-4.2.1-1.linux.x86_64.rpm

ENV GS_HOME /var/lib/gridstore
ENV GS_LOG $GS_HOME/log
ENV HOME $GS_HOME

WORKDIR $HOME

ADD start_griddb.sh /
USER gsadm
CMD /start_griddb.sh
EXPOSE 10001 10010 10020 10030 10040 10050 10080 20001
```
In griddb_start.sh, the container's IP address is retrieved so that it can be used within the gs_cluster.json configuration file which is written via cat. gs_node.json is also written with cat allowing changes to be easily made.

```bash
#!/bin/bash

chown gsadm.gridstore /var/lib/gridstore/data

IP=`grep $HOSTNAME /etc/hosts | awk ' { print $1 }'`

cat << EOF > /var/lib/gridstore/conf/gs_cluster.json
{
        "dataStore":{
                "partitionNum":128,
                "storeBlockSize":"64KB"
        },
        "cluster":{
                "clusterName":"defaultCluster",
                "replicationNum":2,
                "notificationInterval":"5s",
                "heartbeatInterval":"5s",
                "loadbalanceCheckInterval":"180s",
                "notificationMember": [
                        {
                                "cluster": {"address":"$IP", "port":10010},
                                "sync": {"address":"$IP", "port":10020},
                                "system": {"address":"$IP", "port":10080},
                                "transaction": {"address":"$IP", "port":10001},
                                "sql": {"address":"$IP", "port":20001}
                       }
                ]
        },
        "sync":{
                "timeoutInterval":"30s"
        }
}
EOF
cat << EOF > /var/lib/gridstore/conf/gs_node.json
{
    "dataStore":{
        "dbPath":"data",
        "backupPath":"backup",
        "syncTempPath":"sync",
        "storeMemoryLimit":"1024MB",
        "storeWarmStart":false,
        "storeCompressionMode":"NO_COMPRESSION",
        "concurrency":4,
        "logWriteMode":1,
        "persistencyMode":"NORMAL",
        "affinityGroupSize":4,
        "autoExpire":false
    },
    "checkpoint":{
        "checkpointInterval":"60s",
        "checkpointMemoryLimit":"1024MB",
        "useParallelMode":false
    },
    "cluster":{
        "servicePort":10010
    },
    "sync":{
        "servicePort":10020
    },
    "system":{
        "servicePort":10040,
        "eventLogPath":"log"
    },
    "transaction":{
        "servicePort":10001,
        "connectionLimit":5000
    },
   "trace":{
        "default":"LEVEL_ERROR",
        "dataStore":"LEVEL_ERROR",
        "collection":"LEVEL_ERROR",
        "timeSeries":"LEVEL_ERROR",
        "chunkManager":"LEVEL_ERROR",
        "objectManager":"LEVEL_ERROR",
        "checkpointFile":"LEVEL_ERROR",
        "checkpointService":"LEVEL_INFO",
        "logManager":"LEVEL_WARNING",
        "clusterService":"LEVEL_ERROR",
        "syncService":"LEVEL_ERROR",
        "systemService":"LEVEL_INFO",
        "transactionManager":"LEVEL_ERROR",
        "transactionService":"LEVEL_ERROR",
        "transactionTimeout":"LEVEL_WARNING",
        "triggerService":"LEVEL_ERROR",
        "sessionTimeout":"LEVEL_WARNING",
        "replicationTimeout":"LEVEL_WARNING",
        "recoveryManager":"LEVEL_INFO",
        "eventEngine":"LEVEL_WARNING",
        "clusterOperation":"LEVEL_INFO",
        "ioMonitor":"LEVEL_WARNING"
    }
}
EOF
```
A password is set and the node started, this happens before a while loop waits for the GridDB service to finish recovering which then joins the cluster. Finally, tailing the gridstore log file, GridDB logs can be accessed easily using the log command.

```
gs_passwd admin -p admin
gs_startnode

while gs_stat -u admin/admin | grep RECOV > /dev/null; do
    echo Waiting for GridDB to be ready.
    sleep 5
done

gs_joincluster -n 1 -u admin/admin

tail -f /var/lib/gridstore/log/gridstore*.log
```
The image is built with docker build:
```bash
$ docker build -t griddb-server .
```
Now, if you don't need or want persistent data storage (if you kill the container or it otherwise shuts down, all data in GridDB will be lost) you can start the GridDB server container with the following:
```bash
$ docker run --network griddb-net --name griddb-server -d -t griddbnet/griddb
```
If you want data to be stored, first you need to create a volume to store it in:
```bash
$ docker volume create griddb-data
```
Then, you can start GridDB to include the mount option:
```bash
$ docker run --network griddb-net --name griddb-server \
     --mount source=griddb-data,target=/var/lib/gridstore/data -d -t griddbnet/griddb
```
That's it, your GridDB server Docker container should now be running.
```bash
$ docker ps
CONTAINER ID        IMAGE               COMMAND                  CREATED             STATUS              PORTS                                                                                    NAMES
bef6eecc959d        griddb-server       "/bin/sh -c /start_g…"   5 minutes ago      Up 5 minutes       10001/tcp, 10010/tcp, 10020/tcp, 10030/tcp, 10040/tcp, 10050/tcp, 10080/tcp, 20001/tcp   griddb-server
$ docker logs bef6
Waiting for GridDB to be ready.
Waiting for GridDB to be ready.
Waiting for GridDB to be ready.
Waiting for GridDB to be ready.
Waiting for GridDB to be ready.
Waiting for GridDB to be ready.
2019-07-31T19:23:41.270Z bef6eecc959d 13 INFO RECOVERY_MANAGER [160903:RM_REDO_LOG_STATUS] Redo finished (pId=125, lsn=0)
2019-07-31T19:23:41.270Z bef6eecc959d 13 INFO RECOVERY_MANAGER [160903:RM_REDO_LOG_STATUS] Redo finished (pId=126, lsn=0)
2019-07-31T19:23:41.270Z bef6eecc959d 13 INFO RECOVERY_MANAGER [160903:RM_REDO_LOG_STATUS] Redo finished (pId=127, lsn=0)
2019-07-31T19:23:41.270Z bef6eecc959d 13 INFO CHECKPOINT_SERVICE [30902:CP_STATUS] [RecoveryCheckpoint]
2019-07-31T19:23:42.366Z bef6eecc959d 36 INFO CHECKPOINT_SERVICE [30902:CP_STATUS] [CP_START] mode=RECOVERY_CHECKPOINT, backupPath=
2019-07-31T19:23:48.913Z bef6eecc959d 36 INFO CHECKPOINT_SERVICE [30902:CP_STATUS] [CP_END] mode=RECOVERY_CHECKPOINT, backupPath=, commandElapsedMillis=6547
2019-07-31T19:23:48.913Z bef6eecc959d 20 INFO CLUSTER_OPERATION [40906:CS_NORMAL_OPERATION] Recovery checkpoint is completed, start all services
2019-07-31T19:24:42.417Z bef6eecc959d 36 INFO CHECKPOINT_SERVICE [30902:CP_STATUS] [CP_END] mode=NORMAL_CHECKPOINT, backupPath=, commandElapsedMillis=0
2019-07-31T19:24:42.785Z bef6eecc959d 16 INFO SYSTEM_SERVICE [50903:SC_WEB_API_CALLED] Join cluster called (clusterName=defaultCluster, clusterNodeNum=1)
2019-07-31T19:24:42.785Z bef6eecc959d 20 INFO CLUSTER_OPERATION [40906:CS_NORMAL_OPERATION] Called Join cluster
2019-07-31T19:24:47.486Z bef6eecc959d 20 INFO CLUSTER_OPERATION [40906:CS_NORMAL_OPERATION] Detect cluster status change (active nodeCount=1, checked nodeNum=1)
2019-07-31T19:24:47.486Z bef6eecc959d 20 WARNING CLUSTER_OPERATION [180061:CLM_STATUS_TO_MASTER] Cluster status change to MASTER 
... snip ...
2019-07-31T19:28:43.734Z bef6eecc959d 36 INFO CHECKPOINT_SERVICE [30902:CP_STATUS] [CP_END] mode=NORMAL_CHECKPOINT, backupPath=, commandElapsedMillis=0
```
Java Container
The GridDB Java client Dockerfile is quite simple; the sequence of steps are: installing the OpenJDK Development package and then the GridDB RPM, adding the source, compiling, and executing it.
```bash
FROM centos:7

RUN yum install -y java-1.8.0-openjdk-devel
RUN rpm -Uvh https://github.com/griddb/griddb_nosql/releases/download/v4.2.1/griddb_nosql-4.2.1-1.linux.x86_64.rpm

ADD Sample1.java /

ENV CLASSPATH /usr/share/java/gridstore.jar:$CLASSPATH

RUN javac Sample1.java

CMD java Sample1
```
The only particular source code change required is with the Gridstore Properties object which connects to "griddb-server", the griddb-server container's name.
```bash
Properties props = new Properties();
props.setProperty("notificationMember", "griddb-server:10001");
props.setProperty("clusterName", "defaultCluster");
props.setProperty("user", "admin");
props.setProperty("password", "admin");
```
If you don't want to run your application in a Docker container, you can change the notificationMember to point to the IP address of the server container. The following command will output its IP address if you do not know how to look it up:
```
$ CONT=`docker ps | grep griddb-server | awk '{ print $1 }'`; docker exec $CONT cat /etc/hosts | grep $CONT | awk '{ print $1 }'
172.18.0.2
```
```bash
$ CONT=`docker ps | grep griddb-server | awk '{ print $1 }'`; docker exec $CONT cat /etc/hosts | grep $CONT | awk '{ print $1 }'
```
```
172.18.0.2
```
Building and running are both quite simple:
```bash
$ docker build -t griddb-java .
Sending build context to Docker daemon   5.12kB
Step 1/7 : FROM centos:7
 ---> 9f38484d220f
Step 2/7 : RUN yum install -y java-1.8.0-openjdk-devel
 ---> Using cache
 ---> 34e283d179ac
Step 3/7 : RUN rpm -Uvh https://github.com/griddb/griddb_nosql/releases/download/v4.2.1/griddb_nosql-4.2.1-1.linux.x86_64.rpm
 ---> Using cache
 ---> 83669ae6deda
Step 4/7 : ADD Sample1.java /
 ---> Using cache
 ---> 042eea3c5645
Step 5/7 : ENV CLASSPATH /usr/share/java/gridstore.jar:$CLASSPATH
 ---> Using cache
 ---> c6e5f9a2760a
Step 6/7 : RUN javac Sample1.java
 ---> Using cache
 ---> b0c5757cdb90
Step 7/7 : CMD java Sample1
 ---> Using cache
 ---> eb70502014bd
Successfully built eb70502014bd
Successfully tagged griddb-java:latest
```
As is running the container:
```bash
$ docker run --network griddb-net -t griddb-java
Person:  name=name02 status=false count=2 lob=[65, 66, 67, 68, 69, 70, 71, 72, 73, 74]
```
Python Container
The Python client's Dockerfile is a bit more complex as PCRE, SWIG, and the Python Client need to be compiled.
```bash
$ docker pull griddbnet/griddb-python
FROM centos:7

RUN yum -y groupinstall "Development Tools"
RUN yum -y install epel-release wget
RUN yum -y install python36 python36-devel 
RUN rpm -Uvh https://github.com/griddb/c_client/releases/download/v4.2.0/griddb_c_client-4.2.0-1.linux.x86_64.rpm
RUN ln -sf /usr/include/python3.6m /usr/include/python3.6

RUN wget https://sourceforge.net/projects/pcre/files/pcre/8.39/pcre-8.39.tar.gz
RUN tar xvfz pcre-8.39.tar.gz 
RUN cd pcre-8.39 && ./configure &&  make &&  make install
RUN cd ..

RUN wget https://prdownloads.sourceforge.net/swig/swig-3.0.12.tar.gz
RUN tar xvfz swig-3.0.12.tar.gz 
RUN cd swig-3.0.12 && ./configure &&  make && make install
RUN cd ..

RUN wget https://github.com/griddb/python_client/archive/0.8.1-rc0.tar.gz
RUN tar xvfz 0.8.1-rc0.tar.gz
RUN cd python_client-0.8.1-rc0 && make

ENV PYTHONPATH /python_client-0.8.1-rc0

ADD sample1.py /
CMD /sample1.py
```
The only changes required the python source code is changing Gridstore parameters to point to the server container:
```bash
gridstore = factory.get_store(
        notification_member="griddb-server:10001",
        cluster_name="defaultCluster",
        username="admin",
        password="admin"
)
```
Like with Java, if you don't want to run your application in a Docker container, you can change the notificationMember to point to the IP address of the server container. The following command will output its IP address. If you do not know how to look it up:
```bash
$ CONT=`docker ps | grep griddb-server | awk '{ print $1 }'`; docker exec $CONT cat /etc/hosts | grep $CONT | awk '{ print $1 }'
172.18.0.2
```
Building is essentially the same as the Java client:
```bash
$ docker build -t griddb-python .
Sending build context to Docker daemon   5.12kB
Step 1/20 : FROM centos:7
 ---> 9f38484d220f
Step 2/20 : RUN yum -y groupinstall "Development Tools"
 ---> Using cache
 ---> 2eb55fc14acb
Step 3/20 : RUN yum -y install epel-release wget
 ---> Using cache
 ---> 3f8a1bfb8999
Step 4/20 : RUN yum -y install python36 python36-devel
 ---> Using cache
 ---> 8ced1273c292
Step 5/20 : RUN rpm -Uvh https://github.com/griddb/c_client/releases/download/v4.2.0/griddb_c_client-4.2.0-1.linux.x86_64.rpm
 ---> Using cache
 ---> e5188e0704e0
Step 6/20 : RUN ln -sf /usr/include/python3.6m /usr/include/python3.6
 ---> Using cache
 ---> 4828bdbb0711
Step 7/20 : RUN wget https://sourceforge.net/projects/pcre/files/pcre/8.39/pcre-8.39.tar.gz
 ---> Using cache
 ---> b57e7fa48df5
Step 8/20 : RUN tar xvfz pcre-8.39.tar.gz
 ---> Using cache
 ---> f06336db97c0
Step 9/20 : RUN cd pcre-8.39 && ./configure &&  make &&  make install
 ---> Using cache
 ---> c28540943d49
Step 10/20 : RUN cd ..
 ---> Using cache
 ---> 3b24d85b842c
Step 11/20 : RUN wget https://prdownloads.sourceforge.net/swig/swig-3.0.12.tar.gz
 ---> Using cache
 ---> 71df54189d11
Step 12/20 : RUN tar xvfz swig-3.0.12.tar.gz
 ---> Using cache
 ---> 96cbb828bef0
Step 13/20 : RUN cd swig-3.0.12 && ./configure &&  make && make install
 ---> Using cache
 ---> 9af12ad99d1d
Step 14/20 : RUN cd ..
 ---> Using cache
 ---> e1dd5e9259b7
Step 15/20 : RUN wget https://github.com/griddb/python_client/archive/0.8.1-rc0.tar.gz
 ---> Using cache
 ---> 746a4db157bf
Step 16/20 : RUN tar xvfz 0.8.1-rc0.tar.gz
 ---> Using cache
 ---> 278cd4d8b37a
Step 17/20 : RUN cd python_client-0.8.1-rc0 && make
 ---> Using cache
 ---> ead9d38a0424
Step 18/20 : ENV PYTHONPATH /python_client-0.8.1-rc0
 ---> Using cache
 ---> f5326e3a4c7d
Step 19/20 : ADD sample1.py /
 ---> c5426a34cc29
Step 20/20 : CMD /sample1.py
 ---> Running in b4b197e78139
Removing intermediate container b4b197e78139
 ---> 95e6c3cc7859
Successfully built 95e6c3cc7859
Successfully tagged griddb-python:latest
```
Running the Python Client:
```bash
$ docker run --network griddb-net -t griddbnet/griddb-python
 Person: name=name02 status=False count=2 lob=[65, 66, 67, 68, 69, 70, 71, 72, 73, 74] 
 ```
