# CRUD Operations

CRUD operations are present in all databases as the foundational actions that allow the most basic of actions. GridDB's CRUD operations are most easily executed by using its very own Java-based API, though it does also accept TQL.

**What is CRUD?**

*   **Create:** writing new data (containers, rows, etc)
*   **Read:** viewing, or "pulling up" any data
*   **Update:** to modify already existing data (as opposed to writing NEW data) to reflect changes
*   **Delete:** erasing or removing data from a container or row

### Native API

GridDB can be accessed using TQL or through its native API. The native API willl be looked at first, followed by some examples of use with TQL.

**Creating a Container**

Containers can be made easily by defining the data as a class.

// Create Collection
Collection weatherStationCol =
        store.putCollection("weather_station", WeatherStation.class);
return weatherStationCol; 

34-35 line: create the collection by using the GridStore.putCollection (String, Class) method. The String Specifies the name of the container. The Class specifies the WeatherStation class that was created in the schema definition.

**

Register the Data

**

Ready access to GridDB in the above process is now ready. Let's try to register the data in GridDB.

// Set the value to Row data
WeatherStation weatherStation1 = new WeatherStation ();
weatherStation1.id = "1";
weatherStation1.name = "WeatherStation 01";
weatherStation1.latitude = 35.68944;
weatherStation1.longitude = 139.69167;
weatherStation1.hasCamera = true;

WeatherStation weatherStation2 = new WeatherStation ();
weatherStation2.id = "2";
weatherStation2.name = "WeatherStation 02";
weatherStation2.latitude = 35.02139;
weatherStation2.longitude = 135.75556;
weatherStation2.hasCamera = false;

// Register Collection
weatherStationCol.put (weatherStation1);
weatherStationCol.put (weatherStation2);

\* 30-42 line: Set the values of the data to be registered.  
\* 45-46 line: Pack data and register it in the container

**Read The Data (Retrieval)**

Now the registered data can be retrieved from the GridDB server.

**List.6 data acquisition process** (FirstGridDB.java)

// Retrieve Collection
System.out.println("get by key");
System.out.println("ID\\tName\\t\\t\\tLongitude\\tLatitude\\tCamera");
weatherStationCol = store.getCollection("weather_station", WeatherStation.class);

for (int i = 0; i <2; i ++) {
	WeatherStation weatherStation = weatherStationCol.get (String.valueOf (i + 1));
	System.out.println (String.format("% - 3s\\t% -20s\\t% s\\t% s\\t% -5s", weatherStation.id,
			weatherStation.name, weatherStation.latitude, weatherStation.longitude,
			weatherStation.hasCamera));
}

\* 51 line: First get the container by specifying the container name and class.  
\* 54 line: Then get row data by specifying the key.  
Here is the output:  
  
**List.7 data acquisition result**

get by key
ID Name Longitude Latitude Camera
1 WeatherStation 01 35.68944 139.69167 true
2 WeatherStation 02 35.02139 135.75556 false

**

Deleting A Container

**

The command to delete a container looks like this:

Container.dropCollection (String)

### TQL

Put simply, TQL is a simplified SQL prepared for NoSQL products. The support range is limited to functions such as search, aggregation, etc. TQL is employed by using the client API (Java, C language). To register and search for data in GridDB, a container or table (NewSQL products only) needs to be created to store the data. This section describes the data types that can be registered in a container or table, data size, index and data management functions.

The naming rules for containers and tables are the same as those for databases.

*   A string consisting of alphanumeric characters and the underscore mark can be specified. However, the first character cannot be a number.
*   Although the case sensitivity of the name is maintained, a container (table) which has the same name when it is not case-sensitive cannot be created.

**Container Creation**

Container (collection)	
createcollection	Container name Column name Type \[Column name Type …\]
Container (time series container)	
createtimeseries	Container name Compression method Column name type \[Column name Type …\]

