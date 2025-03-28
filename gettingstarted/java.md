# Java

<p class="iframe-container">
<iframe width="560" height="315" src="https://www.youtube.com/embed/TMQAZrRHFuE" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
</p>

First, the required import statements:

``` java
import com.toshiba.mwcloud.gs.Collection;
import com.toshiba.mwcloud.gs.GSException;
import com.toshiba.mwcloud.gs.GridStore;
import com.toshiba.mwcloud.gs.GridStoreFactory;
import com.toshiba.mwcloud.gs.Query;
import com.toshiba.mwcloud.gs.RowKey;
import com.toshiba.mwcloud.gs.RowSet;
```
The container schema is defined as a static Class in Java.
``` java
static class Person {
	@RowKey String name;
	int age;
}
static class HeartRate {
	@RowKey Date ts;
	int heartRate;
        String activity;
}
```
To connect to GridDB, you create a Properties instance with the particulars of your GridDB installation.
``` java
Properties props = new Properties();
props.setProperty("notificationMember", "127.0.0.1:10001");
props.setProperty("clusterName", "myCluster");
props.setProperty("user", "admin");
props.setProperty("password", "admin");
GridStore store = GridStoreFactory.getInstance().getGridStore(props);
```
To perform queries or write records, you first need to get the container:
``` java
Collection<String, Person> people = store.putCollection("PEOPLE", Person.class);
```
Querying is similar to SQL/JDBC drivers.
``` java
Query<Person< query = col.query("select * where name = 'John'");
RowSet<Person> rs = query.fetch(false);
while (rs.hasNext()) {
	// Update the searched Row
	Person person1 = rs.next();
        System.out.println("Name: "+ person1.name +" Age: "+ person1.age)
}
```
Writing is simple...
``` java
HeartRate hr = new HeartRate();
hr.ts = new Date();
hr.heartrate = 60;
hr.activity = "resting";
TimeSeries<HeartRate> heartRate = store.putTimeSeries("HR_"+person1.name, HeartRate.class);
heartRate.put(hr);
```
Updating is simple:
``` java
Query<Person> query = col.query("select * where name = 'John'");
RowSet<Person> rs = query.fetch(true);
while (rs.hasNext()) {
	// Update the searched Row
	Person person1 = rs.next();
        person1.age++;
        rs.update(person1);
}
```
To compile use the following snippet:
``` bash
$ cd gsSample/
$ export CLASSPATH=$CLASSPATH:/usr/share/java/gridstore.jar
$ javac Sample1.java
$ cd .. && java gsSample/Sample1
```
Alternatively, you can check out how to use maven with GridDB [here](https://griddb.net/en/blog/using-maven-to-develop-griddb-applications/).

## Simulate IoT Data With Java

Java is perhaps the easiest programming language to start interfacing with GridDB. Unlike the other languages (Python, JavaScript, Golang, C, Ruby, and PHP), Java is the *native* interface, which means it works out of the box and makes zero concessions in data types or functionality. 

For this article, we will continue our series of showcasing how to use each language by simulating IoT (internet of things) data and inserting that data into a GridDB TimeSeries container. The idea of the exercise is to give concrete examples of how schema creation and placing data into the containers works. 

It also serves to allow developers to follow along and create a dummy dataset of IoT-like data structures to provide a simple proof-of-concept for using GridDB in a potentially bigger project or application.

## Schema Creation

To begin we will learn how to create a container using GridDB. To do so in Java, it is as simple as creating a Java class with the schema built in. With this, you can even declare which row is to be used as the `RowKey`.

In the following snippet of code, there will be a class called `Iot` which will eventually be used to create a TimeSeries container in our server. Because a TimeSeries container takes a timeseries row as the rowkey, at least two java imports will be needed: `java.util.date` and the GridDB RowKey.

```java
import java.util.Date;
import com.toshiba.mwcloud.gs.RowKey;

public class Iot {
    @RowKey Date timestamp;
    double data;
    double temperature;
}
```

As mentioned before, the aim of this article to simulate IoT data, so the class here is a stand-in for a generic sensor which may be emiting the data, the time, and its internal temperature reading. 

## Connecting To GridDB

Connecting to the database with Java consists of creating a Properties file from the `java.util` package and entering the credentials through various key:value pairs. 

```java
            Properties props = new Properties();
            props.setProperty("notificationMember", "127.0.0.1:10001");
            props.setProperty("clusterName", "myCluster");
            props.setProperty("user", "admin");
            props.setProperty("password", "admin");
            store = GridStoreFactory.getInstance().getGridStore(props);
```

Here we are using the default values. 

The `store` variable is of type `Gridstore` and it is now how we will interact with the database. As an outside example, to put data, we would use one of `store`'s methods called `put`.

## Generating and Putting List of Containers to GridDB

Now that the connection is out of the way, the attention will be on generating appropriate data to fit into the Iot class/schema. To do so, the java.util's `random` package will help to create values for data and temperature. The time data will be generated from a set arbitrary date/time and iterated upon with simple addition.

To start, we will create a method called Generate. As parameters, it will take the store object, a list which will contain all container names, and the amount of rows to be created.

To make this program as efficient as possible, we be using GridDB's `multiPut` which allows many rows of data to be inserted at once (as opposed to singular rows at a time with a more regular `put`).

Because `multiPut` takes more than singular row of data, the data type required to use this method is, according to the API docs: "containerRowsMap - A map made up of a list of Row objects and target Container names" which is of type `(java.util.Map<java.lang.String,java.util.List<Row>>`. This simply means that the data structure that is to be formed when we are generating our random data needs to be a map with a container name as the key and the corresponding rows as the value. 

When running this code, it will require a couple of command line arguments from the user: the number of sensors to spoof, and the number of rows per sensor.

```java
            int numSensors = Integer.parseInt(args[0]);
            int rowCount = Integer.parseInt(args[1]);
```

The number of sensors will come into play when creating our container names for the rowListMap object.

```java
            try {
                List<String> containerNameList = new ArrayList<String>();
                for (int i = 0 ; i < numSensors; i++) {
                    String name = "iot"+i;
                    containerNameList.add(name);
                    TimeSeries<Iot> ts;
                    try {
                        ts = store.putTimeSeries(name, Iot.class);
                    } catch (GSException e) {
                        System.out.println("An error occurred when creating the container.");
                        e.printStackTrace();
                        System.exit(1);
                    }
            }
```

Here we are creating multiple containers with the name `iot`+num. Take notice that we are using the `store` object to `put` the `Iot.class`. Also notice that we are explicitly creating a `TimeSeries` container. With this in place, we can call the `Generate` method by using our containerName list.

```java
final Map<String, List<Row>> rowListMap = Generate(store, containerNameList, rowCount);
```

## Simultating IoT Data

The beginning of the method first declares the object which will be returned

```java
final Map<String, List<Row>> rowListMap = new HashMap<String, List<Row>>();
```

From there, it's simply a matter of looping over our container names and calling the Random library to create data points for the `data` and `temperature` columns. For the time, we initilize a time object and then add 1 minute per iteration. For each iteration, we add to an object called `rowList` and then add it to the `rowListMap` object (along with its container name). When it's all done, we return the rowListMap back to the main function.

```java
        try { 

            Random rnd = new Random();

            for (String containerName : containerNameList) {
                final List<Row> rowList = new ArrayList<Row>();
                ContainerInfo containerInfo;
                try {
                    containerInfo = store.getContainerInfo(containerName);
                    System.out.println(containerName);
                    SimpleDateFormat sf = new SimpleDateFormat("yyyy-MM-dd hh:mm:ss.SSS");
                    Date tm1=sf.parse("2022-03-07 10:00:00.000");
                    for (int j = 0; j < rowCount; j++) {
                        Row row = store.createRow(containerInfo);
                        row.setTimestamp(0,TimestampUtils.add(tm1, j, TimeUnit.MINUTE));
                        row.setDouble(1, rnd.nextInt(10000));
                        row.setDouble(2, rnd.nextInt(100));
                        rowList.add(row);
                    }
                    rowListMap.put(containerName, rowList);

                } catch (GSException e) {
                    System.out.println("An error occurred by the making of row data.");
                    e.printStackTrace();
                    System.exit(1);
                } catch (ParseException e) {
                    System.out.println("The format of the date had an error");
                    e.printStackTrace();
                    System.exit(1);
                }
            }

            return rowListMap;
```

Once our data is ready to go, we simply `multiPut`.

```java
            try{
                store.multiPut(rowListMap);
            } catch (Exception e) {
                System.out.println("An error occurred when updating.");
                System.exit(1);
            }

            } catch (Exception e) {

            }
```

And with that, if no errors occur, you will have as many containers as specified by the `numSensors` config option. 

## Closing GridDB Connection and Conclusion

And finally, we must always sever our connection to the database.

```java
        } finally {
            if (store != null) {
                try {
                    store.close();
                } catch (GSException e) {
                    System.out.println("An error occurred when releasing the recsource.");
                    e.printStackTrace();
                }
            }
        }
```

Using GridDB is arguably the easiest and most simple when utilizing its native language Java.
