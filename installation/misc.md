# Installation - WSL (Windows Subsystem Linux)

Installing and using GridDB on Windows machines is made very easy with the use of [Docker](). With Docker, we can install GridDB and keep it maintained inside of its own siloed container, complete with its own network environment -- if needed. And though this method works brilliantly, sometimes it behooves a developer to run the server in a more accessible way. In this article, we will go over how to install GridDB on Windows machines without the use of Docker or Virtualbox -- though the approach is not too different.

Instead of using those technologies, we will instead be utilizing the excellent [Windows Subsystem for Linux](https://learn.microsoft.com/en-us/windows/wsl/about). Normally shortned to wsl, this subsystem allows developers to "run a GNU/Linux environment -- including most command-line tools, utilities, and applications -- directly on Windows, unmodified, without the overhead of a traditional virtual machine or dualboot setup." Basically, this tool provides for a user to run native Windows, but also have access to a Linux command line interface by simply opening up a terminal application your Windows machine -- that is the power and flexibility of the wsl.

So in this article, we will go over a basic installation of wsl, and then how to properly install GridDB so that you can reap all of the benefits of running GridDB on your Windows machine.

## Installing WSL

To begin, you will need an environment with either Windows 10 or 11. Next, simply open up a Windows powershell or command prompt with raised admin priveleges (right click --> run as admin) and enter the following command: 

`wsl --install`

And that is basically the entirety of it; a much more detailed account of getting started with WSL can be found [here](https://learn.microsoft.com/en-us/windows/wsl/install).

An important note: from my limited testing, it appears as though enabling `systemd` (see below) can only be done when installing Ubuntu from directly inside the Microsoft Store as seen here: https://ubuntu.com/wsl. So if you download Ubuntu from official store, it will appear in your WSL and will work like normal.

Once you install WSL, you will have [Ubuntu](https://en.wikipedia.org/wiki/Ubuntu) available to you and can begin the process of installing GridDB. Though, of course, if you prefer [RockyLinux](https://en.wikipedia.org/wiki/Rocky_Linux) or some other Linux distro, you can run actually run multiple instances of Linux subsystems on your machine -- you simply choose which distro you'd like to run and use.

## Installing GridDB

You can read about installing GridDB on Ubuntu in the docs: [Installation - Ubuntu](./ubuntu), but here are the basic instructions. What we will do is add the GridDB apt repository into our apt-get sources list so that it knows where to download GridDB. Once it's added, we can simply run an apt install and it will fetch and install everything you need to get started.

```bash
$ sudo sh -c 'echo "deb https://www.griddb.net/apt griddb/5.7 multiverse" >>  /etc/apt/sources.list.d/griddb.list'
$ wget -qO - https://www.griddb.net/apt/griddb.asc | sudo apt-key add -
```

Once this is added, we can simply 

```bash
$ sudo apt update
$ sudo apt install griddb-meta
```

The griddb-meta package includes: GridDB server, c_client, jdbc, and GridDB CLI. 

### Running GridDB On WSL

And now this where we need to deviate a little bit from a normal Ubuntu installation process. 

#### GridDB On WSL with Systemd

By default, the easiest method to run GridDB is through systemd, but unfortunately it is not available on WSL -- until recently! And if you are wondering what systemd is, it's a suite of software which provides a "a "system and service manager" – an init system used to bootstrap user space and manage user processes." What this means in the context of GridDB is that we can enable GridDB to be run A. on bootup (of WSL), and B. managed by the system.

So, to enable systemd on your WSL instance, use your favorite text editor and open up the following file (or create if it doesn't exist yet)"

```bash
$ sudo vim /etc/wsl.conf
```

And once it's open, add the following content:

    [boot]
    systemd=true

Now simply restart your WSL with the following command: wsl --shutdown in an elevated powershell or command prompt and reopen your WSL instance.

Now we can start GridDB:

```bash
$ sudo systemctl start gridstore
```

To verify that it's running you can run `sudo systemctl status gridstore`. With GridDB running on your WSL, you can now access it via the [GridDB CLI](https://github.com/griddb/cli) or through the NoSQL interface using the following credentials:  

```bash
notificationMember: 127.0.0.0.1:10001
user: admin
password: admin
cluster: myCluster
database: public
```

#### Next Steps

Once you have GridDB running and have installed the GridDB Command Line Interface, you can drop into GridDB shell.

To do so, first swap into the `gsadm` user and then run the `gs_sh` command.

```bash
$ sudo su gsadm
$ gs_sh
gs> help
```

You are of course also free to begin connecting directly to your server using the NoSQL interface (Java, Python, Nodejs, etc). The following video will showcase basic CRUD using GridDB via the CLI; the latter half of the video will show hands-on examples. 

<p class="iframe-container">
<iframe src="https://www.youtube.com/embed/5bdc2UNLnj8?si=ZGvq81JCRfrk6sgn" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
</p>


#### Using GridDB on WSL Without Systemd

The above method is the easier and preferred method for running GridDB, but if you would prefer to run GridDB in a more ad-hoc sort of way, you can manually start and stop it instead.

To do so, we will login to the GridDB user `gsadm` which was created for us at the time of the GridDB Installation. From there, we can manually start up GridDB and join the cluster and use GridDB normally.

```bash
$ sudo su gsadm
$ gs_startnode -u admin/admin
```

And note, if you get the following error: 

    A00105: GS_HOME, GS_LOG environment variable not set.

The error is self-explanatory, but to solve it, you can simply source the gsadm's .bash_profile file

```bash
$  source ~/.bash_profile
```

And then try again: 

```bash
$ gs_startnode -u admin/admin
```

And to join the cluster

```bash
$ gs_joincluster -c myCluster -u admin/admin
```

And then to make sure everything is gravy: 

```bash
$ gs_stat -u admin/admin
```

    {
        "checkpoint": {
            "backupOperation": 0,
            "duplicateLog": 0,
            "endTime": 1681163543250,
            "mode": "NORMAL_CHECKPOINT",
            "normalCheckpointOperation": 747,
            "pendingPartition": 0,
            "periodicCheckpoint": "ACTIVE",
            "requestedCheckpointOperation": 0,
            "startTime": 1681163543246
        },
        "cluster": {
            "activeCount": 1,
            "applyRuleLimitTime": "2023-04-07T22:09:04.281-08:00",
            "autoGoal": "ACTIVE",
            "clusterName": "myCluster",
            "clusterRevisionId": "db3ff2a8-319e-42d3-8cb2-5ecf1657e0ad",
            "clusterRevisionNo": 8975,
            "clusterStatus": "MASTER",
            "currentRule": "Initial",
            "designatedCount": 1,
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
            "startupTime": "2023-04-07T09:40:58.181-08:00",
            "syncCount": 2
        },
        "currentTime": "2023-04-10T13:53:17-08:00",
        "performance": {
            "backgroundMinRate": 0.1,
            "backupCount": 0,
            "checkpointFileFlushCount": 128,
            "checkpointFileFlushTime": 37,
            "checkpointWrite": 0,
            "checkpointWriteCompressTime": 0,
            "checkpointWriteSize": 0,
            "checkpointWriteTime": 0,
            "currentTime": 1681163597511,
            "dataFileAllocateSize": 0,
            "dataFileSize": 0,
            "dataFileUsageRate": 1,
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
            "logFileFlushTime": 385,
            "numBackground": 0,
            "numConnection": 1,
            "numNoExpireTxn": 0,
            "numSession": 0,
            "numTxn": 0,
            "ownerCount": 128,
            "peakProcessMemory": 136179712,
            "poolBufferMemory": 0,
            "processMemory": 136179712,
            "sqlNumConnection": 1,
            "sqlStoreSwapRead": 0,
            "sqlStoreSwapReadSize": 0,
            "sqlStoreSwapReadTime": 0,
            "sqlStoreSwapWrite": 0,
            "sqlStoreSwapWriteSize": 0,
            "sqlStoreSwapWriteTime": 0,
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
            "storeMemoryLimit": 1073741824,
            "storeTotalUse": 0,
            "swapRead": 0,
            "swapReadSize": 0,
            "swapReadTime": 0,
            "swapReadUncompressTime": 0,
            "swapWrite": 0,
            "swapWriteCompressTime": 0,
            "swapWriteSize": 0,
            "swapWriteTime": 0,
            "totalBackupLsn": 0,
            "totalExternalConnectionCount": 0,
            "totalInternalConnectionCount": 0,
            "totalLockConflictCount": 0,
            "totalOtherLsn": 0,
            "totalOwnerLsn": 0,
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
        "version": "5.1.0-39692 CE"
    }


# Installation - ChromeOS (Linux)

Installing and using GridDB on ChromeOS machines can be accomplished by setting up Linux on your Chromebook. There is an official list of devices which can utilize Linux on ChromeOS, though essentially every device released in 2019 or afterwards should be able to add Linux; if your device is from prior to 2019, there is an official list here: <https://sites.google.com/a/chromium.org/dev/chromium-os/chrome-os-systems-supporting-linux>.

So, in order to utilize GridDB on a Chromebook, you will need to enable Linux and then we can install GridDB in the same method as we do on other Linux machines.

## Linux on ChromeOS

To enable Linux, head to your chromebook's settings, find the advanced section, and then developers. You will see a setting titled "Linux development environment" and select "turn on". You will then be greeted with some simple on-screen instructions and ChromeOS will handle all of the installation for you.

Once you restart, you will have access to a Linux command line based on Debian (similar to Ubuntu). From here, you will be able to use the APT package manager to install packages in your Linux environment. And similar to [WSL](https://griddb.net/en/blog/install-griddb-on-windows-via-wsl/), this instance of Linux living inside your ChromeOS machine is a bit similar to a virtual machine; it is a container which runs inside your OS and can be accessed from within your ChromeOS environment.

## Install GridDB

As stated before, you now have access to the package manager known as APT, which means you can install GridDB directly through that as seen here: <https://docs.griddb.net/gettingstarted/using-apt/>

```bash
$ sudo sh -c 'echo "deb https://www.griddb.net/apt griddb/5.7 multiverse" ;&gt;  /etc/apt/sources.list.d/griddb.list'
$ wget -qO - https://www.griddb.net/apt/griddb.asc | sudo apt-key add -
```

And then

```bash
$ sudo apt update
$ sudo apt install griddb-meta
```

The meta package for GridDB will install GridDB, the [GridDB C-client](https://github.com/griddb/c_client), the [GridDB CLI](https://github.com/griddb/cli), and the [GridDB JDBC Driver](https://github.com/griddb/jdbc) -- how convenient! Once GridDB is installed, you can start it up: 

`$ sudo systemctl start gridstore`