*   Description of each argument
    
      
    
    Argument
    
    Description
    
    Container name
    
    Specify the name of the container to be created. If the name is omitted in the createcontainer command, a container with the name given in the container data file will be created.
    
    Column name
    
    Specify the column name.
    
    Type
    
    Specify the column type.
    
    Compression method
    
    For TimeSeries data, specify the data compression method.
    
    Container definition file
    
    Specify the file storing the container data in JSON format.
    
    **Detailed version**
    
    Specify the container definition data in the json file to create a container.
    
    *   The container definition data has the same definition as the metadata file output by the export tool. See [Metadata files](#impexp_metadata) with [the container data file format](#container_dataform) for the column type and data compression method, container definition format, etc. However, the following data will be invalid in this command even though it is defined in the metadata file of the export command.
        *   version Export tool version
        *   database Database name
        *   containerFileType Export data file type
        *   containerFile Export file name
        *   partitionNo Partition no.
    *   Describe a single container definition in a single container definition file.
    *   If the container name is omitted in the argument, create the container with the name described in the container definition file.
    *   If the container name is omitted in the argument, ignore the container name in the container definition file and create the container with the name described in the argument.
    *   An error will not result even if the database name is described in the container definition file but the name will be ignored and the container will be created in the database currently being connected.
    *   When using the container definition file, [the metadata file will be output when the --out option is specified in the export function](#impexp_export). The output metadata file can be edited and used as a container definition file.

　　Example: When using the output metadata file as a container definition file

{
    "version":"2.1.00",　　　　　　　　　　　　　　　←invalid
    "container":"container_354",
    "database":"db2",　　　　　　　　　　　　　　　　←invalid
    "containerType":"TIME_SERIES",
    "containerFileType":"binary",　　　　　　　　　　←invalid
    "containerFile":"20141219\_114232\_098_div1.mc", 　←invalid
    "rowKeyAssigned":true,
    "partitionNo":0,　　　　　　　　　　　　　　　　 ←invalid
    "columnSet":\[
        {
            "columnName":"timestamp",
            "type":"timestamp"
        },
        {
            "columnName":"active",
            "type":"boolean"
        },
        {
            "columnName":"voltage",
            "type":"double"
        }
    \],
    "timeSeriesProperties":{
        "compressionMethod":"NO",
        "compressionWindowSize":-1,
        "compressionWindowSizeUnit":"null",
        "expirationDivisionCount":8,
        "rowExpirationElapsedTime":-1,
        "rowExpirationTimeUnit":"null"
    },
    "compressionInfoSet":\[
    \]

**Container Deletion**

*   Example:
    
    gs\[public\]> dropcontainer　Con001
    

**Container Indication**

The following command is used to display the container data.

*   Sub-command
    
      
    
    showcontainer
    
    Container name
    
*   Description of each argument
    
      
    
    Argument
    
    Description
    
    Container name
    
    Specify the container name to be displayed. Display a list of all containers if omitted.
    
*   Example:
    
    // display container list
    gs\[userDB\]> showcontainer
    Database : userDB
    Name                  Type         PartitionId
    \-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-
    cont001               COLLECTION            10
    col00a                COLLECTION             3
    time02                TIME_SERIES            5
    cont003               COLLECTION            15
    cont005               TIME_SERIES           17
    
    // display data of specified container
    gs\[public\]> showcontainer cont003
    Database    : userDB
    Name : cont003
    Type : COLLECTION
    Partition ID: 15
    DataAffinity: -
    
    Columns:
    No  Name                  Type            Index
    \-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-
     0  col1                  INTEGER         \[TREE\] (RowKey)
     1  col2                  STRING          \[\]
     2  col3                  TIMESTAMP       \[\]
    

**\[Memo\]**

*   The data displayed in a container list are the “Container name”, “Container type” and “Partition ID”.
*   The data displayed in the specified container are the “Container name”, “Container type”, “Partition ID”, “Defined column name”, “Column data type” and “Column index setting”.
*   Container data of the current DB will be displayed.

**Container ROWKEY**

A ROWKEY is the data set in the row of a container. The uniqueness of a row with a set ROWKEY is guaranteed. A ROWKEY can be set in the first column of the row. (This is set in Column No. 0 since columns start from 0 in GridDB.)

*   For a timeseries container

*   ROWKEY is a TIMESTAMP
*   Must be specified.

*   For a collection container

*   A ROWKEY is either a STRING, INTEGER, LONG, or TIMESTAMP column.
*   Need not be specified

A default index prescribed in advance according to the column data type can be set in a column set in ROWKEY. In the current version, the default index of all STRING, INTEGER, LONG or TIMESTAMP data that can be specified in a ROWKEY is the TREE index.

### Sample of Collection Operations (Java)

package test;


import java.util.Arrays;
import java.util.Properties;

import com.toshiba.mwcloud.gs.Collection;
import com.toshiba.mwcloud.gs.GSException;
import com.toshiba.mwcloud.gs.GridStore;
import com.toshiba.mwcloud.gs.GridStoreFactory;
import com.toshiba.mwcloud.gs.Query;
import com.toshiba.mwcloud.gs.RowKey;
import com.toshiba.mwcloud.gs.RowSet;


// Operaton on Collection data
public class Sample1 {

	static class Person {
		@RowKey String name;
		boolean status;
		long count;
		byte\[\] lob;
	}

	public static void main(String\[\] args) throws GSException {

		// Get a GridStore instance
		Properties props = new Properties();
		props.setProperty("notificationAddress", args\[0\]);
		props.setProperty("notificationPort", args\[1\]);
		props.setProperty("clusterName", args\[2\]);
		props.setProperty("user", "system");
		props.setProperty("password", "manager");
		GridStore store = GridStoreFactory.getInstance().getGridStore(props);

		// Create a Collection (Delete if schema setting is NULL)
		Collection<String, Person> col = store.putCollection("col01", Person.class);

		// Set an index on the Row-key Column
		col.createIndex("name");

		// Set an index on the Column
		col.createIndex("count");

		// Set the autocommit mode to OFF
		col.setAutoCommit(false);

		// Prepare data for a Row
		Person person = new Person();
		person.name = "name01";
		person.status = false;
		person.count = 1;
		person.lob = new byte\[\] { 65, 66, 67, 68, 69, 70, 71, 72, 73, 74 };

		// Operate a Row on a K-V basis: RowKey = "name01"
		boolean update = true;
		col.put(person);	// Add a Row
		person = col.get(person.name, update);	// Obtain the Row (acquiring a lock for update)
		col.remove(person.name);	// Delete the Row

		// Operate a Row on a K-V basis: RowKey = "name02"
		col.put("name02", person);	// Add a Row (specifying RowKey)

		// Commit the transaction (Release the lock)
		col.commit();

		// Search the Collection for a Row
		Query<Person> query = col.query("select * where name = 'name02'");

		// Fetch and update the searched Row
		RowSet<Person> rs = query.fetch(update);
		while (rs.hasNext()) {
			// Update the searched Row
			Person person1 = rs.next();
			person1.count += 1;
			rs.update(person1);

			System.out.println("Person: " +
					" name=" + person1.name +
					" status=" + person1.status +
					" count=" + person1.count +
					" lob=" + Arrays.toString(person1.lob));
		}

		// Commit the transaction
		col.commit();

		// Release the resource
		store.close();
	}

}

### Sample of TimeSeries Operations 0 Storage and Extraction of Specific Range (Java)

package test;


import java.util.Date;
import java.util.Properties;

import com.toshiba.mwcloud.gs.GSException;
import com.toshiba.mwcloud.gs.GridStore;
import com.toshiba.mwcloud.gs.GridStoreFactory;
import com.toshiba.mwcloud.gs.RowKey;
import com.toshiba.mwcloud.gs.RowSet;
import com.toshiba.mwcloud.gs.TimeSeries;
import com.toshiba.mwcloud.gs.TimestampUtils;
import com.toshiba.mwcloud.gs.TimeUnit;


// Storage and extraction of a specific range of time-series data
public class Sample2 {

	static class Point {
		@RowKey Date timestamp;
		boolean active;
		double voltage;
	}

	public static void main(String\[\] args) throws GSException {

		// Get a GridStore instance
		Properties props = new Properties();
		props.setProperty("notificationAddress", args\[0\]);
		props.setProperty("notificationPort", args\[1\]);
		props.setProperty("clusterName", args\[2\]);
		props.setProperty("user", "system");
		props.setProperty("password", "manager");
		GridStore store = GridStoreFactory.getInstance().getGridStore(props);

		// Create a TimeSeries (Only obtain the specified TimeSeries if it already exists)
		TimeSeries<Point> ts = store.putTimeSeries("point01", Point.class);

		// Prepare time-series element data
		Point point = new Point();
		point.active = false;
		point.voltage = 100;

		// Store the time-series element (GridStore sets its timestamp)
		ts.append(point);

		// Extract the specified range of time-series elements: last six hours
		Date now = TimestampUtils.current();
		Date before = TimestampUtils.add(now, -6, TimeUnit.HOUR);

		RowSet<Point> rs = ts.query(before, now).fetch();

		while (rs.hasNext()) {
			point = rs.next();

			System.out.println(
					"Time=" + TimestampUtils.format(point.timestamp) +
					" Active=" + point.active +
					" Voltage=" + point.voltage);
		}

		// Release the resource
		store.close();
	}

}
