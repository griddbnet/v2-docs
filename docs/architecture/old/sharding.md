# Sharding

System expansion can be carried out online with a scale-out approach. As a result, a system in operation can be supported without having to stop it as it will support the increasing volume of data as the system grows.

In the scale-out approach, data is arranged in an appropriate manner according to the load of the system in the nodes built into the system. As GridDB will optimize the load balance, the application administrator does not need to worry about the data arrangement. Operation is also easy because a structure to automate such operations has been built into the system. Sharding is the process of distributing the data amongst many different nodes. With sharding, the a chunk of data may be split amongst 4 different nodes, with each node containing different parts of the whole.

### 3.9.1 Concept of GridDB Cluster

For scalability, most databases are classified as either of two types of organization:

**Master-slave type:** A cluster which consists of a master node -- which manages the cluster -- and multiple database nodes -- which store data. Since the master node is a single point of failure (SPOF), it is necessary to replicate and make redundant the master node in order to ensure the availability of the cluster. Moreover, when the number of database (DB) nodes increase, there is a possibility that the load of the master node can overload, causing system-wide slow down.

**Peer-to-peer type:** All nodes which constitute the DB cluster are homogeneous and can perform the same functions. Since each node operates according to fragmentary node information -- when compared with a master-slave type -- data reconstruction is hard to optimize. The main issue stemming from this practice is the large overheard between nodes.

GridDB is a hybrid system of master-slave type and a peer-to-peer type. All nodes which constitute the DB cluster are homogeneous with the same functions.

When the DB cluster is constructed, the master node is autonomously determined. The other nodes in the cluster are called 'follower nodes'. If the master node ever gets knocked out or fails, a new master node is determined from the surviving nodes. In order to avoid the split brain problem by network partitioning, the number of nodes which constitutes the DB cluster must be more than a quorum.

A partition is a logical area which stores containers and it is not directly visible to the user. Although multiple partitions are possible, the number of partitions must equal the amount of nodes within the cluster. All containers belong to either of the partition sets using the hash value to a primary key. One owner node plus zero or more backup nodes exist in each partition. There is also a node called the 'catch-up node', which will be promoted to a backup node in the future if needed (this node is essentially the backup to the backup).

The owner node is the node which can update the containers. A backup node is a node which holds the replica of the container and enables only reference opertation to te container. An allocation table of the node to each partition is called a partition table. A master node distributes this partition table to the follower nodes or client libraries. By referring to this partition table, the owner node and backup node belonging to a certain container can be made known.

As mentioned above, the role for any given GridDB node is two-tiered.

1.  master node / follower node
2.  owner node / backup node / catch-up node

### 3.9.2 Determination of a master node

*   Determination procedure of a master node  
    
    In GridDB, a master node is autonomously determined using a bully algorithm. An election message is transmitted and received between nodes. When a certain node receives the message from a node stronger than a self-node, it returns the response -- a follow message that follows the opponent, turning that node into a 'follower node'. Then, the node ends these types of message transmission and reception.
    
    Finally by repeating this procedure, only one node remains undefeated, and the node is determined as the master node. In this algorithm, the number of times this is repeated until a master node is determined is logN, where N is the number of nodes.
    
    The master node collects information on all follower nodes by the 'heartbeat' of a constant cycle. The communication cost of this 'heartbeat' is dependent on the number of follower nodes. Although a heartbeat interval is 5 seconds by default, according to the number of nodes or network traffic, you may adjust accordingly.
    
*   When a master node goes down  
    
    When the master node of the cluster goes down, a new master node is autonomously determined out of the follower nodes which remained. A cluster configuration is reset when the heartbeat to a master node severs follower nodes. Thereafter, a new master node is determined by the procedure described above.
    

### 3.9.3 Determination of partition role

*   Owner node and backup node  
    
    The number of backup nodes on a partition can be specified with a parameter called the number of replicas. When backup nodes exist in a partition, replication of updating data in an owner node is carried out immediately to all backup nodes.
    
    The method of replication can choose either asynchronous mode or semi-synchronous mode. In asynchronous mode, when the contents of updating in an ownder node are transmitted to all backup nodes, update process is completed. In semi-synchronous mode, the contents of updating in an owner node are transmitted to all backup nodes, and after checking the reception response from all backuo nodes, update process is completed. Asynchronus mode is superior in availability.
    
    Since replication is carried out to all backup nodes, the processing cost is proportional to the number of backup nodes. If a performance of update process without a backup node is set to 100, a performance of update process with a backup node in asynchronous mode is about 70, and a performance of update process with a backup node in semi-synchronous mode is about 50.
    
    Failover is performed when a node failure is detected by a heartbeat. When a failure node is an owner node of a partition, a master node determines a new owner node from current backup nodes for the parition table. When a failure node is a backup node, the master node separates the backup node from the parititon table, and continues processing.
    
    The master node newly updates a partition table and distributes it to follower nodes. According to this partition table, synchronus data is transmitted and received between a new owneer node and a new backup node, and it checks that the time stamp of both updating log is in agreement. This processing is called a short-term synchronization.
    
    Since the updating data in the owner node is reflected one by one by replication to the backup node, the data size which should synchonize in a short-term synchonization is slight, and short-term synchonization usually completes in several seconds.
    
*   Determination of catch-up node  
    
    A catch-up node is a node to be promoted to a backup node in the future, and it is set up when as follows.
    
    *   The number of backup nodes is insufficient to the number of replicas.
    *   The owner node and backup node of a partition have deviation between nodes.
    
    A master node determines a catch-up node to resolve the above case. Then, a data image and an updating log are transmitted to the catch-up node from the owner node. By this, the time stamp of the data which the catch-up node has is brought close to the time stamp which the owner node has.
    
    A master node performs a short-term synchronization between the owner node and the catch-up node, when the difference of the time stamp of the owner node and the catch-up node becomes within a steady value.
    
    It takes several hours during the period after starting transmission of data from the owner node to the catch-up node until it is set to the backup node.
