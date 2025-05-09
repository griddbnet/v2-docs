# JDBC Driver

## <span class="header-section-number">1</span> Overview

This chapter consists of a description of the specified format and data
types that can be used in a program using JDBC parameters, and the
points to note during
use.

　

## <span class="header-section-number">1.1</span> Connection method

### <span class="header-section-number">1.1.1</span> Driver specification

Add the JDBC driver file `/usr/share/java/gridstore-jdbc.jar` to the
class path. When added, the driver will be registered automatically. In
addition, import the driver class as follows if necessary (Normally not
required).

``` sh
Class.forName("com.toshiba.mwcloud.gs.sql.Driver");
```

　

### <span class="header-section-number">1.1.2</span> Connection URL format

The URL has the following forms (A) to (D). If the multicast method is
used to compose a cluster, normally it is connected using method (A).
The load will be automatically distributed on the GridDB cluster side
and the appropriate nodes will be connected. Connect using other method
only if multicast communication with the GridDB cluster is not possible.

**(A) If connecting automatically to a suitable node in a GridDB cluster
using the multicast method**

``` sh
jdbc:gs://(multicastAddress):(portNo)/(clusterName)/(databaseName)
```

  - multicastAddress: Multicast address used in connecting with a GridDB
    cluster. (Default: 239.0.0.1)
  - portNo: Port number used in connecting with a GridDB cluster.
    (Default: 41999)
  - clusterName: Cluster name of GridDB cluster
  - databaseName: Database name. Connect to the default database
    (public) if omitted.

**(B) If connecting directly to a node in a GridDB cluster using the
multicast method**

``` sh
jdbc:gs://(nodeAddress):(portNo)/(clusterName)/(databaseName)
```

  - nodeAddress: Address of node
  - portNo: Port number used in connecting with a node (Default: 20001)
  - clusterName: Cluster name of GridDB cluster that node belongs to
  - databaseName: Database name. Connect to the default database
    (public) if omitted.

**(C) If connecting to a GridDB cluster using the fixed list method**

If the fixed list method is used to compose a cluster, use this method
to
connect.

``` sh
jdbc:gs:///(clusterName)/(databaseName)?notificationMember=(notificationMember)
```

  - clusterName: Cluster name of GridDB cluster
  - databaseName: Database name. Connect to the default database
    (public) if omitted.
  - NotificationMember: Address list of node (URL encoding required).
    Default port is 20001.
      - Example:
        192.168.0.10:20001,192.168.0.11:20001,192.168.0.12:20001

\* notificationMember can be changed by editing the gs\_cluster.json
file. The port in the address list can be changed by editing the
gs\_node.json file.

**(D) If connecting to a GridDB cluster using the provider method**

If the provider method is used to compose a cluster, use this method to
connect.

``` sh
jdbc:gs:///(clusterName)/(databaseName)?notificationProvider=(notificationProvider)
```

  - clusterName: Cluster name of GridDB cluster
  - databaseName: Database name. Connect to the default database
    (public) if omitted.
  - NotificationProvider: URL of address provider (URL encoding
    required)

\* notificationProvider can be changed by editing the gs\_cluster.json
file.

If the user name and password are going to be included in the URL in
either one of the cases (A) to (D), add them at the end of the URL as
shown
below.

``` sh
?user=(user name)&password=(password)
```

　

### <span class="header-section-number">1.1.3</span> Connection timeout settings

The connection timeout can be set in either of the following methods (A)
or (B). Setting (B) is prioritized if both (A) and (B) are set. Default
value of 300 seconds (5 minutes) is used if neither (1) or (2) has been
set, or if there are no settings.

**(A) Specify with the DriverManager\#setLoginTimeout (int seconds)**

The value in seconds is set as follows. After setting, connection
timeout will be set in the connections to all the GridDB acquired by
the DriverManager\#getConnection or Driver\#connect.

  - If the value is from 1 to the value set in Integer.MAX\_VALUE.
      - Set by the specified number of seconds
  - If the value is from the value set in Integer.MIN\_VALUE to 0.
      - Not set

**(B) Specify with DriverManager\#getConnection(String url, Properties
info) or Driver\#connect(String url, Properties info)**

Add a property to argument info in the key "loginTimeout". If the value
corresponding to the key "loginTimeout" could be converted to a
numerical value, the connection timeout will be set in the connection
obtained as follows.

  - If the converted value is 1 to Integer.MAX\_VALUE
      - Set by the specified number of seconds
  - If the converted value is 0 or less or larger than
    Integer.MAX\_VALUE
      - Not
set

　

### <span class="header-section-number">1.1.4 </span> Settings of other information

Along with the settings described above, the following information can
be set at the time of connection.

  - Application name
  - Time zone (Z|±HH:MM|±HHMM)

\* Since time zone processing burdens GridDB, processing the time zone
on the application side is highly recommended.

The information above can be set in either of the following methods (A)
or (B). An error occurs when the name is specified using both methods.

**(A) Specify in URL**

To include the application name in the URL, add it to the end of the URL
as follows:

``` sh
?applicationName=(application name)
```

To include the time zone in the URL, add it to the end of the URL as
follows:

``` sh
?timeZone=(time zone)
```

To include also the user name and the password in the URL, use the
following
method.

``` sh
?user=(user name)&password=(password)&applicationName=(application name)&timeZone=(time zone)
```

Encode the time zone symbol ":" and other characters that need to be
encoded in the URL format.

**(B) Specify with DriverManager\#getConnection(String url, Properties
info) or Driver\#connect(String url, Properties info)**

Add the property with the following key to the argument info.

  - Application name: applicationName
  - Time zone: timeZone

## <span class="header-section-number">1.2</span> Points to note

  - The difference between NoSQL interface/NewSQL interface
      - Containers created using the NoSQL interface client can be
        referenced and updated using the JDBC driver of NewSQL
        interface. Besides updating the rows, changes in the schema and
        index of a container are also included in an update.
      - Tables created using the JDBC driver of NewSQL interface can be
        referenced and updated by the clients of NoSQL interface.
      - A "container" for NoSQL interface and a "table" for NewSQL
        interface, both refer to the same object, but with different
        names.
      - If a time series container created by a client of NoSQL
        interface is searched with a SQL command from the JDBC driver,
        the results will not be in chronological order if no ORDER BY
        phrase is specified for the main key, unlike the search result
        conducted with a TQL command from a client of NoSQL. Specify an
        ORDER BY against the main key if a chronological series of the
        SQL results is required.
  - For consistency, regardless of interface differences, READ COMMITTED
    is supported as a transaction isolation level. The search and update
    results using the NewSQL interface are not necessarily based on a
    single snapshot when starting a TQL command, as in the case of
    executing TQL with the partial execution option enabled using the
    NoSQL interface. The results may be based on the snapshot at each
    execution point divided according to the data range to be executed.
    This characteristic is different from that of the operation for a
    single unpartitioned table using the NoSQL interface with the
    default setting.

　

# <span class="header-section-number">2</span> Specifications

The specifications of the GridDB JDBC driver are shown in this
chapter. The chapter explains mainly the support range of the driver as
well as the differences with the JDBC standard. See the JDK API
reference for the API specifications that conform to the JDBC standard
unless otherwise stated. Please note that the following could be revised
in the future versions.

  - Actions not conforming to the JDBC standard
  - Support status of unsupported functions
  - Error
messages

　

## <span class="header-section-number">2.1</span> Common items

### <span class="header-section-number">2.1.1</span> Supported JDBC version

The following functions corresponding to some of the functions of
JDBC4.1 are not supported.

  - Transaction control
  - Stored procedure
  - Batch
instructions

### <span class="header-section-number">2.1.2</span> Error processing

#### <span class="header-section-number">2.1.2.1</span> Use of unsupported functions

  - Standard functions
      - A SQLFeatureNotSupportedException occurs if a function that
        ought to be but is currently not supported by a driver
        conforming to the JDBC specifications is used. This action
        differs from the original SQLFeatureNotSupportedException
        specifications. Error name (to be described later) is
        JDBC\_NOT\_SUPPORTED.
  - Optional functions
      - If a function not supported by this driver that is positioned as
        an optional function in the JDBC specifications and for which a
        SQLFeatureNotSupportedException may occur is used, a
        SQLFeatureNotSupportedException will occur as per the JDBC
        specifications. Error name is
        JDBC\_OPTIONAL\_FEATURE\_NOT\_SUPPORTED.

