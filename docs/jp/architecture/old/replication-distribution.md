# Replication & Distribution

Data replicas are created on a partition basis in accordance with the number of replications set by the user. A process can be continued non-stop even when a node failure occurs by maintaining replicas of the data among scattered nodes. In the client API, when a node failure is detected, the client automatically switches access to another node where the replica is maintained.

The default number of replications is 2, allowing data to be replicated twice when operating in a cluster configuration with multiple nodes. When there is an update in a container, the owner node (the node having the master replica) among the replicated partitions is updated.

There are 2 ways of subsequently reflecting the updated details from the owner node in the backup node.

*   Replication is carried out without synchronizing with the timing of the non-synchronous replication update process. Update performance is better for quasi-synchronous replication but the availability is worse.
*   Although replication is carried out synchronously at the quasi-synchronous replication update process timing, no appointment is made at the end of the replication. Availability is excellent but performance is inferior.

If performance is more important than availability, set the mode to non-synchronous replication and if availability is more important, set it to quasi-synchronous replication.

**\[Memo\]**

The number of replications is set in the cluster definition file (gs_cluster.json) /cluster/replicationNum.  
Synchronous settings of the replication are set in the cluster definition file (gs_cluster.json) /transaction/replicationMode.
