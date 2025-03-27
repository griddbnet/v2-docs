# Structure of GridDB

Describes the cluster operating structure in GridDB.
Note that **GridDB Community Edition operates on a single node configuration, and does not support multiple nodes cluster configuration**.


## Composition of a cluster

GridDB is operated by clusters which are composed of multiple nodes. Before accessing the database from an application system, nodes must be started and the cluster must be constituted, that is, cluster service is executed.

A cluster is formed and cluster service is started when a number of nodes specified by the user joins the cluster. Cluster service will not be started and access from the application will not be possible until all nodes constituting a cluster have joined the cluster.

A cluster needs to be constituted even when operating GridDB with a single node. In this case, the number of nodes constituting a cluster is 1. A composition that operates a single node is known as a single composition.

![Cluster name and number of nodes constituting a cluster](/img/arc_clusterNameCount.png)




A cluster name is used to distinguish a cluster from other clusters so as to compose a cluster using the right nodes selected from multiple GridDB nodes on a network. Using cluster names, multiple GridDB clusters can be composed in the same network. 
A cluster is composed of nodes with the following features in common: cluster name, the number of nodes constituting a cluster, and the connection method setting. A cluster name needs to be set in the cluster definition file for each node constituting a cluster, and needs to be specified as a parameter when composing a cluster as well.

