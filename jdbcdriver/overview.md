# Overview

This chapter consists of a description of the specified format and data types that can be used in a program using JDBC parameters, and the points to note during use.

　

## Connection method

### Driver specification

Add the JDBC driver file `/usr/share/java/gridstore-jdbc.jar` to the class path. When added, the driver will be registered automatically. In addition, import the driver class as follows if necessary (Normally not required).

``` sh
Class.forName("com.toshiba.mwcloud.gs.sql.Driver");
```

　

### Connection URL format

The URL has the following forms (A) to (D). If the multicast method is used to compose a cluster, normally it is connected using method (A). The load will be automatically distributed on the GridDB cluster side and the appropriate nodes will be connected. Connect using other method only if multicast communication with the GridDB cluster is not possible.

**(A) If connecting automatically to a suitable node in a GridDB cluster using the multicast method**

``` sh
jdbc:gs://(multicastAddress):(portNo)/(clusterName)/(databaseName)
```

  - multicastAddress: Multicast address used in connecting with a GridDB cluster. (Default: 239.0.0.1)
  - portNo: Port number used in connecting with a GridDB cluster.     (Default: 41999)
  - clusterName: Cluster name of GridDB cluster
  - databaseName: Database name. Connect to the default database (public) if omitted.

**(B) If connecting directly to a node in a GridDB cluster using the multicast method**

``` sh
jdbc:gs://(nodeAddress):(portNo)/(clusterName)/(databaseName)
```

  - nodeAddress: Address of node
  - portNo: Port number used in connecting with a node (Default: 20001)
  - clusterName: Cluster name of GridDB cluster that node belongs to
  - databaseName: Database name. Connect to the default database    (public) if omitted.

**(C) If connecting to a GridDB cluster using the fixed list method**

If the fixed list method is used to compose a cluster, use this method to connect.

``` sh
jdbc:gs:///(clusterName)/(databaseName)?notificationMember=(notificationMember)
```

  - clusterName: Cluster name of GridDB cluster
  - databaseName: Database name. Connect to the default database    (public) if omitted.
  - NotificationMember: Address list of node (URL encoding required). Default port is 20001.
      - Example: 192.168.0.10:20001,192.168.0.11:20001,192.168.0.12:20001

\* notificationMember can be changed by editing the gs\_cluster.json file. The port in the address list can be changed by editing the gs\_node.json file.

**(D) If connecting to a GridDB cluster using the provider method**

If the provider method is used to compose a cluster, use this method to connect.

``` sh
jdbc:gs:///(clusterName)/(databaseName)?notificationProvider=(notificationProvider)
```

  - clusterName: Cluster name of GridDB cluster
  - databaseName: Database name. Connect to the default database    (public) if omitted.
  - NotificationProvider: URL of address provider (URL encoding required)

\* notificationProvider can be changed by editing the gs_cluster.json file.

If the user name and password are going to be included in the URL in either one of the cases (A) to (D), add them at the end of the URL as shown below.

``` sh
?user=(user name)&password=(password)
```

　

### Connection timeout settings

The connection timeout can be set in either of the following methods (A) or (B). Setting (B) is prioritized if both (A) and (B) are set. Default value of 300 seconds (5 minutes) is used if neither (1) or (2) has been set, or if there are no settings.

**(A) Specify with the DriverManager\#setLoginTimeout (int seconds)**

The value in seconds is set as follows. After setting, connection timeout will be set in the connections to all the GridDB acquired by the DriverManager\#getConnection or Driver\#connect.

  - If the value is from 1 to the value set in Integer.MAX\_VALUE.
      - Set by the specified number of seconds
  - If the value is from the value set in Integer.MIN\_VALUE to 0.
      - Not set

**(B) Specify with DriverManager\#getConnection(String url, Properties info) or Driver\#connect(String url, Properties info)**

Add a property to argument info in the key "loginTimeout". If the value corresponding to the key "loginTimeout" could be converted to a numerical value, the connection timeout will be set in the connection obtained as follows.

  - If the converted value is 1 to Integer.MAX\_VALUE
      - Set by the specified number of seconds
  - If the converted value is 0 or less or larger than Integer.MAX\_VALUE
      - Not set

　

### Settings of other information
Along with the settings described above, the following information can be set at the time of connection.

  - Application name
  - Time zone (Z|±HH:MM|±HHMM)

\* Since time zone processing burdens GridDB, processing the time zone on the application side is highly recommended.


The information above can be set in either of the following methods (A) or (B). 
An error occurs when the name is specified using both methods.

**(A) Specify in URL**

To include the application name in the URL, add it to the end of the URL as follows:

``` sh
?applicationName=(application name)
```

To include the time zone in the URL, add it to the end of the URL as follows:

``` sh
?timeZone=(time zone)
```

To include also the user name and the password in the URL, use the
following method.

``` sh
?user=(user name)&password=(password)&applicationName=(application name)&timeZone=(time zone)
```

Encode the time zone symbol ":" and other characters that need to be encoded in the URL format.

**(B) Specify with DriverManager\#getConnection(String url, Properties info) or Driver\#connect(String url, Properties info)**

Add the property with the following key to the argument info.

  - Application name: applicationName
  - Time zone: timeZone


#### :warning: Notes
  - The difference between NoSQL interface/NewSQL interface
      - Containers created using the NoSQL interface client can be referenced and updated using the JDBC driver of NewSQL interface. Besides updating the rows, changes in the schema and index of a container are also included in an update.
      - Tables created using the JDBC driver of NewSQL interface can be referenced and updated by the clients of NoSQL interface.
      - A "container" for NoSQL interface and a "table" for NewSQL interface, both refer to the same object, but with different names.
      - If a time series container created by a client of NoSQL interface is searched with a SQL command from the JDBC driver, the results will not be in chronological order if no ORDER BY phrase is specified for the main key, unlike the search result conducted with a TQL command from a client of NoSQL. Specify an ORDER BY against the main key if a chronological series of the SQL results is required.
  - For consistency, regardless of interface differences, READ COMMITTED is supported as a transaction isolation level. 
  The search and update results using the NewSQL interface are not necessarily based on a single snapshot when starting a TQL command, as in the case of executing TQL with the partial execution option enabled using the NoSQL interface. 
  The results may be based on the snapshot at each execution point divided according to the data range to be executed.
    This characteristic is different from that of the operation for a single unpartitioned table using the NoSQL interface with the default setting.
