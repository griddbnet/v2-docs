# Go

<p class="iframe-container">
<iframe width="560" height="315" src="https://www.youtube.com/embed/TXJVY8Drp3k" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
</p>

- <a href="#installation">Installation</a>
- <a href="#simulating-an-iot-dataset">Simulating an IoT Dataset</a>
- <a href="#getting-our-griddb-connection-and-schema"> Getting Our GridDB Connection and Schema </a>
- <a href="#inserting"> Inserting into GridDB </a>
- <a href=#querying> Querying using GridDB Shell </a>

::: tip Notes
The array type for GridDB is not yet available for the Go Client. If your project absolutely requires the array type, please use the Python/C/Java Client instead.
:::

## Installation

### Install c_client
The GridDB c_client (a preqrequisite to using the Go Client) can be found here: [https://github.com/griddb/c_client](https://github.com/griddb/c_client). RPM can be downloaded from [here](https://github.com/griddb/c_client/releases).. So to get started simply `wget` the latest RPM and install.

``` bash
$ wget \
https://github.com/griddb/c_client/releases/download/v4.2.0/griddb_c_client-4.2.0-1.linux.x86_64.rpm
```
then we need to actually install the rpm
``` bash
$ sudo rpm -ivh griddb_c_client-4.2.0-1.linux.x86_64.rpm
```
and now the c_client is installed and ready in your `/usr/` directory. That was easy! With the C Client installed, we will need to point our `LD_LIBRARY_PATH` environment variable to the directory which contains the newly made files.

``` bash
$ export LD_LIBRARY_PATH=$LD_LIBRARY_PATH:/usr/griddb_c_client-4.2.0/lib
$ export LIBRARY_PATH=$LIBRARY_PATH:/usr/griddb_c_client-4.2.0/lib
```

### Install Go Client
To install the Go Client is a bit more work as it has a couple of dependencies. Obviously the Go language itself is needed, so please install that first and set your environment. 


Next let's install some prereqs. If you would like to simply copy and paste the next commands, please switch the root user. 
First up is PCRE:
``` bash
$ wget https://sourceforge.net/projects/pcre/files/pcre/8.39/pcre-8.39.tar.gz
$ tar xvfz pcre-8.39.tar.gz
$ cd pcre-8.39
$ ./configure
$ make
$ make install
```
And next is SWIG:
``` bash
$ wget https://prdownloads.sourceforge.net/swig/swig-3.0.12.tar.gz
$ tar xvfz swig-3.0.12.tar.gz
$ cd swig-3.0.12
$ ./configure
$ make
$ make install
```
Now let's install the actual Go Client from github: [https://github.com/griddb/go_client/](https://github.com/griddb/go_client/)。

You should now set your GOPATH variable for Go module files or ignore go mod files completely: `go env -w GO111MODULE=off`

And now we're free to install the Go client using the `go get` command

``` go
$ go get -d github.com/griddb/go_client
```

Next we will need to run the script to generate and install the Go client itself:

``` bash
$ cd $GOPATH/src/github.com/griddb/go_client
$ ./run_swig.sh
$ go install
```

And with that, the Go client should be now be usable within your projects.


## Simulating an IoT Dataset

For this section, we will walk through a Go script which aims to show a prospective developer how to make entries of an IoT dataset into their GridDB database. This simulation of data will then allow the developer to create any sort of problem-solving or querying that they would in their real project. 

Oftentimes before beginning a full-scale project, a developer may choose to first create a PoC (Proof of Concept) to help illustrate intent and usage. Doing so has the added benefit of perhaps helping the developer uncover any potential pitfalls in the project. In the case of GridDB, if a developer wants to create an IoT (Internet of Things) project, it may be easier to simply simulate a full IoT dataset rather than seeking one out or creating a rudimentary version of the full project. 


For this simulation, we will use `TIMESERIES` containers and we will look at sample code for two different sorts of schema: one in which each 'sensor' has its own container, and another where each sensor has a unique ID inside the same container.

### Using Go

Using the Go Connector is about the same as using the Python version wherein you define the schema of your container as a Go variable. The only caveat here being that you must `defer` close the container info, along with the gridstore and other GridDB-related objects; the reason here being that the objects will continue to eat up memory unless explicitly closed by the user.  In Go, the `defer` statement simply means it will run that command last when the entire function is finished and about to return.

#### Getting our GridDB Connection and Schema

So first let's get our GridDB connection settings and gridstore obj. Here we will be using default values for all parameters. If you followed along with the official GridDB documentation, this should also work for your database.

``` go 
gridstore, err := factory.GetStore(map[string]interface{} {
    "host": "239.0.0.1",
    "port": 31999,
    "cluster_name": "defaultCluster",
    "username": "admin",
    "password": "admin"})
if (err != nil) {
    fmt.Println("Failure getting the gridstore: ", err)
    panic("err get store")
}
defer griddb_go.DeleteStore(gridstore)
```

Next let's look at the schema. For IoT data, we generally have many sensors outputting just one or two data points that may be of interest to the project. For this case, we will simulate just a sensor temperature and an arbitrary 'data' point, of which both will be floats. Notice that this schema has a sensor ID -- this means this schema will be used on one big time series container which will house *all* data.

``` go
containerName := "sensors"
conInfo, err := griddb_go.CreateContainerInfo(map[string]interface{} {
    "name": containerName,
    "column_info_list":[][]interface{}{
        {"timestamp", griddb_go.TYPE_TIMESTAMP},
        {"id", griddb_go.TYPE_SHORT},
        {"data", griddb_go.TYPE_FLOAT},
        {"temperature", griddb_go.TYPE_FLOAT}},
    "type": griddb_go.CONTAINER_TIME_SERIES,
    "row_key": true})
if (err != nil) {
    fmt.Println("Create containerInfo failed, err:", err)
    panic("err CreateContainerInfo")
}
defer griddb_go.DeleteContainerInfo(conInfo)
```

Also take notice the `defer` statement after each instance of a GridDB object.

### Simulating Data 

First, to start: this is how to actually use this script. When you want to simulate a dataset, you can simply run the entire script like so 

``` bash
$ go run simulate.go 24 5
```

The first number is number of hours to simulate, while the second one is increments (in minutes). So this script will go in and create a dataset into your GridDB server over the timespan of `now` through 24 hours from now, with data emitting every 5 minutes from N sensors (`numSensors` can be set inside the script itself). 

As to how it works, before anything else, you need to Go boilerplate at the top of your code: 

To use the GridDB Go Client in your Go code, you simply import the statement at the top of your code: 

``` go
package main

import(
    "github.com/griddb/go_client"
    "fmt"
    "math"
    "math/rand"
    "os"
    "time"
)
```

You can see from this that we are importing the GridDB Go connector.

#### Generating Random Data Points

To start, a developer can set the number of sensors they would like to 'emit' data per incremented time span. As a default, it is set to 9: `numSensors := 9`.

Our `generate_data` function will do all of the data generation and return the appropriate data structure.

From there, we can do some time math to convert our user's choices of duration (hours) and increments (minutes) to a standard of milliseconds.

``` go
//user input parameters
hours, _ := strconv.Atoi(os.Args[1]) 
minutes, _ := strconv.Atoi(os.Args[2])

duration := hours * 3600000 //converts to hours
increment := minutes * 60000 // converts to minutes

durationMilli := time.Duration(duration) * time.Millisecond
incrementMilli := time.Duration(increment) * time.Millisecond

d := durationMilli.Milliseconds()
inc := incrementMilli.Milliseconds()

arrLen := (d / inc) * int64(numSensors) //gives us the amount of times to emit sensor data total
```

And then we need to initialize the data structures we will be using to build out our dataset

``` go
times := make([][]time.Time, arrLen) //timestamps
id := make([][]int, arrLen)
data := make([][]float64, arrLen)
temp := make([][]float64, arrLen)

var inEntryList = make(map[string][][]interface{}, 0)
fullData := make([][][]interface{}, 1)
fullData[0] = make([][]interface{}, arrLen)
```

Now we need to create a timestamp of our current time for two different reasons. The obvious reason is to use as a baseline for our simulated data in our time series containers. The other is to have a [seed](https://en.wikipedia.org/wiki/Random_seed) for the Go random generator to get "more" [random numbers](https://gobyexample.com/random-numbers) in our dataset.

``` go
now := time.Now()

s1 := rand.NewSource(time.Now().UnixNano())
r1 := rand.New(s1)
```

From there it's simply a matter of using some `for loops` to create different numbers/floats for each desired timestamp and to store that in an object which is eventually returned by the function.

``` go
//iterates through entire length of dataset
for i := 0; i < int(arrLen); i++ {

    innerLen := numSensors
    fullData[0][i] = make([]interface{}, innerLen)
        times[i] = make([]time.Time, innerLen)
    id[i] = make([]int, innerLen)
    data[i] = make([]float64, innerLen)
    temp[i] = make([]float64, innerLen)

    var rowList []interface{}

    // iterates through each sensor (ie. will emit data N amount of times )
    for j := 0; j < innerLen; j++ {
        addedTime := i * minutes
        timeToAdd := time.Minute * time.Duration(addedTime)
        incTime :=  now.Add(timeToAdd)
        
        times[i][j] = incTime
        id[i][j] = j
        data[i][j] = (r1.Float64() * 100) + numSensors // using the random seed
        x := (r1.Float64() * 100) + 2  
        temp[i][j] = math.Floor(x*100) / 100 // temp should only go 2 decimal places

        var row []interface{}
        row = append(row, times[i][j])
        row = append(row, id[i][j])
        row = append(row, data[i][j])
        row = append(row, temp[i][j])
        rowList = append(rowList, row)
        // fmt.Println("fullData: ", fullData[0][i][j])
    }
    fullData[0][i] = rowList
}
```

Once we have generated all data, we need to create the `map` data struct that our GridDB library expects.

``` go
for _, val := range fullData {
    for i := 0; i < numSensors; i++ {
        rowList := [][]interface{}{}
        idx := containerNameList[i]
        for _, innerVal := range val {
            rowList = append(rowList, innerVal[i].([]interface{}))
        }
        inEntryList[idx] = rowList
    }
}

return inEntryList
```

The structure of the data being returned by this `func` is of type `map[string][][]interface{}`. You can learn about multidimensional Go slices from the [official Go Blog](https://blog.golang.org/slices-intro). This is the data structure expected by `gridstore.MultiPut`.

### Inserting

When it is time to insert the generated dataset into your server, you will once again utilize a `for loop` to iterate through the generated `fullData` to be inserted into GridDB. And with the [`MultiPut` feature](https://griddb.net/en/blog/griddb-optimization-with-multi-put-and-query/), it inserts rather quickly.

#### Singular Container (SinglePut)

If you insert all sensor data into one singular Time Series container with different sensor IDs, the code will look like this. Please note that the container info and schema are identitical to the one showcased above.

``` go
ts, err := gridstore.PutContainer(conInfo, true)
    if (err != nil) {
        fmt.Println("put container failed, err:", err)
        panic("err PutContainer")
    }

fullDataset := generate_data()

for _, outerVal := range fullDataset {
    for _, innerVal := range outerVal {
        err := ts.Put(innerVal.([]interface{}))
        if err != nil {
            fmt.Println("put error: ", err)
            return
        } else {
            fmt.Println("successfully put: ", innerVal)
        }
    }
} 
```

In this particular example, we insert the data one row at a time -- hence why we are simply using `ts.Put` instead of `ts.MultiPut`. You can use this script along with a Go `time.Sleep` to simulate the data being emitted every X seconds.

``` go
time.Sleep(2 * time.Second)
```

To achieve insert with this data, we have a `for loop` iterating through the full data set and then another `for loop` iterating through each individual row. This singular row is then put into the proper GridDB container. If your dataset will be output from a singular machine that itself has tons of sensors, you may opt to use this singular container method.

#### Multiple Containers (MultiPut)

If instead you want to simulate a dataset that comes from individual sensors with individual containers, you would only need to change it slightly. First, you need to initialize the list of potential container names at the top of the `generate_data` function: 

``` go
containerNameList := make([]string, numSensors)
for i := range containerNameList {
        containerNameList[i] = "test_sensor_" + strconv.Itoa(i)
    }
fmt.Println("containerNameList: ", containerNameList)
```

`containerNameList:  [test_sensor_0 test_sensor_1 test_sensor_2]`

From here we range over this list and create the containers' GridDB `conInfo` objects individually.

Because our `generate_data` function is already returning to us a useable data structure that can be inserted into GridDB right away, we only need to iterate through the key names and `put` the containers and their schema into GridDB. The full data structure can be inserted as is.

So, to conclude, let's iterate through our full dataset.

``` go

// returns map[string][][]interface{}  
// key is the container name
fullDataset := generate_data() 

// key, value
for containerName, _ := range fullDataset {
    fmt.Println("containerName: ", containerName)
    conInfo, err := griddb_go.CreateContainerInfo(map[string]interface{}{"name": containerName,
        "column_info_list":[][]interface{}{
        {"timestamp", griddb_go.TYPE_TIMESTAMP},
        {"data", griddb_go.TYPE_FLOAT},
        {"temperature", griddb_go.TYPE_FLOAT}},
        "type": griddb_go.CONTAINER_TIME_SERIES,
        "row_key": true})
    if err != nil {
        fmt.Println("ERROR CreateContainerInfo")
    }
    defer griddb_go.DeleteContainerInfo(conInfo)

    _, err = gridstore.PutContainer(conInfo)
    if err != nil {
        fmt.Println("ERROR PutContainer, ", err)
    }
}
```

And finally, let's `put` the data into GridDB

``` go
err = gridstore.MultiPut(fullDataset)
if err != nil {
    fmt.Println("error from MultiPut: ", err)
} else {
    fmt.Println("successfully Put: : ", fullDataset)
}
```

### Querying

To run some basic queries, let's use the [GridDB Shell](), which came to GridDB with version 4.6. To start, let's drop into the shell and do a basic check to make sure our data is there: 

``` bash
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

``` bash
gs[public]> tql testing_0 select * where timestamp > TIMESTAMPADD(HOUR, NOW(), -6);
20,810 results. (3 ms)

gs[public]> get 3
timestamp,data,temperature
2021-08-04T16:28:34.566Z,7.682323,70.7
2021-08-04T16:29:28.943Z,22.910458,33.14
2021-08-04T16:30:34.566Z,89.90703,101.03
The 3 results had been acquired.
```


### Conclusion

With that, you can now generate as much IoT data as needed for your proof of concepts.

The complete source code can be downloaded from the [GridDB.net GitHub](https://github.com/griddbnet/tutorials/tree/main/golang_simulate_data).
