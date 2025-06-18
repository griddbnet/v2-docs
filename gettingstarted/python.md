# Python


## Install Latest (Java API Based)

The GridDB Python client now uses the native interface (Java) as its underlying API to make GridDB function calls; installation of this new connector no longer relies on the c_client, but instead uses the already installed Java. Let's install the new client!

### Java & CLASSPATH

To get this to work, let's first make sure Java is installed and the JAVA_HOME environment variable is set. Here's how it may work  on some machines as an example (Ubuntu 22.04): 

```bash
$ sudo apt install default-jdk
$ export JAVA_HOME=/usr/lib/jvm/java-11-openjdk-amd64
```

### Downloading & Installing

Now let's clone the repo and install: 

```bash
$ git clone https://github.com/griddb/python_client.git
$ cd python_client/java
$ mvn install
$ cd ..
$ cd python
$ python3.12 -m pip install .
$ cd ..
```

### Running Samples

To run sample1.py


```bash
$ cd sample
$ curl -L -o gridstore.jar https://repo1.maven.org/maven2/com/github/griddb/gridstore/5.8.0/gridstore-5.8.0.jar
$ curl -L -o arrow-memory-netty.jar https://repo1.maven.org/maven2/org/apache/arrow/arrow-memory-netty/18.3.0/arrow-memory-netty-18.3.0.jar
$ cp ../java/target/gridstore-arrow-5.8.0.jar gridstore-arrow.jar
$ export CLASSPATH=$CLASSPATH:./gridstore.jar:./gridstore-arrow.jar:./arrow-memory-netty.jar
```

Slight editing of the sample files is also required to work with GridDB CE.

And then edit the top of your sample files: 

```python
import jpype
                                                                    # Added this arrow-memory-netty jar
jpype.startJVM(classpath=["./gridstore.jar", "./gridstore-arrow.jar", "./arrow-memory-netty.jar"])
import griddb_python as griddb
import sys

factory = griddb.StoreFactory.get_instance()

argv = sys.argv

blob = bytearray([65, 66, 67, 68, 69, 70, 71, 72, 73, 74])
update = True

try:
	#Get GridStore object
    # Changed here to notification_member vs port & address
	gridstore = factory.get_store(notification_member=argv[1], cluster_name=argv[2], username=argv[3], password=argv[4])
```

And then finally run: 

```bash
$ python3.12 sample1.py 127.0.0.1:10001 myCluster admin admin

Person: name=name02 status=False count=2 lob=[65, 66, 67, 68, 69, 70, 71, 72, 73, 74]
```

## Installation (v0.8.5) C_Client Based

The old c_client version doesn't rely on java or its jvm but instead on the c_client which you need to install. We will go over installing ther Python Client from its `.whl` file 

### Prereqs

To install this version of the Python client, it is required to first install the GridDB c_client. To do so, simply install the griddb-meta package from apt/yum and it will automatically be included. 