#### <span class="header-section-number">2.1.2.2</span> Invoke a method against a closed object

As per the JDBC specifications, when a method other than isClosed() is
invoked for an object that has a close() method, e.g. a connection
object, etc., a SQLException will occur. Error name is
JDBC\_ALREADY\_CLOSED.

#### <span class="header-section-number">2.1.2.3</span> Invalid null argument

If null is specified as the API method argument despite not being
permitted, a SQLException due to a JDBC\_EMPTY\_PARAMETER error will
occur. Null is not permitted except for arguments which explicitly
accepts null in the JDBC specifications or this
guide.

#### <span class="header-section-number">2.1.2.4</span> If there are multiple error causes

If there are multiple error causes, control will be returned to the
application at the point either one of the errors is detected. In
particular, if use of an unsupported function is attempted, it will be
detected earlier than other errors. For example, if there is an attempt
to create a stored procedure for a closed connection object, an error
indicating that the operation is "not supported" instead of "closed"
will be
returned.

#### <span class="header-section-number">2.1.2.5</span> Description of exception

A check exception thrown from the driver is made up of a SQLException or
a subclass instance of the SQLException. Use the following method to get
the exception details.

  - getErrorCode()
      - For errors detected by GridDB in either the server or client, an
        error number will be returned.
  - getSQLState()
      - At least for errors detected in the driver (error code: 14xxxx),
        non-null values will be returned. In other cases, undefined.
  - getMessage()
      - Return an error message containing the error number and error
        description as a set. The format is as follows.
        
        ``` sh
        [(Error number):( error name)] (error description)
        ```
    
      - When the error number is not on the list, the following error
        message format will be used instead:
        
        ``` sh
        (Error Details)
        ```

#### <span class="header-section-number">2.1.2.6</span> Error list

The list of main errors detected inside the driver is as
follows.

| Error no.  | Error code name                         | Error description format                                                                      |
| ---------- | --------------------------------------- | --------------------------------------------------------------------------------------------- |
| (Appended) | JDBC\_NOT\_SUPPORTED                    | Currently not supported                                                                       |
| (Appended) | JDBC\_OPTIONAL\_FEATURE\_NOT\_SUPPORTED | Optional feature not supported                                                                |
| (Appended) | JDBC\_EMPTY\_PARAMETER                  | The parameter (argument name) must not be null                                                |
| (Appended) | JDBC\_ALREADY\_CLOSED                   | Already closed                                                                                |
| (Appended) | JDBC\_COLUMN\_INDEX\_OUT\_OF\_RANGE     | Column index out of range                                                                     |
| (Appended) | JDBC\_VALUE\_TYPE\_CONVERSION\_FAILED   | Failed to convert value type                                                                  |
| (Appended) | JDBC\_UNWRAPPING\_NOT\_SUPPORTED        | Unwrapping interface not supported                                                            |
| (Appended) | JDBC\_ILLEGAL\_PARAMETER                | Illegal value: (argument name)                                                                |
| (Appended) | JDBC\_UNSUPPORTED\_PARAMETER\_VALUE     | Unsupported (parameter name)                                                                  |
| (Appended) | JDBC\_ILLEGAL\_STATE                    | Protocol error occurred                                                                       |
| (Appended) | JDBC\_INVALID\_CURSOR\_POSITION         | Invalid cursor position                                                                       |
| (Appended) | JDBC\_STATEMENT\_CATEGORY\_UNMATCHED    | Writable query specified for read only request Read only query specified for writable request |
| (Appended) | JDBC\_MESSAGE\_CORRUPTED                | Protocol error                                                                                |

When there is an error in the source generating the error and so on,
additional details may be added to the end of the error description
mentioned above.

## <span class="header-section-number">2.2</span> API detailed specifications

### <span class="header-section-number">2.2.1</span> Connection interface

Describes each method of the connection interface. Unless otherwise
stated, only the description for the case when connection has not been
closed is
included.

#### <span class="header-section-number">2.2.1.1</span> Transaction control

As for transaction control, which operates in automatic commitment mode,
commit/rollback is not supported. Note that a request for a commitment
or a rollback from applications which use transactions is ignored so
that the transaction control may be available even for these
applications. SQLFeatureNotSupportedException does not occur.

Transaction isolation level supports only TRANSACTION\_READ\_COMMITTED.
Other levels cannot be set.

**Methods that have differences with the JDBC
specification**

| Method                                 | Description            | Difference with JDBC specification                                                                                                       |
| -------------------------------------- | ---------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| void commit()                          | Commit                 | Ignore a commit request because the API has only an automatic commitment mode.                                                           |
| void rollback()                        | Rollback               | Ignore a rollback request because the API has only an automatic commitment mode.                                                         |
| void setAutoCommit(boolean autoCommit) | Set a commitment mode. | Mode setting is unavailable because the API has only an automatic commitment mode. Setting autoCommit is ignored and true is always set. |

**Partially unsupported
method**

