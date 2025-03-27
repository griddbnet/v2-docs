# FAQ

## GridDB Fundamentals

### What is GridDB?
GridDB is a time series database best suited for Big Data and IoT (Internet of Things). GridDB is designed to handle time-sensitive IoT data across numerous sensors while maintaining consistency and durability.
### Compared to other NoSQL databases, what are GridDB’s main advantages?
GridDB has the unique ability to handle IoT (Internet of Things) data thanks to its Key-Container data model.  The time-series container’s functionality in manipulating incoming time-based data from sensors ensure that GridDB will be the most well-equipped NoSQL Database in handling IoT data. GridDB is also blazingly fast.
### What makes GridDB so fast?
GridDB utilizes a “Memory first, Storage second” structure. “Hot” data is kept in-memory, allowing for much faster writes/reads on the most-used data.
### Does GridDB support SQL?
Yes, GridDB supports SQL-92 and TQL, an SQL-like query language.
### Does GridDB support transactions?
Yes, they are supported on a container-basis, meaning GridDB containers are ACID-compliant.
### What is ACID?
GridDB being ACID compliant means that database transactions abide by each of the rules in the acronym:
- Atomicity: all transactions are all or nothing
- Consistency: all data changes must abide by rules set forth by administrator
- Isolation: transactions are committed serially (one after the other)
- Durability: ensures data is always safe by ensuring transactions stay committed.

## Data Model

### What is a Container?
To make things easier to visualize, you can think of Containers as a Relational DB table, complete with columns and rows. GridDB has two differents kinds of Containers: Collection and Time-Series. Collection Containers handles more traditional data (Strings, Booleans, Arrays, etc), whereas Time-Series Containers are equipped to handle time-stamp data. Since these Containers function like tables, each Container has its own schema.
### What is a Row?
Similar to the RDB data model, a Row a flat piece of data which abides by the schema set in place by the container. A Row can have a key, but it is not mandatory.

## Network

### Does GridDB work on public cloud environment?
Yes.

## Memory and Storage

### Can I mix different nodes in GridDB cluster?
GridDB OSS v4.5 supports single-node setup only.

## Others

### GridDB Licensing
The server source license is GNU Affero General Public License (AGPL), while the Java client library license and the operational commands is Apache License, version 2.0. 

### There is something not in the FAQ that I need to ask.
You can ask your questions on [Stackoverflow](https://stackoverflow.com/questions/tagged/griddb). One of our engineers will gladly answer