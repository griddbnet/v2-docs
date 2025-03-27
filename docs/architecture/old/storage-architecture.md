# Storage Architecture

### GridDB Nodes

GridDB is operated by clusters which are composed of multiple nodes. To access the database from an application system, the nodes have to be started up and the cluster has to be constituted (cluster service is executed). A cluster is formed and cluster service is started when a number of nodes specified by the user joins the cluster. Cluster service will not be started and access from the application will not be possible until all nodes constituting a cluster have joined the cluster. A cluster needs to be composed even when operating with 1 node only. In this case, the number of nodes constituting a cluster is 1. A composition that operates a single node is known as a single composition.

Cluster names are used to separate multiple clusters so that the correct clusters (using the intended nodes) can be composed using multiple GridDB nodes on a network. Multiple GridDB clusters can be composed in the same network. A cluster is composed of nodes with the same cluster name, number of nodes constituting a cluster, and with the same multi-cast address setting. When composing a cluster, the parameters need to be specified as well in addition to setting the cluster name in the cluster definition file which is a definition file saved for each node constituting a cluster.

In GridDB, there is no SPOF (single point of failure) because the clusters are constantly duplicating data (hereinafter known as replicas). Replicas also allow data-processing to continue, even when failure occurs in any of the nodes constituting the cluster. Special operating procedures are not necessary as the system will also automatically perform re-arrangement of the data after a node failure occurs (autonomous data arrangement). When the data arranged in a failed node is restored from a replica, the data is re-arranged so that the set number of replicas is reached automatically.

Duplex, triplex or multiplex replica can be set according to the availability requirements.

Each node performs persistence of the data update information using a disk, and all registered and updated data up to that point in time can be restored without any data being lost even following failure across the entire cluster system.

In addition, since the client also possesses cache information on the data arrangement and management, upon detecting a node failure, it will automatically perform a failover and data access can be continued using a replica.

### Data perpetuation

Data registered or updated in a container or table is perpetuated in the disk or SSD, and protected from data loss when a node failure occurs. There are 2 types of transaction log process, one to synchronize data in a data update and write the updated data sequentially in a transaction log file, and the other is a checkpoint process to store updated data in the memory regularly in the database file on a block basis.

To write to a transaction log, either one of the following settings can be made in the node definition file.

*   0: SYNC
*   An integer value of 1 or higher1: DELAYED_SYNC

In the 'SYNC' mode, log writing is carried out synchronously every time an update transaction is committed or aborted. In the 'DELAYED\_SYNC' mode, log writing during an update is carried out at a specified delay of several seconds regardless of the update timing. Default value is '1 (DELAYED\_SYNC 1 sec)'.

When 'SYNC' is specified, although the possibility of losing the latest update details when a node failure occurs is lower, the performance is affected in systems that are updated frequently.

On the other hand, if 'DELAYED_SYNC' is specified, although the update performance improves, any update details that have not been written in the disk when a node failure occurs will be lost.

If there are 2 or more replicas in a raster configuration, the possibility of losing the latest update details when a node failure occurs is lower even if the mode is set to 'DELAYED\_SYNC' as the other nodes contain replicas. Consider setting the mode to 'DELAYED\_SYNC' as well if the update frequency is high and performance is required. In a checkpoint, the update block is updated in the database file. A checkpoint process operates at the cycle set on a node basis. A checkpoint cycle is set by the parameters in the node definition file. Initial value is 1200 sec (20 minutes).

By raising the checkpoint execution cycle figure, data perpetuation can be set to be carried out in a time band when there is relatively more time to do so e.g. by perpetuating data to a disk at night and so on. On the other hand, when the cycle is lengthened, the disadvantage is that the number of transaction log files that have to be rolled forward when a node is restarted outside the system process increases, thereby increasing the recovery time.

Data that is updated in a checkpoint execution is pooled and maintained in a memory separate from the checkpoint writing block. Set checkpoint concurrent execution for the checkpoint to carry out the checkpoint quickly. If concurrent execution is set, concurrent processing is carried out until the number of transactions executed simultaneously is the same.

![](img/data%20pepetuation.png)

### In-Memory Data Overflow

In GridDB, most of the data processing is handled by the machine's memory. When configuring the cluster, storeMemoryLimit must be set to some factor, though most typically it is most of the available memory (64GB, for example). All data loaded under that limit is kept in memory and flushed to disk as is needed.

If your database begins to grow to a larger dataset than your previously set parameter storeMemoryLimit, GridDB will overflow data not likely to be used soon onto the disk. That disk can be either an SSD or an HDD, but SSDs will provide smaller drop-offs in speed should this process need to occur. This method of handling data ensures most transactions occur in-memory to ensure high performance throughout use.
