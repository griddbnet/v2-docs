# Installation - Docker

## GridDB Server Container

To run GridDB server, you can simply pull from Dockerhub

```bash
$ docker network create griddb-net
$ docker pull griddb/griddb
```

We first create a Docker network to allow our application container to easily communicate with our GridDB container.

Now run your GridDB server: 

```bash
$  docker run --name griddb-server \
    --network griddb-net \
    -e GRIDDB_CLUSTER_NAME=myCluster \
    -e GRIDDB_PASSWORD=admin \
    -e NOTIFICATION_MEMBER=1 \
    -d -t
    griddb/griddb
```

The various options can be found on the official Dockerhub page for GridDB: [https://hub.docker.com/r/griddb/griddb](https://hub.docker.com/r/griddb/griddb).

Here, we are setting the cluster name to match what the application containers below expect (`myCluster`) and setting the notification member to 1, meaning GridDB will be running in FIXED_LIST mode, which the projects below also expect. Additionally, these are the default options when running GridDB on bare metal, so it will be a similar configuration if you're used to running that way.

## JDBC Sample Application Container

Once you have your GridDB Server container running and set to using the `griddb-net` docker network, now we can run application containers with GridDB as the DB. First, let's run the JDBC container (as seen here: [https://hub.docker.com/r/griddb/jdbc](https://hub.docker.com/r/griddb/jdbc)).


```bash 
docker pull griddb/jdbc
```

```bash
docker run --name griddb-jdbc \
    --network griddb-net \
    -e GRIDDB_CLUSTER_NAME=myCluster \
    -e GRIDDB_USERNAME=admin \
    -e GRIDDB_PASSWORD=admin \
    -e IP_NOTIFICATION_MEMBER=griddb-server \
    griddb/jdbc

    Run GridDB java client with GridDB server mode Fixed_List : griddb-server:20001 myCluster admin admin
    SQL Create Table name=SampleJDBC_Select
    SQL Insert count=5
    SQL row(id=3, value=test3)
    SQL row(id=4, value=test4)
    success!
```

Specifically, we set the `IP_NOTIFICATION_MEMBER` to point to our GridDB server container hostname (the name we set as the container name). Because they share a network space, it will find the IP Address based on its host name. This is the same principle for all remaining application containers.

## Java Sample Application Container

The explanation given in JDBC holds for this section as well, so here is the command to get that up and running: 

```bash 
docker pull griddb/java-client
```

```bash
docker run --name griddb-java-client \
    --network griddb-net \
    -e GRIDDB_CLUSTER_NAME=myCluster \
    -e GRIDDB_USERNAME=admin \
    -e GRIDDB_PASSWORD=admin \
    -e IP_NOTIFICATION_MEMBER=griddb-server \
    griddb/java-client

Run sample GridDB java client with GridDB server mode Fixed_List : griddb-server:10001 myCluster admin admin
Person:  name=name02 status=false count=2 lob=[65, 66, 67, 68, 69, 70, 71, 72, 73, 74]
```


## Nodejs Application Container

As an example of using GridDB with an application in a docker container, we have prepared here a node.js application container which communicates directly with the griddb-server container.

You can build the image and then run pretty easily: 

```bash
$ docker pull griddbnet/griddb-react-crud
$ docker run --network griddb-net --name griddb-react-crud -p 2828:2828 -d -t griddbnet/griddb-react-crud
```

And now if you navigate to `http://localhost:2828` you will the see full app running.

If you're curious as to how these containers work, you can read this [blog](https://griddb.net/en/blog/improve-your-devops-with-griddb-server-and-client-docker-containers/).

Full information regarding this nodejs application can be found here: [CRUD Operations with the GERN Stack](https://griddb.net/en/blog/crud-gern-stack/)


### Next Steps

Once you have GridDB running on your machine you can verify by running `docker ps`. To dig further, you can run a gs_stat on your running GridDB Server container: 

```bash
$ docker exec -it griddb-server gs_stat -u admin/admin
```

Using the format above, you can run any commands against your GridDB container. If you want to drop into the bash shell of your GridDB container: 

```bash
$ docker exec -it griddb-server /bin/bash
```