The method of constituting a cluster using multicast is called multicast method. See [Cluster configuration methods](#cluster_configuration_methods) for details.

The operation of a cluster composition is shown below.

![Operation of a cluster composition](/img/arc_clusterConfigration.png)



To start up a node and compose a cluster, the [operation commands](operating-function/#operating-commands) gs\_startnode/gs\_joincluster command are used. In addition, there is a service control function to start up the nodes at the same time as the OS and to compose the cluster.


To compose a cluster, the number of nodes joining a cluster (number of nodes constituting a cluster) and the cluster name must be the same for all the nodes joining the cluster.

Even if a node fails and is separated from the cluster after operation in the cluster started, cluster service will continue so long as the majority of the number of nodes is joining the cluster.

Since cluster operation will continue as long as the majority of the number of nodes is in operation. So, a node can be separated from the cluster for maintenance while keeping the cluster in operation. The node can be get back into the cluster via network after the maintenance. Nodes can also be added via network to reinforce the system.

The following two networks can be separated: the network that communicates within the cluster and the network dedicated to client communication. 

### Status of node

Nodes have several types of status that represent their status. The status changes by user command execution or internal processing of the node. The [status of a cluster](#status_of_cluster) is determined by the status of the nodes in a cluster.

This section explains types of node status, status transition, and how to check the node status.

#### Types of node status
    
| Node status | Description                                                                                                                                                                                                                                                                                                                                                                                                     |
-----------|----------------------------------------------|
| STOP        | The GridDB server has not been started in the node.                                                                                                                                                                                                                                                                                                                                                             |
| STARTING    | The GridDB server is starting in the node. Depending on the previous operating state, start-up processes such as recovery processing of the database are carried out. The only possible access from a client is checking the status of the system with a gs\_stat command. Access from the application is not possible.                                                                       |
| STARTED     | The GridDB server has been started in the node. However, access from the application is not possible as the node has not joined the cluster. To obtain the cluster composition, execute a cluster operating command, such as gs\_joincluster to join the node to the cluster.                                                                                                                         |
| WAIT        | The system is waiting for the cluster to be composed. Nodes have been informed to join a cluster but the number of nodes constituting a cluster is insufficient, so the system is waiting for the number of nodes constituting a cluster to be reached. WAIT status also indicates the node status when the number of nodes constituting a cluster drops below the majority and the cluster service is stopped. |
| SERVICING   | A cluster has been constituted and access from the application is possible. However, access may be delayed if synchronization between the clusters of the partition occurs due to a re-start after a failure when the node is stopped or the like.                                                                                                                                                              |
| STOPPING    | Intermediate state in which a node has been instructed to stop but has not stopped yet.                                                                                                                                                                                                                                                                                                                         |
| ABNORMAL    | The state in which an error is detected by the node in SERVICING state or during state transition. A node in the ABNORMAL state will be automatically separated from the cluster. After collecting system operation information, it is necessary to forcibly stop and restart the node in the ABNORMAL state. By re-starting the system, recovery processing will be automatically carried out.                 |
    
#### Transition in the node status
    
![Node status](/img/arc_NodeStatus.png)
    
	
| State transition | State transition event | Description                                                                                                                                                                                                                                             |
| ---------------- | ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| ①                | Command execution      | Start a node by executing the commands such as gs\_startnode command.                                                                                                                                                     |
| ②                | System                 | Status changes automatically at the end of recovery processing or loading of database files.                                                                                                                                                            |
| ③                | Command execution      | Joining a node to a cluster by executing the commands such as gs\_joincluster command, and service start-up.                                                                                                                  |
| ④                | System                 | Status changes automatically when the required number of component nodes join a cluster.                                                                                                                                                                |
| ⑤                | System                 | Status changes automatically when some nodes consisting the cluster are detached from the service due to a failure or by some other reasons, and the number of nodes joining the cluster become less than half of the value set in the definition file. |
| ⑥                | Command execution      | Detaches a node from a cluster by executing the commands such as gs\_leavecluster command.                                                                                                                                                    |
| ⑦                | Command execution      | Detaches a node from a cluster by executing the commands such as gs\_leavecluster/gs\_stopcluster command.                                                                                                                                    |
| ⑧                | Command execution      | Stop a node by executing the commands such as gs\_stopnode command.                                                                                                                                                           |
| ⑨                | System                 | Stops the server process once the final processing ends                                                                                                                                                                                                 |
| ⑩                | System                 | Detached state due to a system failure. In this state, the node needs to be stopped by force once.                                                                                                                                                      |
    
	
##### How to check the node status
    
The node status is determined by the combination of the node status and the node role.
    
The operation status of a node and the role of a node can be checked from the result of the gs\_stat command, which is in json format. That is, for the operation status of a node, check the value of /cluster/nodeStatus, for the role of a node, check /cluster/clusterStatus)
    
The table below shows the node status, determined by the combination of the operation status of a node and the role of a node.
    
| Node status | Operation status of a node<br>(/cluster/nodeStatus)  | Role of a node<br>(/cluster/clusterStatus) |
|------------|------------------------------|------------------------|
| STOP       | －(Connection error of gs_stat)       | －(Connection error of gs_stat)    |
| STARTING   | INACTIVE                     | SUB_CLUSTER            |
| STARTED    | INACTIVE                     | SUB_CLUSTER            |
| WAIT       | ACTIVE                       | SUB_CLUSTER           |
| SERVICING  | ACTIVE                       | MASTER or FOLLOWER   |
| STOPPING   | NORMAL_SHUTDOWN              | SUB_CLUSTER           |
| ABNORMAL   | ABNORMAL                     | SUB_CLUSTER           |
	
#### Operation status of a node
        
The table below shows the operation status of a node. Each state is expressed as the value of /cluster/nodeStatus of the gs\_stat command.
        
| Operation status of a node | Description                          |
| -------------------------- | ------------------------------------ |
| ACTIVE                     | Active state                         |
| ACTIVATING                 | In transition to an active state     |
| INACTIVE                   | Non-active state                     |
| DEACTIVATING               | In transition to a non-active state. |
| NORMAL\_SHUTDOWN           | Under shutdown process               |
| ABNORMAL                   | Abnormal state                       |
        

#### Role of a node
        
The table below shows the role of a node. Each state is expressed as the value of /cluster/clusterStatus of the gs\_stat command.
        
A node has two types of roles: "master" and "follower". To start a cluster, one of the nodes which constitute the cluster needs to be a "master." The master manages the whole cluster. All the nodes other than the master become "followers." A follower performs cluster processes, such as a synchronization, following the directions from the master.
        
| Role of a node           | Description    |
| ------------------------ | -------------- |
| MASTER                   | Master         |
| FOLLOWER                 | Follower       |
| SUB\_CLUSTER/SUB\_MASTER | Role undefined |
        

<a id="status_of_cluster"></a>
### Status of cluster

The cluster operating status is determined by the state of each node, and the status may be one of 3 states - IN OPERATION/INTERRUPTED/STOPPED.

During the initial system construction, cluster service starts after all the nodes, the number of which was specified by the user as the number of nodes constituting a cluster, have joined the cluster.

During initial cluster construction, the state in which the cluster is waiting to be composed when all the nodes that make up the cluster have not been incorporated into the cluster is known as \[INIT\_WAIT\]. When the number of nodes constituting a cluster has joined the cluster, the state will automatically change to the operating state.

Operation status includes two states, \[STABLE\] and \[UNSTABLE\].

  - \[STABLE\] state
      - State in which a cluster has been formed by the number of nodes specified in the number of nodes constituting a cluster and service can be provided in a stable manner.
  - \[UNSTABLE\] state
      - A cluster in this state is joined by the nodes less than "the number of the nodes constituting the cluster" but more than half the constituting clusters are in operation.
      - Cluster service will continue for as long as a majority of the number of nodes constituting a cluster is in operation.

A cluster can be operated in an \[UNSTABLE\] state as long as a majority of the nodes are in operation even if some nodes are detached from a cluster due to maintenance and for other reasons.

Cluster service is interrupted automatically in order to avoid a split brain when the number of nodes constituting a cluster is less than half the number of nodes constituting a cluster. The status of the cluster will become \[WAIT\].

  - What is split brain?
    
    A split brain is an action where multiple cluster systems performing the same process provide simultaneous service when a system is divided due to a hardware or network failure in a tightly-coupled system that works like a single server interconnecting multiple nodes. If the operation is continued in this state, data saved as replicas in multiple clusters will be treated as master data, causing data inconsistency.

To resume the cluster service from a \[WAIT\] state, add the node, which recovered from the abnormal state, or add a new node, by using a node addition operation. After the cluster is joined by all the nodes, the number of which is the same as the one specified in "the number of nodes constituting a cluster", the status will be \[STABLE\], and the service will be resumed.

Even when the cluster service is disrupted, since the number of nodes constituting a cluster becomes less than half due to failures in the nodes constituting the cluster, the cluster service will be automatically restarted once a majority of the nodes joine the cluster by adding new nodes and/or the nodes restored from the errors to the cluster.

![Cluster status](/img/arc_clusterStatus.png)


A STABLE state is a state in which the value of the json parameter shown in gs\_stat, /cluster/activeCount, is equal to the value of /cluster/designatedCount.

```
$ gs_stat -u admin/admin
{
    "checkpoint": {
        "archiveLog": 0,
　　　　　：
　　　　　：
    },
    "cluster": {
        "activeCount":4,　　　　　　　　　　　 // Nodes in operation within the cluster
        "clusterName": "test-cluster",
        "clusterStatus": "MASTER",
        "designatedCount": 4,                  // Number of nodes constituting a cluster
        "loadBalancer": "ACTIVE",
        "master": {
            "address": "192.168.0.1",
            "port": 10040
        },
        "nodeList": [　　　　　　　　　　　　　// Node list constituting a cluster
            {
                "address": "192.168.0.1",
                "port": 10040
            },
            {
                "address": "192.168.0.2",
                "port": 10040
            },
            {
                "address": "192.168.0.3",
                "port": 10040
            },
            {
                "address": "192.168.0.4",
                "port": 10040
            },

        ],
        ：
        ：
```

### Status of partition

The partition status represents the status of the entire partition in a cluster, showing whether the partitions in an operating cluster are accessible, or the partitions are balanced.


| Partition status | Description |
|--------------|----------------|
| NORMAL       | All the partitions are in normal states where all of them are placed as planned. |
| NOT_BALANCE  | With no replica_loss, no owner_loss but partition placement is unbalanced. |
| REPLICA_LOSS | Replica data is missing in some partitions.<br /> (Availability of the partition is reduced, that is, the node cannot be detached from the cluster.) |
| OWNER_LOSS   | Owner data is missing in some partitions.<br /> (The data of the partition are not accessible.)      |
| INITIAL      | The initial state no partition has joined the cluster |

Partition status can be checked by executing gs\_stat command to a master node. (The state is expressed as the value of /cluster/partitionStatus)

```
$ gs_stat -u admin/admin
{
　　：
　　：
"cluster": {
    ：
    "nodeStatus": "ACTIVE",
    "notificationMode": "MULTICAST",
    "partitionStatus": "NORMAL",
    ：
```

[Notes]
  - The value of /cluster/partitionStatus of the nodes other than a master node may not be correct. Be sure to check the value of a master node.

<a id="cluster_configuration_methods"></a>

## Cluster configuration methods

A cluster consists of one or more nodes connected in a network. Each node maintains a list of the other nodes' addresses for  communication purposes.

GridDB supports 3 cluster configuration methods for configuring the address list. Different cluster configuration methods can be used depending on the environment or use case. Connection method of client or operational tool may also be different depending on the configuration methods.

Three cluster configuration methods are available: Multicast method, Fixed list method and Provider method. Multicast method is recommended.

Fixed list or provider method can be used in the environment where multicast is not supported.

  - Multicast method
      - This method performs node discovery in multi-cast to automatically configure the address list.
  - Fixed list method
      - A fixed address list is saved in the cluster definition file.
  - Provider method
      - Provider method
      - The address provider can be configured as a Web service or as a static content.

The table below compares the three cluster configuration methods.

| Property         | Multicast method (recommended)             | Fixed list method                                 | Provider method          |
|--------------|------------------------------------|-----------------------------------------------|-----------------------|
| Parameters         | - Multicast address and port      | - List of IP address and port of all the node           | - URL of the address provider        |
| Use case   | - When multicast is supported          | - When multicast is not supported<br /> - System scale estimation can be performed accurately | - When multicast is not supported<br /> - System scale estimation can not be performed        |
| Cluster operation | - Perform automatic discovery of nodes at a specified time interval | - Set a common address list for all nodes<br /> - Read that list only once at node startup | - Obtain the address list at a specified time interval from address provider |
| Pros.     | - No need to restart the cluster when adding nodes      | - No mistake of configuration by consistency check of the list | - No need to restart the cluster when adding nodes    |
| Cons.   | - Multicast is required for client connection   | - Need to restart cluster when adding nodes<br /> - Need to update the connection setting of the client | - Need to ensure the availability of the address provider     |


### Setting up cluster configuration files

Fixed list method or provider method can be used in the environment where multicast is not supported. Network setting of fixed list method and provider method is as follows.

#### FIXED\_LIST: fixed list method

When a fixed address list is given to start a node, the list is used to compose the cluster.

When composing a cluster using the fixed list method, configure the parameters in the cluster definition file.

**cluster definition file**

| Property                    | JSON Data type | Description                                                                                    |
| --------------------------- | -------------- | ---------------------------------------------------------------------------------------------- |
| /cluster/notificationMember | string         | Specify the address list when using the fixed list method as the cluster configuration method. |

A configuration example of a cluster definition file is shown below.

```
{
                             :
                             :
    "cluster":{
        "clusterName":"yourClusterName",
        "replicationNum":2,
        "heartbeatInterval":"5s",
        "loadbalanceCheckInterval":"180s",
        "notificationMember": [
            {
                "cluster": {"address":"172.17.0.44", "port":10010},
                "sync": {"address":"172.17.0.44", "port":10020},
                "system": {"address":"172.17.0.44", "port":10040},
                "transaction": {"address":"172.17.0.44", "port":10001},
                "sql": {"address":"172.17.0.44", "port":20001}
            },
            {
                "cluster": {"address":"172.17.0.45", "port":10010},
                "sync": {"address":"172.17.0.45", "port":10020},
                "system": {"address":"172.17.0.45", "port":10040},
                "transaction": {"address":"172.17.0.45", "port":10001},
                "sql": {"address":"172.17.0.45", "port":20001}
            },
            {
                "cluster": {"address":"172.17.0.46", "port":10010},
                "sync": {"address":"172.17.0.46", "port":10020},
                "system": {"address":"172.17.0.46", "port":10040},
                "transaction": {"address":"172.17.0.46", "port":10001},
                "sql": {"address":"172.17.0.46", "port":20001}
            }
        ]
    },
                             :
                             :
}
```

#### PROVIDER: provider method

Get the address list supplied by the address provider to perform cluster configuration.

When composing a cluster using the provider method, configure the parameters in the cluster definition file.

**cluster definition file**

| Property                                     | JSON Data type | Description                                                                                                                                |
| -------------------------------------------- | -------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| /cluster/notificationProvider/url            | string         | Specify the URL of the address provider when using the provider method as the cluster configuration method.                                |
| /cluster/notificationProvider/updateInterval | string         | Specify the interval to get the list from the address provider. Specify the value more than 1 second and less than 2<sup>31</sup> seconds. |

A configuration example of a cluster definition file is shown below.

``` sh
{
                             :
                             :
    "cluster":{
        "clusterName":"yourClusterName",
        "replicationNum":2,
        "heartbeatInterval":"5s",
        "loadbalanceCheckInterval":"180s",
        "notificationProvider":{
            "url":"http://example.com/notification/provider",
            "updateInterval":"30s"
        }
    },
                             :
                             :
}
```

The address provider can be configured as a Web service or as a static content. The address provider needs to provide the following specifications.

  - Compatible with the GET method.
  - When accessing the URL, the node address list of the cluster containing the cluster definition file in which the URL is written is returned as a response.
      - Response body: Same JSON as the contents of the node list specified in the fixed list method
      - Response header: Including Content-Type:application/json

An example of a response sent from the address provider is as follows.

```
$ curl http://example.com/notification/provider
[
    {
        "cluster": {"address":"172.17.0.44", "port":10010},
        "sync": {"address":"172.17.0.44", "port":10020},
        "system": {"address":"172.17.0.44", "port":10040},
        "transaction": {"address":"172.17.0.44", "port":10001},
        "sql": {"address":"172.17.0.44", "port":20001}
    },
    {
        "cluster": {"address":"172.17.0.45", "port":10010},
        "sync": {"address":"172.17.0.45", "port":10020},
        "system": {"address":"172.17.0.45", "port":10040},
        "transaction": {"address":"172.17.0.45", "port":10001},
        "sql": {"address":"172.17.0.45", "port":20001}
    },
    {
        "cluster": {"address":"172.17.0.46", "port":10010},
        "sync": {"address":"172.17.0.46", "port":10020},
        "system": {"address":"172.17.0.46", "port":10040},
        "transaction": {"address":"172.17.0.46", "port":10001},
        "sql": {"address":"172.17.0.46", "port":20001}
    }
]
```

\[Note\]
  - Specify the serviceAddress and servicePort of the node definition file in each module (cluster,sync etc.) for each address and port.
  - The items related to sql are required only for GridDB Advanced  Edition.
  - Set either the /cluster/notificationAddress, /cluster/notificationMember, /cluster/notificationProvider in the cluster definition file to match the cluster configuration method used.