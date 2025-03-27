# Python

<p class="iframe-container">
<iframe width="560" height="315" src="https://www.youtube.com/embed/yWCVfLoV9_0" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
</p>

## Installation
### Install c_client

If you do not want to build from source, you can simply install the client via `pip` from [here](https://pypi.org/project/griddb-python/)

The GridDB c_client (a preqrequisite to using the Python Client) can be found here: [https://github.com/griddb/c_client](https://github.com/griddb/c_client). The RPM is available [here](https://github.com/griddb/c_client/releases). To get started simply `wget` the latest RPM and install.

``` bash
$ wget \
https://github.com/griddb/c_client/releases/download/v4.2.0/griddb_c_client-4.2.0-1.linux.x86_64.rpm
```
then we need to actually install the rpm
``` bash
$ sudo rpm -ivh griddb_c_client-4.2.0-1.linux.x86_64.rpm
```
and now the c_client is installed and ready in your `/usr/` directory. That was easy!

## Install Python Client
Installing the Python Client is slightly more involved but still a very easy process. First, let's download the file from GitHub

``` bash
$ wget \
https://github.com/griddb/python_client/archive/0.8.1.tar.gz
```
Next, let's unzip

``` bash
$ tar xvzf 0.8.1.tar.gz
```
and let's install the prereqs
``` bash
$ wget https://prdownloads.sourceforge.net/swig/swig-3.0.12.tar.gz
tar xvfz swig-3.0.12.tar.gz
cd swig-3.0.12
./configure
make 
sudo make install
```
And then we may need to install pcre as well
``` bash
$ sudo yum install pcre2-devel.x86_64
```
Now of course we actually `make` our Python Client
``` bash
$ cd ../python_client
make
```
If by chance you encounter the following error when attempting to make your Python Client

    /usr/bin/ld: cannot find -lgridstore
do not worry: it is an easy fix. The issue lies with needing your `Makefile` to point to your c_client. This means the only thing we need to do is add the `c_client/bin` location in the LDFLAGS option

    SWIG = swig -DSWIGWORDSIZE64
    CXX = g++
    
    ARCH = $(shell arch)
    
    LDFLAGS = -L/home/israel/c_client/bin -lpthread -lrt -lgridstore #added /home/israel/c_client_bin right here
    
    CPPFLAGS = -fPIC -std=c++0x -g -O2
    INCLUDES = -Iinclude -Isrc
    
    INCLUDES_PYTHON = $(INCLUDES)   \
                                    -I/usr/include/python3.6m
    
    PROGRAM = _griddb_python.so
    EXTRA = griddb_python.py griddb_python.pyc
    
    SOURCES =         src/TimeSeriesProperties.cpp \
                      src/ContainerInfo.cpp                 \
                      src/AggregationResult.cpp     \
                      src/Container.cpp                     \
                      src/Store.cpp                 \
                      src/StoreFactory.cpp  \
                      src/PartitionController.cpp   \
                      src/Query.cpp                         \
                      src/QueryAnalysisEntry.cpp                    \
                      src/RowKeyPredicate.cpp       \
                      src/RowSet.cpp                        \
                      src/TimestampUtils.cpp                        \
    
    all: $(PROGRAM)
    
    ... snip ...
With the fix in place, `make` should work as intended. Next up: setting our environment variables. We just need to point to the proper locations:

``` bash
$ export LIBRARY_PATH=$LIBRARY_PATH:[insert path to c_client]
$ export  PYTHONPATH=$PYTHONPATH:[insert path to python_client]
$ export LIBRARY_PATH=$LD_LIBRARY_PATH:[insert path to c_client/bin]
```
Now we should be able to use both c and python with our GridDB Cluster.

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