| Method                                                                                                                | Description                        | Unsupported feature                                                                                                                                                                                                                                                     |
| --------------------------------------------------------------------------------------------------------------------- | ---------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Statement createStatement(int resultSetType, int resultSetConcurrency)                                                | Create a statement.                | resultSetType supports ResultSet.TYPE\_FORWARD\_ONLY only, resultSetConcurrency supports only ResultSet.CONCUR\_READ\_ONLY. For other values, SQLFeatureNotSupportedException will occur.                                                                               |
| Statement createStatement(int resultSetType, int resultSetConcurrency, int resultSetHoldability                       | Create a statement.                | resultSetType supports only ResultSet.TYPE\_FORWARD\_ONLY only, resultSetConcurrency supports ResultSet.CONCUR\_READ\_ONLY only, resultSetHoldability supports only ResultSet.CLOSE\_CURSORS\_AT\_COMMIT. For other values, SQLFeatureNotSupportedException will occur. |
| PreparedStatement prepareStatement(String sql, int resultSetType, int resultSetConcurrency)                           | Create a prepared statement.       | resultSetType supports ResultSet.TYPE\_FORWARD\_ONLY only, resultSetConcurrency supports only ResultSet.CONCUR\_READ\_ONLY. For other values, SQLFeatureNotSupportedException will occur.                                                                               |
| PreparedStatement prepareStatement(String sql, int resultSetType, int resultSetConcurrency, int resultSetHoldability) | Create a prepared statement.       | resultSetType supports only ResultSet.TYPE\_FORWARD\_ONLY only, resultSetConcurrency supports ResultSet.CONCUR\_READ\_ONLY only, resultSetHoldability supports only ResultSet.CLOSE\_CURSORS\_AT\_COMMIT. For other values, SQLFeatureNotSupportedException will occur. |
| void setTransactionIsolation(int level                                                                                | Set a transaction isolation level. | Argument "level" accepts only Connection.TRANSACTION\_READ\_COMMITTED. If any other value is set, SQLException will occur.                                                                                                                                              |

**Supported
method**

| Method                                         | Description                           |
| ---------------------------------------------- | ------------------------------------- |
| void close()                                   | Close connection.                     |
| Statement createStatement()                    | Create a statement.                   |
| boolean getAutoCommit()                        | Get commitment mode.                  |
| DatabaseMetaData getMetaData()                 | Get DatabaseMetaData.                 |
| int getTransactionIsolation()                  | Get the transaction isolation level.  |
| boolean isClosed()                             | Get whether the connection is closed. |
| PreparedStatement prepareStatement(String sql) | Create a prepared statement.          |

#### <span class="header-section-number">2.2.1.2</span> Setting and getting attributes

This section describes methods for setting and getting attributes other
than transaction control methods.

**Methods that have differences with the JDBC
specification**

| Method                             | Description                                       | Difference with JDBC specification    |
| ---------------------------------- | ------------------------------------------------- | ------------------------------------- |
| void setReadOnly(boolean readOnly) | Sets the read-only mode of the connection object. | Ignore readOnly and always set false. |

**Partially unsupported
method**

| Method                               | Description                                   | Unsupported feature                                                                                                                     |
| ------------------------------------ | --------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| void setHoldability(int holdability) | Set the holding function of ResultSet object. | Argument "holdability" accepts only ResultSet.CLOSE\_CURSORS\_AT\_COMMIT. For other values, SQLFeatureNotSupportedException will occur. |

**Supported
method**

| Method                       | Description                                             |
| ---------------------------- | ------------------------------------------------------- |
| int getHoldability()         | Get the holding function of the ResultSet object.       |
| boolean isReadOnly()         | Get whether the Connection object is in read-only mode. |
| boolean isValid(int timeout) | Get the state of connection.                            |

#### <span class="header-section-number">2.2.1.3</span> Unsupported function

Unsupported methods in the connection interface is listed below. When
these methods are executed, SQLFeatureNotSupportedException will occur.

  - Standard functions
    
      - CallableStatement prepareCall(String sql)

  - Optional functions
    
      - void abort(Executor executor)
      - Array createArrayOf(String typeName, Object\[\] elements)
      - Blob createBlob()
      - Clob createClob()
      - NClob createNClob()
      - SQLXML createSQLXML()
      - Struct createStruct(String typeName, Object\[\] attributes)
      - int getNetworkTimeout()
      - String getSchema()
      - Map\<String,Class\<?\>\> getTypeMap()
      - CallableStatement prepareCall(String sql, int resultSetType, int
        resultSetConcurrency)
      - CallableStatement prepareCall(String sql, int resultSetType, int
        resultSetConcurrency, int resultSetHoldability)
      - PreparedStatement prepareStatement(String sql, int
        autoGeneratedKeys)
      - PreparedStatement prepareStatement(String sql, int\[\]
        columnIndexes)
      - PreparedStatement prepareStatement(String sql, String\[\]
        columnNames)
      - void releaseSavepoint(Savepoint savepoint)
      - void rollback(Savepoint savepoint)
      - void setNetworkTimeout(Executor executor, int milliseconds)
      - void setSavepoint()
      - void setSchema(String schema)
      - void setTypeMap(Map\<String,Class\<?\>\>
map)

　

### <span class="header-section-number">2.2.2</span> DatabaseMetaData interface

This section describes DatabaseMetaData interface, which gets the
metadata of a
table.

#### <span class="header-section-number">2.2.2.1</span> Attribute that returns ResultSet

Among the methods that return ResultSet as the execution result in
DatabaseMetaData interface, the supported methods are as follows. The
methods that return ResultSets other than these are not
supported.

| Method                                                                                                        | Description                                |
| ------------------------------------------------------------------------------------------------------------- | ------------------------------------------ |
| ResultSet getColumns(String catalog, String schemaPattern, String tableNamePattern, String columnNamePattern) | Return the column information of a table.  |
| ResultSet getIndexInfo(String catalog, String schema, String table, boolean unique, boolean approximate)      | Return the index information of a table.   |
| ResultSet getPrimaryKeys(String catalog, String schema, String table)                                         | Return the row key information of a table. |
| ResultSet getTables(String catalog, String schemaPattern, String tableNamePattern, String\[\] types)          | Return the list of tables.                 |
| ResultSet getTableTypes()                                                                                     | Return the type of a table.                |
| ResultSet getTypeInfo()                                                                                       | Return the list of column data types.      |

Each of the above methods is explained
below.

##### <span class="header-section-number">2.2.2.1.1</span> DatabaseMetaData.getColumns

```java
ResultSet getColumns(String catalog, String schemaPattern, String tableNamePattern, String columnNamePattern)
```

  - Return the column information of the table that matches the pattern
    of the specified table name "tableNamePattern". The wildcard "%"
    specified in the pattern means to match 0 or more characters, and
    "\_" means to match any one character. When null is specified as
    tableNamePattern, all tables are targeted.

  - Other filter conditions catalog, schemaPattern, and
    columnNamePattern are ignored.

  - The column information of a view is not included.

  - The columns of execution result "ResultSet" are as follows.
    
    <table>
    <thead>
    <tr class="header">
    <th>Column name 　　</th>
    <th>Data type</th>
    <th>Value</th>
    </tr>
    </thead>
    <tbody>
    <tr class="odd">
    <td>TABLE_CAT</td>
    <td>String</td>
    <td>null</td>
    </tr>
    <tr class="even">
    <td>TABLE_SCHEM</td>
    <td>String</td>
    <td>null</td>
    </tr>
    <tr class="odd">
    <td>TABLE_NAME</td>
    <td>String</td>
    <td>Table name</td>
    </tr>
    <tr class="even">
    <td>COLUMN_NAME</td>
    <td>String</td>
    <td>Column name</td>
    </tr>
    <tr class="odd">
    <td>DATA_TYPE</td>
    <td>int</td>
    <td>Data type value of a column (see the table below)</td>
    </tr>
    <tr class="even">
    <td>TYPE_NAME</td>
    <td>String</td>
    <td>Data type name of a column (see the table below)</td>
    </tr>
    <tr class="odd">
    <td>COLUMN_SIZE</td>
    <td>int</td>
    <td>131072</td>
    </tr>
    <tr class="even">
    <td>BUFFER_LENGTH</td>
    <td>int</td>
    <td>2000000000</td>
    </tr>
    <tr class="odd">
    <td>DECIMAL_DIGITS</td>
    <td>int</td>
    <td>10</td>
    </tr>
    <tr class="even">
    <td>NUM_PREC_RADIX</td>
    <td>int</td>
    <td>10</td>
    </tr>
    <tr class="odd">
    <td>NULLABLE</td>
    <td>int</td>
    <td>If the column is PRIMARY KEY or has NOT NULL constraint, 0 (the value of a constant "DatabaseMetaData.columnNoNulls"),<br />
    otherwise, 1 (the value of a constant "DatabaseMetaData.columnNullable")</td>
    </tr>
    <tr class="even">
    <td>REMARKS</td>
    <td>String</td>
    <td>null</td>
    </tr>
    <tr class="odd">
    <td>COLUMN_DEF</td>
    <td>String</td>
    <td>null</td>
    </tr>
    <tr class="even">
    <td>SQL_DATA_TYPE</td>
    <td>int</td>
    <td>0</td>
    </tr>
    <tr class="odd">
    <td>SQL_DATETIME_SUB</td>
    <td>int</td>
    <td>0</td>
    </tr>
    <tr class="even">
    <td>CHAR_OCTET_LENGTH</td>
    <td>int</td>
    <td>2000000000</td>
    </tr>
    <tr class="odd">
    <td>ORDINAL_POSITION</td>
    <td>int</td>
    <td>The number of a column (serial number from 1)</td>
    </tr>
    <tr class="even">
    <td>IS_NULLABLE</td>
    <td>String</td>
    <td>NOT NULL constraint. If the column is PRIMARY KEY or has NOT NULL constraint, 'NO',<br />
    otherwise, 'YES'</td>
    </tr>
    <tr class="odd">
    <td>SCOPE_CATALOG</td>
    <td>String</td>
    <td>null</td>
    </tr>
    <tr class="even">
    <td>SCOPE_SCHEMA</td>
    <td>String</td>
    <td>null</td>
    </tr>
    <tr class="odd">
    <td>SCOPE_TABLE</td>
    <td>String</td>
    <td>null</td>
    </tr>
    <tr class="even">
    <td>SOURCE_DATA_TYPE</td>
    <td>short</td>
    <td>0</td>
    </tr>
    <tr class="odd">
    <td>IS_AUTOINCREMENT</td>
    <td>String</td>
    <td>'NO'</td>
    </tr>
    <tr class="even">
    <td>IS_GENERATEDCOLUMN</td>
    <td>String</td>
    <td>'NO'</td>
    </tr>
    </tbody>
    </table>

  - Return the combination of TYPE\_NAME and DATA\_TYPE value according
    to the data type of each
    column.
    
    | Data type of a column | Value of TYPE\_NAME | Value of DATA\_TYPE  |
    | --------------------- | ------------------- | -------------------- |
    | BOOL                  | 'BOOL'              | \-7 (Types.BIT)      |
    | STRING                | 'STRING'            | 12 (Types.VARCHAR)   |
    | BYTE                  | 'BYTE'              | \-6 (Types.TINYINT)  |
    | SHORT                 | 'SHORT'             | 5 (Types.SMALLINT)   |
    | INTEGER               | 'INTEGER'           | 4 (Types.INTEGER)    |
    | LONG                  | 'LONG'              | \-5 (Types.BIGINT)   |
    | FLOAT                 | 'FLOAT'             | 6 (Types.FLOAT)      |
    | DOUBLE                | 'DOUBLE'            | 8 (Types.DOUBLE)     |
    | TIMESTAMP             | 'TIMESTAMP'         | 93 (Types.TIMESTAMP) |
    | BLOB                  | 'BLOB'              | 2004 (Types.BLOB)    |
    | GEOMETRY              | 'GEOMETRY'          | 1111 (Types.OTHER)   |
    | BOOL ARRAY            | 'BOOL\_ARRAY'       | 1111 (Types.OTHER)   |
    | STRING ARRAY          | 'STRING\_ARRAY'     | 1111 (Types.OTHER)   |
    | BYTE ARRAY            | 'BYTE\_ARRAY'       | 1111 (Types.OTHER)   |
    | SHORT ARRAY           | 'SHORT\_ARRAY'      | 1111 (Types.OTHER)   |
    | INTEGER ARRAY         | 'INTEGER\_ARRAY'    | 1111 (Types.OTHER)   |
    | LONG ARRAY            | 'LONG\_ARRAY'       | 1111 (Types.OTHER)   |
    | FLOAT ARRAY           | 'FLOAT\_ARRAY'      | 1111 (Types.OTHER)   |
    | DOUBLE ARRAY          | 'DOUBLE\_ARRAY'     | 1111 (Types.OTHER)   |
    | TIMESTAMP ARRAY       | 'TIMESTAMP\_ARRAY'  | 1111 (Types.OTHER)   |
    

  - For GEOMETRY type and array type, the value will be returned if
    information of the table with these data types created by NoSQL
    interface is acquired. JDBC can not create tables with these data
    types.

　

##### <span class="header-section-number">2.2.2.1.2</span> DatabaseMetaData.getIndexInfo

```java
ResultSet getIndexInfo(String catalog, String schema, String table, boolean unique, boolean approximate)
```

  - Returns index information for the table that matches the specified
    table name "table". When the table of the specified name does not
    exist, null will be returned for the execution result "ResultSet".

  - Specify false for "unique". When the value for unique is other than
    false, null will be returned for the execution result "ResultSet".

  - Other filter conditions catalog, schema, and a parameter
    "approximate" are ignored.

  - The columns of execution result "ResultSet" are as
    follows.
    
    | Column name       | Data type | Value                                                                                                                                                                                     |
    | ----------------- | --------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
    | TABLE\_CAT        | String    | null                                                                                                                                                                                      |
    | TABLE\_SCHEM      | String    | null                                                                                                                                                                                      |
    | TABLE\_NAME       | String    | Table name                                                                                                                                                                                |
    | NON\_UNIQUE       | boolean   | true                                                                                                                                                                                      |
    | INDEX\_QUALIFIER  | String    | null                                                                                                                                                                                      |
    | INDEX\_NAME       | String    | Index name                                                                                                                                                                                |
    | TYPE              | short     | 2 (value of a constant "DatabaseMetaData.tableIndexHashed" representing a hash index) or 3 (value of a constant "DatabaseMetaData.tableIndexOther" representing an index other than hash) |
    | ORDINAL\_POSITION | short     | Start from 1.                                                                                                                                                                             |
    | COLUMN\_NAME      | String    | Column name                                                                                                                                                                               |
    | ASC\_OR\_DESC     | String    | null                                                                                                                                                                                      |
    | CARDINALITY       | long      | 0                                                                                                                                                                                         |
    | PAGES             | long      | 0                                                                                                                                                                                         |
    | FILTER\_CONDITION | String    | null                                                                                                                                                                                      |
    

　

##### <span class="header-section-number">2.2.2.1.3</span> DatabaseMetaData.getPrimaryKeys

```java
ResultSet getPrimaryKeys(String catalog, String schema, String table)
```

  - Returns row key information for the table that matches the specified
    table name "table". When the table of the specified name does not
    exist, null will be returned for the execution result "ResultSet".
    Provided that, when null is specified for table, information of all
    the tables for which the row key is set is returned.

  - Other filter conditions catalog and schema are ignored.

  - The columns of execution result "ResultSet" are as follows.
    
    | Column name  | Data type | Value       |
    | ------------ | --------- | ----------- |
    | TABLE\_CAT   | String    | null        |
    | TABLE\_SCHEM | String    | null        |
    | TABLE\_NAME  | String    | Table name  |
    | COLUMN\_NAME | String    | Column name |
    | KEY\_SEQ     | short     | 1           |
    | PK\_NAME     | String    | null        |
    

　

##### <span class="header-section-number">2.2.2.1.4</span> DatabaseMetaData.getTables

```java
ResultSet getTables(String catalog, String schemaPattern, String tableNamePattern, String[] types)
```

  - Return the information of the table that matches the pattern of the
    specified table name "tableNamePattern". The wildcard "%" specified
    in the pattern means to match 0 or more characters, and "\_" means
    to match any one character. When null is specified as
    tableNamePattern, all tables are targeted.

  - Specify null or an array of character strings for types. Specify
    "TABLE" or "VIEW" for the character string element. If types have no
    element that matches "TABLE" or "VIEW", null is always returned.
    Character string elements inside types are not case sensitive.
    (Types is not a value that represents a collection, type of a table,
    or a time series container.)

  - Other filter conditions catalog and schemaPattern are ignored.

  - The columns of execution result "ResultSet" are as follows.
    
    | Column name                  | Data type | Value             |
    | ---------------------------- | --------- | ----------------- |
    | TABLE\_CAT                   | String    | null              |
    | TABLE\_SCHEM                 | String    | null              |
    | TABLE\_NAME                  | String    | Table name        |
    | TABLE\_TYPE                  | String    | 'TABLE' or 'VIEW' |
    | REMARKS                      | String    | null              |
    | TYPE\_CAT                    | String    | null              |
    | TYPE\_SCHEM                  | String    | null              |
    | TYPE\_NAME                   | String    | null              |
    | SELF\_REFERENCING\_COL\_NAME | String    | null              |
    | REF\_GENERATION              | String    | null              |
    

　

##### <span class="header-section-number">2.2.2.1.5</span> DatabaseMetaData.getTableTypes

```java
ResultSet getTableTypes()
```

  - Return the type of a table. The returned result has only one column
    'TABLE\_TYPE with the value 'TABLE' or 'VIEW' stored '.

  - The columns of execution result "ResultSet" are as follows.
    
    | Column name | Data type | Value             |
    | ----------- | --------- | ----------------- |
    | TABLE\_TYPE | String    | 'TABLE' or 'VIEW' |
    

　

##### <span class="header-section-number">2.2.2.1.6</span> DatabaseMetaData.getTypeInfo()

```java
ResultSet getTypeInfo()
```

  - Return the list of column data types.

  - The information common to all data types and the information of each
    data type are as
    follows.
    
    | Column name         | Data type | Value                                                                                                                 |
    | ------------------- | --------- | --------------------------------------------------------------------------------------------------------------------- |
    | TYPE\_NAME          | String    | Name of data type (see the table below)                                                                               |
    | DATA\_TYPE          | int       | Value of data type (see the table below)                                                                              |
    | PRECISION           | int       | 0                                                                                                                     |
    | LITERAL\_PREFIX     | String    | null                                                                                                                  |
    | LITERAL\_SUFFIX     | String    | null                                                                                                                  |
    | CREATE\_PARAMS      | String    | null                                                                                                                  |
    | NULLABLE            | short     | 1 (Value of a constant DatabaseMetaData.typeNullable representing that a null value is allowed for this data type)    |
    | CASE\_SENSITIVE     | boolean   | true                                                                                                                  |
    | SEARCHABLE          | short     | 3 (Value of a constant DatabaseMetaData.typeSearchable indicating that this data type can be used in the WHERE clause |
    | UNSIGNED\_ATTRIBUTE | boolean   | false                                                                                                                 |
    | FIXED\_PREC\_SCALE  | boolean   | false                                                                                                                 |
    | AUTO\_INCREMENT     | boolean   | false                                                                                                                 |
    | LOCAL\_TYPE\_NAME   | String    | null                                                                                                                  |
    | MINIMUM\_SCALE      | short     | 0                                                                                                                     |
    | MAXIMUM\_SCALE      | short     | 0                                                                                                                     |
    | SQL\_DATA\_TYPE     | int       | 0                                                                                                                     |
    | SQL\_DATETIME\_SUB  | int       | 0                                                                                                                     |
    | NUM\_PREC\_RADIX    | int       | 10                                                                                                                    |
    

  - For columns TYPE\_NAME and DATA\_TYPE, all values of the following
    combinations are returned
    
    | Value of TYPE\_NAME | Value of DATA\_TYPE  |
    | ------------------- | -------------------- |
    | 'BOOL'              | \-7 (Types.BIT)      |
    | 'STRING'            | 12 (Types.VARCHAR)   |
    | 'BYTE'              | \-6 (Types.TINYINT)  |
    | 'SHORT'             | 5 (Types.SMALLINT)   |
    | 'INTEGER'           | 4 (Types.INTEGER)    |
    | 'LONG'              | \-5 (Types.BIGINT)   |
    | 'FLOAT'             | 6 (Types.FLOAT)      |
    | 'DOUBLE'            | 8 (Types.DOUBLE)     |
    | 'TIMESTAMP'         | 93 (Types.TIMESTAMP) |
    | 'BLOB'              | 2004 (Types.BLOB)    |
    | 'UNKNOWN'           | 0 (Types.NULL)       |
    

　

#### <span class="header-section-number">2.2.2.2</span> Method that returns a value

Among the methods of DatabaseMetaData interface, the execution results
are listed about the method that returns simple value such as int type
and String type as execution
result.

| Method                                                  | Result                                                                                |
| ------------------------------------------------------- | ------------------------------------------------------------------------------------- |
| allProceduresAreCallable()                              | false                                                                                 |
| allTablesAreSelectable()                                | true                                                                                  |
| autoCommitFailureClosesAllResultSets()                  | false                                                                                 |
| dataDefinitionCausesTransactionCommit()                 | false                                                                                 |
| dataDefinitionIgnoredInTransactions()                   | true                                                                                  |
| deletesAreDetected(type)                                | false                                                                                 |
| doesMaxRowSizeIncludeBlobs()                            | false                                                                                 |
| generatedKeyAlwaysReturned()                            | false                                                                                 |
| getCatalogSeparator()                                   | "."                                                                                   |
| getCatalogTerm()                                        | "catalog"                                                                             |
| getDefaultTransactionIsolation()                        | TRANSACTION\_READ\_COMMITTED                                                          |
| getExtraNameCharacters()                                | . - / = (unordered)                                                                   |
| getIdentifierQuoteString()                              | "                                                                                     |
| getMaxBinaryLiteralLength()                             | 0                                                                                     |
| getMaxCatalogNameLength()                               | 0                                                                                     |
| getMaxCharLiteralLength()                               | 0                                                                                     |
| getMaxColumnNameLength()                                | 0                                                                                     |
| getMaxColumnsInGroupBy()                                | 0                                                                                     |
| getMaxColumnsInIndex()                                  | 0                                                                                     |
| getMaxColumnsInOrderBy()                                | 0                                                                                     |
| getMaxColumnsInSelect()                                 | 0                                                                                     |
| getMaxColumnsInTable()                                  | 0                                                                                     |
| getMaxConnections()                                     | 0                                                                                     |
| getMaxCursorNameLength()                                | 0                                                                                     |
| getMaxIndexLength()                                     | 0                                                                                     |
| getMaxSchemaNameLength()                                | 0                                                                                     |
| getMaxProcedureNameLength()                             | 0                                                                                     |
| getMaxRowSize()                                         | 0                                                                                     |
| getMaxStatementLength()                                 | 0                                                                                     |
| getMaxStatements()                                      | 0                                                                                     |
| getMaxTableNameLength()                                 | 0                                                                                     |
| getMaxTablesInSelect()                                  | 0                                                                                     |
| getMaxUserNameLength()                                  | 0                                                                                     |
| getProcedureTerm()                                      | "procedure"                                                                           |
| getResultSetHoldability()                               | CLOSE\_CURSORS\_AT\_COMMIT                                                            |
| getRowIdLifetime()                                      | true                                                                                  |
| getSchemaTerm()                                         | "schema"                                                                              |
| getSearchStringEscape()                                 | "                                                                                     |
| getSQLKeywords()                                        | ""                                                                                    |
| getSQLStateType()                                       | sqlStateSQL99                                                                         |
| getStringFunctions()                                    | ""                                                                                    |
| getSystemFunctions()                                    | ""                                                                                    |
| getURL()                                                | null                                                                                  |
| getUserName()                                           | (User name)                                                                           |
| insertsAreDetected(type)                                | false                                                                                 |
| isCatalogAtStart()                                      | true                                                                                  |
| isReadOnly()                                            | false                                                                                 |
| locatorsUpdateCopy()                                    | false                                                                                 |
| nullPlusNonNullIsNull()                                 | true                                                                                  |
| nullsAreSortedAtEnd()                                   | false                                                                                 |
| nullsAreSortedAtStart()                                 | false                                                                                 |
| nullsAreSortedHigh()                                    | true                                                                                  |
| nullsAreSortedLow()                                     | false                                                                                 |
| othersDeletesAreVisible(type)                           | false                                                                                 |
| othersInsertsAreVisible(type)                           | false                                                                                 |
| othersUpdatesAreVisible(type)                           | false                                                                                 |
| ownDeletesAreVisible(type)                              | false                                                                                 |
| ownInsertsAreVisible(type)                              | false                                                                                 |
| ownUpdatesAreVisible(type)                              | false                                                                                 |
| storesLowerCaseIdentifiers()                            | false                                                                                 |
| storesLowerCaseQuotedIdentifiers()                      | false                                                                                 |
| storesMixedCaseIdentifiers()                            | true                                                                                  |
| storesMixedCaseQuotedIdentifiers()                      | false                                                                                 |
| storesUpperCaseIdentifiers()                            | false                                                                                 |
| storesUpperCaseQuotedIdentifiers()                      | false                                                                                 |
| supportsAlterTableWithAddColumn()                       | false                                                                                 |
| supportsAlterTableWithDropColumn()                      | false                                                                                 |
| supportsANSI92EntryLevelSQL()                           | false                                                                                 |
| supportsANSI92FullSQL()                                 | false                                                                                 |
| supportsANSI92IntermediateSQL()                         | false                                                                                 |
| supportsBatchUpdates()                                  | false                                                                                 |
| supportsCatalogsInDataManipulation()                    | false                                                                                 |
| supportsCatalogsInIndexDefinitions()                    | false                                                                                 |
| supportsCatalogsInPrivilegeDefinitions()                | false                                                                                 |
| supportsCatalogsInProcedureCalls()                      | false                                                                                 |
| supportsCatalogsInTableDefinitions()                    | false                                                                                 |
| supportsColumnAliasing()                                | true                                                                                  |
| supportsConvert()                                       | false                                                                                 |
| supportsConvert(fromType, toType)                       | false                                                                                 |
| supportsCoreSQLGrammar()                                | true                                                                                  |
| supportsCorrelatedSubqueries()                          | true                                                                                  |
| supportsDataDefinitionAndDataManipulationTransactions() | false                                                                                 |
| supportsDataManipulationTransactionsOnly()              | false                                                                                 |
| supportsDifferentTableCorrelationNames()                | false                                                                                 |
| supportsExpressionsInOrderBy()                          | true                                                                                  |
| supportsExtendedSQLGrammar()                            | false                                                                                 |
| supportsFullOuterJoins()                                | false                                                                                 |
| supportsGetGeneratedKeys()                              | false                                                                                 |
| supportsGroupBy()                                       | true                                                                                  |
| supportsGroupByBeyondSelect()                           | true                                                                                  |
| supportsGroupByUnrelated()                              | true                                                                                  |
| supportsIntegrityEnhancementFacility()                  | false                                                                                 |
| supportsLikeEscapeClause()                              | true                                                                                  |
| supportsLimitedOuterJoins()                             | true                                                                                  |
| supportsMinimumSQLGrammar()                             | true                                                                                  |
| supportsMixedCaseIdentifiers()                          | false                                                                                 |
| supportsMixedCaseQuotedIdentifiers()                    | true                                                                                  |
| supportsMultipleOpenResults()                           | false                                                                                 |
| supportsMultipleResultSets()                            | false                                                                                 |
| supportsMultipleTransactions()                          | false                                                                                 |
| supportsNamedParameters()                               | false                                                                                 |
| supportsNonNullableColumns()                            | true                                                                                  |
| supportsOpenCursorsAcrossCommit()                       | false                                                                                 |
| supportsOpenCursorsAcrossRollback()                     | false                                                                                 |
| supportsOpenStatementsAcrossCommit()                    | false                                                                                 |
| supportsOpenStatementsAcrossRollback()                  | false                                                                                 |
| supportsOrderByUnrelated()                              | true                                                                                  |
| supportsOuterJoins()                                    | true                                                                                  |
| supportsPositionedDelete()                              | false                                                                                 |
| supportsPositionedUpdate()                              | false                                                                                 |
| supportsResultSetConcurrency(type, concurrency)         | Only in case of the type is TYPE\_FORWARD\_ONLY and concurrency is CONCUR\_READ\_ONLY |
| supportsResultSetHoldability(holdability)               | Only in case of the CLOSE\_CURSORS\_AT\_COMMIT                                        |
| supportsResultSetType()                                 | Only in case of the TYPE\_FORWARD\_ONLY                                               |
| supportsSavepoints()                                    | false                                                                                 |
| supportsSchemasInDataManipulation()                     | false                                                                                 |
| supportsSchemasInIndexDefinitions()                     | false                                                                                 |
| supportsSchemasInPrivilegeDefinitions()                 | false                                                                                 |
| supportsSchemasInProcedureCalls()                       | false                                                                                 |
| supportsSchemasInTableDefinitions()                     | false                                                                                 |
| supportsSelectForUpdate()                               | false                                                                                 |
| supportsStatementPooling()                              | false                                                                                 |
| supportsStoredFunctionsUsingCallSyntax()                | false                                                                                 |
| supportsStoredProcedures()                              | false                                                                                 |
| supportsSubqueriesInComparisons()                       | false                                                                                 |
| supportsSubqueriesInExists()                            | true                                                                                  |
| supportsSubqueriesInIns()                               | true                                                                                  |
| supportsSubqueriesInQuantifieds()                       | false                                                                                 |
| supportsTableCorrelationNames()                         | false                                                                                 |
| supportsTransactionIsolationLevel(level)                | Only in case of the TRANSACTION\_READ\_COMMITTED                                      |
| supportsTransactions()                                  | true                                                                                  |
| supportsUnion()                                         | true                                                                                  |
| supportsUnionAll()                                      | true                                                                                  |
| updatesAreDetected(type)                                | false                                                                                 |
| usesLocalFilePerTable()                                 | false                                                                                 |
| usesLocalFiles()                                        | false                                                                                 |

#### <span class="header-section-number">2.2.2.3</span> Unsupported methods

Among the methods of DatabaseMetaData interface, the unsupported methods
are listed below. When these methods are executed,
SQLFeatureNotSupportedException will not occur and the following results
will be
returned.

| Method                                                                                                                                                       | Result          |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------ | --------------- |
| ResultSet getAttributes(String catalog, String schemaPattern, String typeNamePattern, String attributeNamePattern)                                           | Empty ResultSet |
| ResultSet getBestRowIdentifier(String catalog, String schema, String table, int scope, boolean nullable)                                                     | Empty ResultSet |
| ResultSet getCatalogs()                                                                                                                                      | Empty ResultSet |
| ResultSet getClientInfoProperties()                                                                                                                          | Empty ResultSet |
| ResultSet getColumnPrivileges(String catalog, String schema, String table, String columnNamePattern)                                                         | Empty ResultSet |
| ResultSet getCrossReference(String parentCatalog, String parentSchema, String parentTable, String foreignCatalog, String foreignSchema, String foreignTable) | Empty ResultSet |
| ResultSet getExportedKeys(String catalog, String schema, String table)                                                                                       | Empty ResultSet |
| ResultSet getFunctionColumns(String catalog, String schemaPattern, String functionNamePattern, String columnNamePattern)                                     | Empty ResultSet |
| ResultSet getFunctions(String catalog, String schemaPattern, String functionNamePattern)                                                                     | Empty ResultSet |
| ResultSet getImportedKeys(String catalog, String schema, String table)                                                                                       | Empty ResultSet |
| ResultSet getProcedureColumns(String catalog, String schemaPattern, String procedureNamePattern, String columnNamePattern)                                   | Empty ResultSet |
| ResultSet getProcedures(String catalog, String schemaPattern, String procedureNamePattern)                                                                   | Empty ResultSet |
| ResultSet getPseudoColumns(String catalog, String schemaPattern, String tableNamePattern, String columnNamePattern)                                          | Empty ResultSet |
| ResultSet getSchemas()                                                                                                                                       | Empty ResultSet |
| ResultSet getSchemas(String catalog, String schemaPattern)                                                                                                   | Empty ResultSet |
| ResultSet getSuperTables(String catalog, String schemaPattern, String tableNamePattern)                                                                      | Empty ResultSet |
| ResultSet getSuperTypes(String catalog, String schemaPattern, String typeNamePattern)                                                                        | Empty ResultSet |
| ResultSet getTablePrivileges(String catalog, String schemaPattern, String tableNamePattern)                                                                  | Empty ResultSet |
| ResultSet getUDTs(String catalog, String schemaPattern, String typeNamePattern, int\[\] types)                                                               | Empty ResultSet |
| ResultSet getVersionColumns(String catalog, String schema, String table)                                                                                     | Empty ResultSet |

　

### <span class="header-section-number">2.2.3</span> Statement interface

#### <span class="header-section-number">2.2.3.1</span> Set/get fetch size

Only check the specified value.

When checking this value, check that the number of rows obtained by
getMaxRows() of the statement is not exceeded as well. Limits related to
this value are stated only in the JDBC specifications from JDBC4.0 or
earlier. However, unlike the previous JDBC specifications, this excludes
the case in which the result of getMaxRows() has been set to the default
value
0.

#### <span class="header-section-number">2.2.3.2</span> Set/get fetch direction

Only FETCH\_FORWARD is supported for the fetch direction. A SQLException
occurs if FETCH\_FORWARD is not
specified.

#### <span class="header-section-number">2.2.3.3</span> Unsupported function

  - Batch instructions
      - Batch instructions are unsupported. When using the following
        functions, the same error occurs as when using unsupported
        standard functions.
          - addBatch(sql)
          - clearBatch()
          - executeBatch()
  - Standard functions
      - The following methods are ignored when invoked. This behavior is
        different from the JDBC specifications.
          - setEscapeProcessing(enable)
  - Optional functions
      - A SQLFeatureNotSupportedException occurs when the method below
        is invoked.
          - closeOnCompletion()
          - execute(sql, autoGeneratedKeys)
          - execute(sql, columnIndexes)
          - execute(sql, columnNames)
          - executeUpdate(sql, autoGeneratedKeys)
          - executeUpdate(sql, columnIndexes)
          - executeUpdate(sql,
columnNames)
          - getGeneratedKeys()
          - getMoreResults(current)
          - isCloseOnCompletion()

　

### <span class="header-section-number">2.2.4</span> PreparedStatement interface

#### <span class="header-section-number">2.2.4.1</span> Set/get parameter

The following methods are supported. A SQLException occurs when invoking
the query execution API like executeQuery without setting all
parameters.

  - clearParameters()
  - getMetaData()
  - getParameterMetaData()
  - setBinaryStream(int parameterIndex, InputStream x)
      - setBinaryStream (including overload), on the client side, may
        require memory that is several times that of the input data. If
        the memory becomes insufficient during execution, adjust the
        heap memory size when starting the JVM.
  - setBinaryStream(int parameterIndex, InputStream x, int length)
  - setBinaryStream(int parameterIndex, InputStream x, long length)
  - setBlob(int parameterIndex, Blob x)
      - setBinaryStream (including overload), on the client side, may
        require memory that is several times that of the input data. If
        the memory becomes insufficient during execution, adjust the
        heap memory size when starting the JVM.
  - setBlob(int parameterIndex, InputStream inputStream)
  - setBlob(int parameterIndex, InputStream inputStream, long length)
  - setBoolean(int parameterIndex, boolean x)
  - setByte(int parameterIndex, byte x)
  - setDate(int parameterIndex, Date x)
  - setDouble(int parameterIndex, double x)
  - setFloat(int parameterIndex, float x)
  - setInt(int parameterIndex, int x)
  - setLong(int parameterIndex, long x)
  - setObject(int parameterIndex, Object x)
      - The value set for TIMESTAMP accepts an object of a subclass of
        java.util.Date.
  - setShort(int parameterIndex, short x)
  - setString(int parameterIndex, String x)
  - setTime(int parameterIndex, Time x)
  - setTimestamp(int parameterIndex, Timestamp x)

#### <span class="header-section-number">2.2.4.2</span> SQL execution

The following methods are
supported.

  - execute()
  - executeQuery()
  - executeUpdate()

#### <span class="header-section-number">2.2.4.3</span> Unsupported function

  - Standard functions
      - A SQLFeatureNotSupportedException occurs when the method below
        is invoked. This behavior is different from the JDBC
        specifications.
          - addBatch()
          - setBigDecimal(int parameterIndex, BigDecimal x)
          - setDate(int parameterIndex, Date x, Calendar cal)
          - setTime(int parameterIndex, Time x, Calendar cal)
          - setTimestamp(int parameterIndex, Timestamp x, Calendar cal)
  - Optional functions
      - A SQLFeatureNotSupportedException occurs when the method below
        is invoked. All overloads for which the argument has been
        omitted are not supported.
          - setArray
          - setAsciiStream
          - setBytes
          - setCharacterStream
          - setClob
          - setNCharacterStream
          - setNClob
          - setNString
          - setNull
          - setObject(int parameterIndex, Object x, int targetSqlType)
          - setObject(int parameterIndex, Object x, int targetSqlType,
            int
scaleOrLength)
          - setRef
          - setRowId
          - setSQLXML
          - setUnicodeStream
          - setURL

　

### <span class="header-section-number">2.2.5</span> ParameterMetaData interface

This section describes the ParameterMetaData interface which gets
PreparedStatement metadata.

All methods in the JDBC specification are supported but the methods
below will always return a fixed value regardless of the value of
argument param.

| Method                                 | Result      |
| -------------------------------------- | ----------- |
| int getParameterType(int param)        | Types.OTHER |
| String getParameterTypeName(int param) | "UNKNOWN"   |
| int getPrecision(int param)            | 0           |
| int getScale(int param)                | 0           |
| boolean isSigned(int param)            | false       |

　

### <span class="header-section-number">2.2.6</span> ResultSet interface

#### <span class="header-section-number">2.2.6.1</span> Set/get fetch size

Only the specified value is checked and configuration changes will not
affect the actual fetch process. When checking the value, check that the
number of rows obtained by getMaxRows() of the statement in the source
generating the target ResultSet is not exceeded as well. This limit is
stated only in the JDBC specifications from JDBC4.0 or earlier. However,
unlike the previous JDBC specifications, this excludes the case in which
the result of getMaxRows() has been set to the default value 0. Actual
fetch process is not affected but the revised setting can be
acquired.

#### <span class="header-section-number">2.2.6.2</span> Set/get fetch direction

Only FETCH\_FORWARD is supported for the fetch direction. A SQLException
occurs if FETCH\_FORWARD is not specified. This behavior is different
from the JDBC specifications.

#### <span class="header-section-number">2.2.6.3</span> Get cursor data

The following cursor-related methods are supported.

  - isAfterLast()
  - isBeforeFirst()
  - isFirst()
  - isLast()
  - next()

Since the only fetch direction supported is FETCH\_FORWARD, when the
following method is invoked, a SQLException caused by a command being
invoked against a FETCH\_FORWARD type ResultSet will
occur.

  - absolute(row)
  - afterLast()
  - beforeFirst()
  - first()
  - last()
  - previous()
  - relative(rows)

#### <span class="header-section-number">2.2.6.4</span> Management of warnings

As warnings will not be recorded, the actions to manage warnings are
therefore as follows.

| Method          | Behavior               |
| --------------- | ---------------------- |
| getWarnings()   | null                   |
| clearWarnings() | Warnings are not clear |

#### <span class="header-section-number">2.2.6.5</span> Attribute that returns fixed value

The support status of a method to return a fixed value all the time
while the ResultSet remains open is as follows.

| Method           | Result              |
| ---------------- | ------------------- |
| getCursorName()  | null                |
| getType()        | TYPE\_FORWARD\_ONLY |
| getConcurrency() | CONCUR\_READ\_ONLY  |
| getMetaData()    | (JDBC-compliant)    |
| getStatement()   | (JDBC-compliant)    |

#### <span class="header-section-number">2.2.6.6</span> Data type conversion

When getting the value of a specified column, if the data type
maintained by the ResultSet differs from the requested data type, data
type conversion will be attempted for the following combinations
only.

| The Java type of the destination | BOOL | INTEGRAL \*1 | FLOATING \*2 | TIMESTAMP | STRING | BLOB  |
| -------------------------------- | ---- | ------------ | ------------ | --------- | ------ | ----- |
| boolean                          | ✓    | ✓ \*3        |              |           | ✓ \*4  |       |
| byte                             | ✓    | ✓            | ✓            |           | ✓      |       |
| short                            | ✓    | ✓            | ✓            |           | ✓      |       |
| int                              | ✓    | ✓            | ✓            |           | ✓      |       |
| long                             | ✓    | ✓            | ✓            |           | ✓      |       |
| float                            |      | ✓            | ✓            |           | ✓      |       |
| double                           |      | ✓            | ✓            |           | ✓      |       |
| byte\[\]                         | ✓    | ✓            | ✓            |           | ✓      |       |
| java.sql.Date                    |      |              |              | ✓         | ✓ \*5  |       |
| Time                             |      |              |              | ✓         | ✓ \*5  |       |
| Timestamp                        |      |              |              | ✓         | ✓ \*5  |       |
| String                           | ✓    | ✓            | ✓            | ✓ \*6     | ✓      | ✓ \*7 |
| Blob                             |      |              |              |           | ✓ \*7  | ✓     |
| Object                           | ✓    | ✓            | ✓            | ✓         | ✓      | ✓     |

  - (\*1). INTEGRAL: Indicates one of BYTE/SHORT/INTEGER/LONG
  - (\*2). FLOATING: Indicates one of FLOAT/DOUBLEFLOATING
  - (\*3). Convert to false if 0 and to true if not 0.
  - (\*4). Convert to false if "false" and to true if "true". ASCII
    letters are case insensitive. Other letters can not be converted and
    cause an error.
  - (\*5). Convert the time of a string expression according to the
    following rules.
      - Acceptable expressions expressed in a pattern string like
        java.command.SimpleDateFormat are as follows, except for the
        time zone.
          - yyyy-MM-dd'T'HH:mm:ss.SSS
          - yyyy-MM-dd'T'HH:mm:ss
          - yyyy-MM-dd HH:mm:ss.SSS
          - yyyy-MM-dd HH:mm:ss
          - yyyy-MM-dd
          - HH:mm:ss.SSS
          - HH:mm:ss
      - If a setting value for the time zone is contained in the string,
        the value is adopted. Otherwise, if the time zone is specified
        in the argument java.util.Calendar of a API such as
        ResultSet\#getTimeStamp(), the content is refered to. Still
        otherwise, the time zone specified at the time of connection is
        checked, and if none is specified, UTC is adopted. Besides
        expressions that can be interpreted by a
        java.command.SimpleDateFormat "z" or "Z" pattern, "Z"
        expressions indicating that the time is UTC will be accepted as
        a timezone string.
  - (\*6). The time zone information specified at the time of connection
    will be used. If not specified, UTC will be used.
  - (\*7). Convert strings and BLOB to each other by treating it as
    hexadecimal binary representation. ASCII letters are case
    insensitive. Other letters can not be converted and cause an error.

#### <span class="header-section-number">2.2.6.7</span> Get column value

The column value can be acquired using a method that corresponds to the
data type of the supported data type conversion address. Both column
label and column index are supported as methods to specify a column.
Besides this, the following functions can be used.

  - getBinaryStream
      - Equivalent to the data type conversion result in byte\[\]
  - wasNull
      - JDBC-compliant

#### <span class="header-section-number">2.2.6.8</span> Error processing

  - Invalid column index
      - If an invalid column index is specified in an attempt to get the
        value, a SQLException due to a
        JDBC\_COLUMN\_INDEX\_OUT\_OF\_RANGE error will occur.
  - Data type conversion error
      - If data type conversion failed, a SQLException due to a
        JDBC\_VALUE\_TYPE\_CONVERSION\_FAILED error will
occur.

#### <span class="header-section-number">2.2.6.9</span> Unsupported function

The following optional functions are not supported. All overloads for
which the argument has been omitted are not supported.

  - cancelRowUpdates()
  - getArray
  - getAsciiStream
  - getBigDecimal
  - getClob
  - getNClob
  - getNCharacterStream
  - getNString
  - getObject(columnIndex, map)
  - getObject(columnLabel, map)
  - getObject(columnIndex, type)
  - getObject(columnLabel, type)
  - getRef
  - getRow()
  - getRowId
  - getSQLXML
  - getUnicodeStream
  - getURL
  - moveToInsertRow()
  - moveToCurrentRow()
  - refreshRow()
  - rowInserted()
  - rowDeleted()
  - rowUpdated()
  - All methods starting with insert
  - All methods starting with update
  - All methods starting with
delete

　

### <span class="header-section-number">2.2.7</span> ResultSetMetaData interface

This section describes the ResultSetMetaData interface which gets the
search result ResultSet metadata.

For all the methods in the JDBC specification of the ResultSetMetaData
interface, the contents and the execution results of each method are
described under the following classification.

  - Methods which return the data type of a column
  - Methods other than the above
  - Unsupported
methods

#### <span class="header-section-number">2.2.7.1</span> Data type of column

ResultSetMetaData interface has a method that returns the column data
type of the search result
ResultSet.

| Method                                | Description                                               |
| ------------------------------------- | --------------------------------------------------------- |
| String getColumnClassName(int column) | Returns the class name of the specified column data type. |
| int getColumnType(int column)         | Return the value of the specified column data type.       |
| String getColumnTypeName(int column)  | Return the name of the specified column data type.        |

The correspondence between the column data type and the value of the
execution result of each method is shown
below.

| Data type of a column                                     | getColumnClassName  | getColumnType   | getColumnTypeName |
| --------------------------------------------------------- | ------------------- | --------------- | ----------------- |
| BOOL                                                      | "java.lang.Boolean" | Types.BIT       | "BOOL"            |
| STRING                                                    | "java.lang.String"  | Types.VARCHAR   | "STRING"          |
| BYTE                                                      | "java.lang.Byte"    | Types.TINYINT   | "BYTE"            |
| SHORT                                                     | "java.lang.Short"   | Types.SMALLINT  | "SHORT"           |
| INTEGER                                                   | "java.lang.Integer" | Types.INTEGER   | "INTEGER"         |
| LONG                                                      | "java.lang.Long"    | Types.BIGINT    | "LONG"            |
| FLOAT                                                     | "java.lang.Float"   | Types.FLOAT     | "FLOAT"           |
| DOUBLE                                                    | "java.lang.Double"  | Types.DOUBLE    | "DOUBLE"          |
| TIMESTAMP                                                 | "java.util.Date"    | Types.TIMESTAMP | "TIMESTAMP"       |
| BLOB                                                      | "java.sql.Blob"     | Types.BLOB      | "BLOB"            |
| GEOMETRY                                                  | "java.lang.Object"  | Types.OTHER     | "UNKNOWN"         |
| ARRAY                                                     | "java.lang.Object"  | Types.OTHER     | "UNKNOWN"         |
| When the data type of a column cannot be identified (\*1) | "java.lang.Object"  | Types.OTHER     | "UNKNOWN"         |

\[Memo\]

  - (\*1) For example, in the case of ResultSet obtained by executing
    "SELECT NULL"
  - For GEOMETRY type and array type, the value will be returned if the
    table with these data types created by NoSQL interface is searched.
    JDBC can not create tables with these data
types.

#### <span class="header-section-number">2.2.7.2</span> Attribute that returns a value

The result of executing the method other than returning the data type of
the column in the ResultSetMetaData interface is shown
below.

| Method                                   | Result                                                                                                                                                                     |
| ---------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| String getCatalogName(int column)        | ""                                                                                                                                                                         |
| int getColumnCount()                     | The number of columns                                                                                                                                                      |
| int getColumnDisplaySize(int column)     | 131072                                                                                                                                                                     |
| String getColumnLabel(int column)        | The label name of a column                                                                                                                                                 |
| String getColumnName(int column)         | The name of a column                                                                                                                                                       |
| int getPrecision(int column)             | 0                                                                                                                                                                          |
| int getScale(int column)                 | 0                                                                                                                                                                          |
| String getSchemaName(int column)         | ""                                                                                                                                                                         |
| String getTableName(int column)          | ""                                                                                                                                                                         |
| boolean isAutoIncrement(int column)      | false                                                                                                                                                                      |
| boolean isCaseSensitive(int column)      | true                                                                                                                                                                       |
| boolean isCurrency(int column)           | false                                                                                                                                                                      |
| boolean isDefinitelyWritable(int column) | true                                                                                                                                                                       |
| int isNullable(int column)               | The constant ResultSetMetaData.columnNullable(=1) that allows NULL values for the column, or the constant columnNoNulls(=0) that does not allow NULL values for the column |
| boolean isReadOnly(int column)           | false                                                                                                                                                                      |
| boolean isSearchable(int column)         | true                                                                                                                                                                       |
| boolean isSigned(int column)             | false                                                                                                                                                                      |
| boolean isWritable(int column)           | true                                                                                                                                                                       |

#### <span class="header-section-number">2.2.7.3</span> Unsupported function

There are no unsupported methods (methods that cause
SQLFeatureNotSupportedException) in the ResultSetMetaData interface.

　

# <span class="header-section-number">3</span> Sample

A JDBC sample programs is given below.

```java
// Execute Sample 2 before running this program. 
package test;

import java.sql.*;

public class SampleJDBC {
    public static void main(String[] args) throws SQLException {
        if (args.length != 5) {
            System.err.println(
                "usage: java SampleJDBC (multicastAddress) (port) (clusterName) (user) (password)");
            System.exit(1);
        }

        // url format "jdbc:gs://(multicastAddress):(portNo)/(clusterName)"
        String url = "jdbc:gs://" + args[0] + ":" + args[1] + "/" + args[2];
        String user = args[3];
        String password = args[4];

        System.out.println("DB Connection Start");

        // Connection to a GridDB cluster
        Connection con = DriverManager.getConnection(url, user, password);
        try {
            System.out.println("Start");
            Statement st = con.createStatement();
            ResultSet rs = st.executeQuery("SELECT * FROM point01");
            ResultSetMetaData md = rs.getMetaData();
            while (rs.next()) {
                for (int i = 0; i < md.getColumnCount(); i++) {
                    System.out.print(rs.getString(i + 1) + "|");
                }
                System.out.println("");
            }
            rs.close();
            System.out.println("End");
            st.close();
        } finally {
            System.out.println("DB Connection Close");
            con.close();
        }
    }
}
```