You can also install the c_client manually through Github as well: [https://github.com/griddb/c_client](https://github.com/griddb/c_client)

### Wheel File

The easiest way to install the GridDB Python client is to download the latest `.whl` release file from GitHub and install via pip. As of right now, the latest `.whl` file (v0.8.5) requires python3.10.

First, navigate to the releases page: [https://github.com/griddb/python_client/releases](https://github.com/griddb/python_client/releases), download the latest, and install. 


```bash
$ wget https://github.com/griddb/python_client/releases/download/0.8.5/griddb_python-0.8.5-cp310-cp310-manylinux1_x86_64.whl
$ python3.10 -m pip install griddb_python-0.8.5-cp310-cp310-manylinux1_x86_64.whl

Processing ./griddb_python-0.8.5-cp310-cp310-manylinux1_x86_64.whl
Installing collected packages: griddb-python
Successfully installed griddb-python-0.8.5
```


#### Using a Different Python Version (for the python client v0.8.5)


If, for example, you would like to use python3.12 instead of 3.10 you can simply edit the file name to update the `cp3` file parameter. For example: 

```bash
$ python3 --version
Python 3.12.11

$ mv griddb_python-0.8.5-cp310-cp310-manylinux1_x86_64.whl griddb_python-0.8.5-cp312-cp312-manylinux1_x86_64.whl 

$ python3 -m pip install griddb_python-0.8.5-cp312-cp312-manylinux1_x86_64.whl 
Defaulting to user installation because normal site-packages is not writeable
Processing ./griddb_python-0.8.5-cp312-cp312-manylinux1_x86_64.whl
Installing collected packages: griddb-python
Successfully installed griddb-python-0.8.5
```

# Simulating an IoT Dataset

For this section, we will walk through a Python script which has the end goal of showcasing how to use Python with GridDB; it will also have the added benefit of teaching developers how to make a mock Internet of Things (IoT) dataset.

For this generated-dataset, we will be using `TIMESERIES` containers as they are most-often used when making an IoT dataset. 

## Using Python 

To use GridDB with Python, you will need to download the [GridDB c_client](https://github.com/griddb/c_client) from GitHub. Once that's done, you will also need the [Python Client](https://github.com/griddb/python_client). Alternatively, you can simply install via `pip` from [here](https://pypi.org/project/griddb-python/)

### Getting our GridDB Connection and Schema

First let's grab our GridDB connection settings and gridstore obj. Here we will be using default values for all parameters. If you followed along with the official GridDB documentation, this should also work for your database directly. 

Before that, let's also import our GridDB Connector and set some variables.

```python
import griddb_python
griddb = griddb_python
factory = griddb.StoreFactory.get_instance()

store = factory.get_store(
    host="239.0.0.1",
    port=31999,
    cluster_name="defaultCluster",
    username="admin",
    password="admin"
)
```

Once the store variable has accurate connection settings for the currently running GridDB server, that variable can now directly run Gridstore functions. 

Next let's look at the schema. For IoT data, we generally have many sensors outputting just one or two data points that may be of interest to the project. For this case, we will simulate just a sensor temperature and an arbitrary 'data' point, of which both will be floats. 

```python
    for i in range(numSensors):
        conInfo = griddb.ContainerInfo("sensor_" + str(i),
					[["timestamp", griddb.Type.TIMESTAMP],
		            ["data", griddb.Type.FLOAT],
                    ["temperature", griddb.Type.FLOAT]],
		            griddb.ContainerType.TIME_SERIES, True)
        
        col = store.put_container(conInfo)
```

In the above, we are looping through the user-selected variable `numSensors` to `put` that amount of sensors into the fake dataset. If using the script unchanged, it will insert 5 different sensors.

## Simulating Data

First, to start: this is how to actually use this script. When you want to simulate a dataset, you can simply run the entire script like so: 

```bash
$ python3 generate_data.py 24 5
```

The first number is number of hours to simulate, while the second one is increments (in minutes). So this script will generate a dataset into your GridDB server over the timespan of `now` through 24 hours from `now`, with data emitting every 5 minutes from N sensors.

### Generating Random Data Points

The first thing to do when running the script is to set your parameters. In this case, we simply edit the `numSensors` var to be set to the number of sensors they would like to 'emit' data per incremented time span. As a default, it is set to 5: `numSensors = 5`.

From there, we simply convert the user's command line arguments into `ints` to work with our script

```python
numSensors = 5
hours = int(argv[1])
minutes = int(argv[2])
```

Next we convert our user-set parameters to a uniform unit (milliseconds). From there, we take our values and figure out how many total emits our generated data will create (the `arrLen` variable)

```python
    duration = hours * 3600000
    increment = minutes * 60000

    arrLen = ( int(duration) / int(increment) ) * numSensors
```

From there it's simply a matter of using some `for loops` to create different numbers/floats for each desired timestamp and to store that in an object which is eventually returned by the function.

```python
containerEntry = {}
    collectionListRows = []
    for i in range(int(arrLen)):
        for j in range(numSensors):
            addedTime = i * minutes
			
            incTime = now + timedelta(minutes=addedTime)

            randData =  random.uniform(0,10000)
            randTemp = random.uniform(0,100)
            print("Data being inserted: " + str(j) + " " + str(incTime) + " " + str(randData) + "  " + str(randTemp))
            collectionListRows.append([incTime, randData, randTemp])
            containerEntry.update({"sensor_" + str(j): collectionListRows})
    store.multi_put(containerEntry)
```

This portion of the script will create random scripts from the python random library. It will also add time every loop iteration from `now` to simulate a real IoT dataset.

The last line of this portion is the GridDB `multiPut`. You can learn more about that [here](https://griddb.net/en/blog/griddb-optimization-with-multi-put-and-query/).

## Querying

To run some basic queries, let's use the [GridDB Shell](https://docs.griddb.net/gettingstarted/go/), which came to GridDB with version 4.6. To start, let's drop into the shell and do a basic check to make sure our data is there:

```bash
gs> load default.gsh

gs> connect $defaultCluster
The connection attempt was successful(NoSQL).
The connection attempt was successful(NewSQL).

gs[public]> sql select * from testing_0;
31,149 results. (26 ms)

gs[public]> get 10
timestamp,data,temperature
2021-07-28T21:01:00.282Z,72.40626,101.7
2021-07-28T21:07:43.152Z,33.06072,47.99
2021-07-28T21:09:52.166Z,8.167625,26.82
2021-07-28T21:49:33.682Z,80.57002,3.53
2021-07-28T21:54:38.294Z,28.507494,63.16
2021-07-28T21:55:24.377Z,18.945627,51.04
2021-07-28T21:56:09.467Z,13.514397,99.64
2021-07-28T21:58:40.906Z,88.73552,101.73
2021-07-28T21:58:55.059Z,43.575638,28.93
2021-07-28T21:59:42.647Z,38.931076,40.61
The 10 results had been acquired.
```
Great. Looks like our first sensor had 31k rows inserted.

Next let's try a time query. We can query all results from a range of 6 hours ago until now:

```python
gs[public]> tql testing_0 select * where timestamp > TIMESTAMPADD(HOUR, NOW(), -6);
20,810 results. (3 ms)

gs[public]> get 3
timestamp,data,temperature
2021-08-04T16:28:34.566Z,7.682323,70.7
2021-08-04T16:29:28.943Z,22.910458,33.14
2021-08-04T16:30:34.566Z,89.90703,101.03
The 3 results had been acquired.
```

## Conclusion
With that, you can now generate as much IoT data as needed for your proof of concepts.

The complete source code can be downloaded from the [GridDB.net GitHub](https://github.com/griddbnet/tutorials).
