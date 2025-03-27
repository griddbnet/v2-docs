# GridDBを使用したデータモデリング

GridDB is a unique Key-Container data model that resembles Key-Value. It has the following features.

*   A concept resembling a RDB table that is a container for grouping Key-Value.
*   A schema to define the data type for the container can be set. An index can be set in a column.
*   Transactions can be carried out on a row basis within the container. In addition, ACID is guaranteed on a container basis.

GridDB manages data on a block, container, partition, and partition group basis.

*   Block  
    A block is a data unit for data persistence processing in a disk (hereinafter known as a checkpoint) and is the smallest physical data management unit in GridDB. Multiple container data are arranged in a block. Before initial startup of GridDB, a size of either 64 KB or 1 MB can be selected for the block size to be set up in the definition file (cluster definition file). Specify 64 KB if the installed memory of the system is low, or if the frequency of data increase is low.

As a database file is created during initial startup of the system, the block size cannot be changed after initial startup of GridDB.

*   Container  
    A container consists of multiple blocks. A container is a data structure that serves as an interface with the user. There are 2 data types in a container, collection and time series.
*   Table  
    A table is a special container form that exists only in NewSQL products and SQL can be operated as an interface in NewSQL. Before registering data in an application, there is a need to make sure that a container or table is created beforehand. Data is registered in a container or table.
*   Row  
    A row refers to a line of data to be registered in a container or table. Multiple rows can be registered in a container or table, but this does not mean that data is arranged in the same block. Depending on the registration and update timing, data is arranged in suitable blocks within partitions. Normally, there are columns with multiple data types in a row.
*   Partition  
    A partition is a data management unit that includes one or more containers or tables.

*   Partition Group  
    A group of multiple partitions is known as a partition group.

A partition is a data arrangement unit between clusters for managing the data movement to adjust the load balance between nodes and data multiplexing (replica) in case of a failure. Data replica is arranged in a node to compose a cluster on a partition basis. A node that can be updated against a container inside a partition is known as an owner node and 1 node is allocated to each partition. A node that maintains replicas other than owner nodes is a backup node. Master data and multiple backup data exist in a partition, depending on the number of replicas set.

Data maintained by a partition group is saved in an OS disk as a physical database file. A partition group is created with a number that depends on the degree of parallelism of the database processing threads executed by the node.
