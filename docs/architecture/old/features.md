# Structure of GridDB

Describes the cluster operating structure in
GridDB.

## <span class="header-section-number">4.1</span> Composition of a cluster

GridDB is operated by clusters which are composed of multiple nodes.
Before accessing the database from an application system, nodes must be
started and the cluster must be constituted, that is, cluster service is
executed.

A cluster is formed and cluster service is started when a number of
nodes specified by the user joins the cluster. Cluster service will not
be started and access from the application will not be possible until
all nodes constituting a cluster have joined the cluster.

A cluster needs to be constituted even when operating GridDB with a
single node. In this case, the number of nodes constituting a cluster is
1. A composition that operates a single node is known as a single
composition.

![Cluster name and number of nodes constituting a
cluster](img/arc_clusterNameCount.png)

A cluster name is used to distinguish a cluster from other clusters so
as to compose a cluster using the right nodes selected from multiple
GridDB nodes on a network. Using cluster names, multiple GridDB clusters
can be composed in the same network. A cluster is composed of nodes with
the following features in common: cluster name, the number of nodes
constituting a cluster, and the connection method setting. A cluster
name needs to be set in the cluster definition file for each node
constituting a cluster, and needs to be specified as a parameter when
composing a cluster as well.

The method of constituting a cluster using multicast is called multicast
method. See [Cluster configuration
methods](#cluster_configuration_methods) for details.

The operation of a cluster composition is shown below.

![Operation of a cluster composition](img/arc_clusterConfigration.png)

To start up a node and compose a cluster, the [operation
commands](#operating_commands) gs\_startnode/gs\_joincluster command are used. In addition, there is a service control
function to start up the nodes at the same time as the OS and to compose
the cluster.

To compose a cluster, the number of nodes joining a cluster (number of
nodes constituting a cluster) and the cluster name must be the same for
all the nodes joining the cluster.

Even if a node fails and is separated from the cluster after operation
in the cluster started, cluster service will continue so long as the
majority of the number of nodes is joining the cluster.

Since cluster operation will continue as long as the majority of the
number of nodes is in operation. So, a node can be separated from the
cluster for maintenance while keeping the cluster in operation. The node
can be get back into the cluster via network after the maintenance.
Nodes can also be added via network to reinforce the system.

The following two networks can be separated: the network that
communicates within the cluster and the network dedicated to client
communication. 

### <span class="header-section-number">4.1.1</span> Status of node

Nodes have several types of status that represent their status. The
status changes by user command execution or internal processing of the
node. The [status of a cluster](#status_of_cluster) is determined by the
status of the nodes in a cluster.

This section explains types of node status, status transition, and how
to check the node status.

  - Types of node
    status
    
    | Node status | Description                                                                                                                                                                                                                                                                                                                                                                                                     |
    | ----------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
    | STOP        | The GridDB server has not been started in the node.                                                                                                                                                                                                                                                                                                                                                             |
    | STARTING    | The GridDB server is starting in the node. Depending on the previous operating state, start-up processes such as recovery processing of the database are carried out. The only possible access from a client is checking the status of the system with a gs\_stat command. Access from the application is not possible.                                                                       |
    | STARTED     | The GridDB server has been started in the node. However, access from the application is not possible as the node has not joined the cluster. To obtain the cluster composition, execute a cluster operating command, such as gs\_joincluster to join the node to the cluster.                                                                                                                         |
    | WAIT        | The system is waiting for the cluster to be composed. Nodes have been informed to join a cluster but the number of nodes constituting a cluster is insufficient, so the system is waiting for the number of nodes constituting a cluster to be reached. WAIT status also indicates the node status when the number of nodes constituting a cluster drops below the majority and the cluster service is stopped. |
    | SERVICING   | A cluster has been constituted and access from the application is possible. However, access may be delayed if synchronization between the clusters of the partition occurs due to a re-start after a failure when the node is stopped or the like.                                                                                                                                                              |
    | STOPPING    | Intermediate state in which a node has been instructed to stop but has not stopped yet.                                                                                                                                                                                                                                                                                                                         |
    | ABNORMAL    | The state in which an error is detected by the node in SERVICING state or during state transition. A node in the ABNORMAL state will be automatically separated from the cluster. After collecting system operation information, it is necessary to forcibly stop and restart the node in the ABNORMAL state. By re-starting the system, recovery processing will be automatically carried out.                 |
    

  - Transition in the node status
    
    ![Node
    status](img/arc_NodeStatus.png)
    
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
    

  - How to check the node status
    
    The node status is determined by the combination of the node status
    and the node role.
    
    The operation status of a node and the role of a node can be checked
    from the result of the gs\_stat command, which is in json format.
    That is, for the operation status of a node, check the value of
    /cluster/nodeStatus, for the role of a node, check
    /cluster/clusterStatus)
    
    The table below shows the node status, determined by the combination
    of the operation status of a node and the role of a node.
    
    <table>
    <thead>
    <tr class="header">
    <th>Node status</th>
    <th>Operation status of a node<br />
    (/cluster/nodeStatus)</th>
    <th>Role of a node<br />
    (/cluster/clusterStatus)</th>
    </tr>
    </thead>
    <tbody>
    <tr class="odd">
    <td>STOP</td>
    <td>- (Connection error of gs_stat)</td>
    <td>- (Connection error of gs_stat)</td>
    </tr>
    <tr class="even">
    <td>STARTING</td>
    <td>INACTIVE</td>
    <td>SUB_CLUSTER</td>
    </tr>
    <tr class="odd">
    <td>STARTED</td>
    <td>INACTIVE</td>
    <td>SUB_CLUSTER</td>
    </tr>
    <tr class="even">
    <td>WAIT</td>
    <td>ACTIVE</td>
    <td>SUB_CLUSTER</td>
    </tr>
    <tr class="odd">
    <td>SERVICING</td>
    <td>ACTIVE</td>
    <td>MASTER or FOLLOWER</td>
    </tr>
    <tr class="even">
    <td>STOPPING</td>
    <td>NORMAL_SHUTDOWN</td>
    <td>SUB_CLUSTER</td>
    </tr>
    <tr class="odd">
    <td>ABNORMAL</td>
    <td>ABNORMAL</td>
    <td>SUB_CLUSTER</td>
    </tr>
    </tbody>
    </table>
    
      - Operation status of a node
        
        The table below shows the operation status of a node. Each state
        is expressed as the value of /cluster/nodeStatus of the gs\_stat
        command.
        
        | Operation status of a node | Description                          |
        | -------------------------- | ------------------------------------ |
        | ACTIVE                     | Active state                         |
        | ACTIVATING                 | In transition to an active state     |
        | INACTIVE                   | Non-active state                     |
        | DEACTIVATING               | In transition to a non-active state. |
        | NORMAL\_SHUTDOWN           | Under shutdown process               |
        | ABNORMAL                   | Abnormal state                       |
        

      - Role of a node
        
        The table below shows the role of a node. Each state is
        expressed as the value of /cluster/clusterStatus of the gs\_stat
        command.
        
        A node has two types of roles: "master" and "follower". To start
        a cluster, one of the nodes which constitute the cluster needs
        to be a "master." The master manages the whole cluster. All the
        nodes other than the master become "followers." A follower
        performs cluster processes, such as a synchronization, following
        the directions from the master.
        
        | Role of a node           | Description    |
        | ------------------------ | -------------- |
        | MASTER                   | Master         |
        | FOLLOWER                 | Follower       |
        | SUB\_CLUSTER/SUB\_MASTER | Role undefined |
        

<span id="status_of_cluster"></span>

### <span class="header-section-number">4.1.2</span> Status of cluster

The cluster operating status is determined by the state of each node,
and the status may be one of 3 states - IN
OPERATION/INTERRUPTED/STOPPED.

During the initial system construction, cluster service starts after all
the nodes, the number of which was specified by the user as the number
of nodes constituting a cluster, have joined the cluster.

During initial cluster construction, the state in which the cluster is
waiting to be composed when all the nodes that make up the cluster have
not been incorporated into the cluster is known as \[INIT\_WAIT\]. When
the number of nodes constituting a cluster has joined the cluster, the
state will automatically change to the operating state.

Operation status includes two states, \[STABLE\] and \[UNSTABLE\].

  - \[STABLE\] state
      - State in which a cluster has been formed by the number of nodes
        specified in the number of nodes constituting a cluster and
        service can be provided in a stable manner.
  - \[UNSTABLE\] state
      - A cluster in this state is joined by the nodes less than "the
        number of the nodes constituting the cluster" but more than half
        the constituting clusters are in operation.
      - Cluster service will continue for as long as a majority of the
        number of nodes constituting a cluster is in operation.

A cluster can be operated in an \[UNSTABLE\] state as long as a majority
of the nodes are in operation even if some nodes are detached from a
cluster due to maintenance and for other reasons.

Cluster service is interrupted automatically in order to avoid a split
brain when the number of nodes constituting a cluster is less than half
the number of nodes constituting a cluster. The status of the cluster
will become \[WAIT\].

  - What is split brain?
    
    A split brain is an action where multiple cluster systems performing
    the same process provide simultaneous service when a system is
    divided due to a hardware or network failure in a tightly-coupled
    system that works like a single server interconnecting multiple
    nodes. If the operation is continued in this state, data saved as
    replicas in multiple clusters will be treated as master data,
    causing data inconsistency.

To resume the cluster service from a \[WAIT\] state, add the node, which
recovered from the abnormal state, or add a new node, by using a node
addition operation. After the cluster is joined by all the nodes, the
number of which is the same as the one specified in "the number of nodes
constituting a cluster", the status will be \[STABLE\], and the service
will be resumed.

Even when the cluster service is disrupted, since the number of nodes
constituting a cluster becomes less than half due to failures in the
nodes constituting the cluster, the cluster service will be
automatically restarted once a majority of the nodes joine the cluster
by adding new nodes and/or the nodes restored from the errors to the
cluster.

![Cluster status](img/arc_clusterStatus.png)

A STABLE state is a state in which the value of the json parameter shown
in gs\_stat, /cluster/activeCount, is equal to the value of
/cluster/designatedCount.

``` sh
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

### <span class="header-section-number">4.1.3</span> Status of partition

The partition status represents the status of the entire partition in a
cluster, showing whether the partitions in an operating cluster are
accessible, or the partitions are balanced.

<table>
<thead>
<tr class="header">
<th>Partition status</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td>NORMAL</td>
<td>All the partitions are in normal states where all of them are placed as planned.</td>
</tr>
<tr class="even">
<td>NOT_BALANCE</td>
<td>With no replica_loss, no owner_loss but partition placement is unbalanced.</td>
</tr>
<tr class="odd">
<td>REPLICA_LOSS</td>
<td>Replica data is missing in some partitions.<br />
(Availability of the partition is reduced, that is, the node cannot be detached from the cluster.)</td>
</tr>
<tr class="even">
<td>OWNER_LOSS</td>
<td>Owner data is missing in some partitions.<br />
(The data of the partition are not accessible.)</td>
</tr>
<tr class="odd">
<td>INITIAL</td>
<td>The initial state no partition has joined the cluster</td>
</tr>
</tbody>
</table>

Partition status can be checked by executing gs\_stat command to a
master node. (The state is expressed as the value of
/cluster/partitionStatus)

``` sh
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

\[Notes\]

  - The value of /cluster/partitionStatus of the nodes other than a
    master node may not be correct. Be sure to check the value of a
    master
node.

<span id="cluster_configuration_methods"></span>

## <span class="header-section-number">4.2</span> Cluster configuration methods

A cluster consists of one or more nodes connected in a network. Each
node maintains a list of the other nodes' addresses for communication
purposes.

GridDB supports 3 cluster configuration methods for configuring the
address list. Different cluster configuration methods can be used
depending on the environment or use case. Connection method of client or
operational tool may also be different depending on the configuration
methods.

Three cluster configuration methods are available: Multicast method,
Fixed list method and Provider method. Multicast method is recommended.

Fixed list or provider method can be used in the environment where
multicast is not supported.

  - Multicast method
      - This method performs node discovery in multi-cast to
        automatically configure the address list.
  - Fixed list method
      - A fixed address list is saved in the cluster definition file.
  - Provider method
      - Provider method
      - The address provider can be configured as a Web service or as a
        static content.

The table below compares the three cluster configuration methods.

<table>
<thead>
<tr class="header">
<th>Property</th>
<th>Multicast method (recommended)</th>
<th>Fixed list method</th>
<th>Provider method</th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td>Parameters</td>
<td>- Multicast address and port</td>
<td>- List of IP address and port of all the node</td>
<td>- URL of the address provider</td>
</tr>
<tr class="even">
<td>Use case</td>
<td>- When multicast is supported</td>
<td>- When multicast is not supported<br />
- System scale estimation can be performed accurately</td>
<td>- When multicast is not supported<br />
- System scale estimation can not be performed</td>
</tr>
<tr class="odd">
<td>Cluster operation</td>
<td>- Perform automatic discovery of nodes at a specified time interval</td>
<td>- Set a common address list for all nodes<br />
- Read that list only once at node startup</td>
<td>- Obtain the address list at a specified time interval from address provider</td>
</tr>
<tr class="even">
<td>Pros.</td>
<td>- No need to restart the cluster when adding nodes</td>
<td>- No mistake of configuration by consistency check of the list</td>
<td>- No need to restart the cluster when adding nodes</td>
</tr>
<tr class="odd">
<td>Cons.</td>
<td>- Multicast is required for client connection</td>
<td>- Need to restart cluster when adding nodes<br />
- Need to update the connection setting of the client</td>
<td>- Need to ensure the availability of the address provider</td>
</tr>
</tbody>
</table>

### <span class="header-section-number">4.2.1</span> Setting up cluster configuration files

Fixed list method or provider method can be used in the environment
where multicast is not supported. Network setting of fixed list method
and provider method is as
follows.

#### <span class="header-section-number">4.2.1.1</span> FIXED\_LIST: fixed list method

When a fixed address list is given to start a node, the list is used to
compose the cluster.

When composing a cluster using the fixed list method, configure the
parameters in the cluster definition file.

**cluster definition
file**

| Property                    | JSON Data type | Description                                                                                    |
| --------------------------- | -------------- | ---------------------------------------------------------------------------------------------- |
| /cluster/notificationMember | string         | Specify the address list when using the fixed list method as the cluster configuration method. |

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

#### <span class="header-section-number">4.2.1.2</span> PROVIDER: provider method

Get the address list supplied by the address provider to perform cluster
configuration.

When composing a cluster using the provider method, configure the
parameters in the cluster definition file.

**cluster definition
file**

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

The address provider can be configured as a Web service or as a static
content. The address provider needs to provide the following
specifications.

  - Compatible with the GET method.
  - When accessing the URL, the node address list of the cluster
    containing the cluster definition file in which the URL is written
    is returned as a response.
      - Response body: Same JSON as the contents of the node list
        specified in the fixed list method
      - Response header: Including Content-Type:application/json

An example of a response sent from the address provider is as follows.

``` sh
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

  - Specify the serviceAddress and servicePort of the node definition
    file in each module (cluster,sync etc.) for each address and port.
  - The items related to sql are required only for GridDB Advanced
    Edition.
  - Set either the /cluster/notificationAddress,
    /cluster/notificationMember, /cluster/notificationProvider in the
    cluster definition file to match the cluster configuration method
    used.

