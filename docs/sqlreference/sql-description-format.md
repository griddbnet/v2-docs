# SQL description format

This chapter shows the descriptive format of the SQL that can be used in the NewSQL interface.

## Usable operations

Besides the SELECT command, DDL command (Data Definition Language) such as CREATE TABLE, and INSERT/DELETE are also supported. See [SQL commands supported by GridDB](#sql_commands_supported_by_griddb_ae) for details.

---
## Data types

<a id="data_types_used_in_data_storage"></a>
### Data types used in data storage

The data types used for data storage in the NewSQL interface are shown in Table 1. These data type names can be specified as a column data type when creating a table.

| Data types     | Description                                               |
|-------------|--------------------------------------------------------|
| BOOL      | true/false                                             |
| BYTE      | Integer value from -2<sup>7</sup> to 2<sup>7</sup>-1 (8 bit)     |
| SHORT     | Integer value from -2<sup>15</sup> to 2<sup>15</sup>-1 (16 bit)  |
| INTEGER   | Integer value from -2<sup>31</sup> to 2<sup>31</sup>-1 (32 bit)  |
| LONG      | Integer value from -2<sup>63</sup> to 2<sup>63</sup>-1 (64 bit)  |
| FLOAT     | Single-precision data type (32 bits), floating-point number defined in IEEE754        |
| DOUBLE    | Double-precision data type (64 bits), floating-point number defined in IEEE754        |
| TIMESTAMP | Data type expressing the date and time.  |
| STRING    | Text that is composed of an arbitrary number of characters using the unicode code point.    |
| BLOB      | Data type for binary data such as images and voice, etc.<br /> Large objects to be saved directly in the input format.<br /> The character x or X can also be added to create a hexadecimal expression such as X'23AB'.   |

A NULL value can be registered to table. The results of operators that is related to NULL value such as "IS NULL" are SQL-compliant.

### Expression that can be specified as a column data type when creating a table

In the NewSQL interface, for data type names that are described as column data types when the table was created, even if the name does not match the data type name given in [Data types used in data storage](#data_types_used_in_data_storage), follow the rules to interpret and determine the data type to use for data storage.

Check the following rules in sequence starting from the top and determine the data type to use for data storage based on the applicable rule. The data type name described when checking the rules and the strings to check using the rules are not case sensitive. 
If multiple rules apply, the rule ranked higher will be prioritized. 
If no rules are applicable, an error will occur and table creation will fail.

| Rule no. | Data type names, that were described as column data types when the table was created | Column type of the table to be created |
|-----------|----------------------------------------------------|------------------------------------|
| 1        | Type names listed in Data types used in data storage                                 | Same as specified type                 |
| 2        | REAL                                                                                 | DOUBLE                                 |
| 3        | TINYINT                                                                              | BYTE                                   |
| 4        | SMALLINT                                                                             | SHORT                                  |
| 5        | BIGINT                                                                               | LONG                                   |
| 6        | Type name including "INT"                                                            | INTEGER                                |
| 7        | Type name including any of "CHAR", "CLOB", "TEXT"                                    | STRING                                 |
| 8        | Type name including "BLOB"                                                           | BLOB                                   |
| 9        | Type name including any of "REAL", "DOUB"                                            | DOUBLE                                 |
| 10       | Type name including "FLOA"                                                           | FLOAT                                  |

An example to determine the data type using this rule is shown.
- Name of specified data type is "BIGINTEGER" -> INTEGER (Rule 6)
- Name of specified data type is "LONG" -> LONG (Rule 1)
- Name of specified data type is "TINYINT" -> BYTE (Rule 3)
- Name of specified data type is "FLOAT" -> FLOAT (Rule 1)
- Name of specified data type is "VARCHAR" -> STRING (Rule 7)
- Name of specified data type is "CHARINT" -> INTEGER (Rule 6)
- Name of specified data type is "BIGBLOB" -> BLOB (Rule 8)
- Name of specified data type is "FLOATDOUB" -> DOUBLE (Rule 9)
- Name of specified data type is "INTREAL" -> INTEGER (Rule 6)
- Name of specified data type is "FLOATINGPOINT" -> INTEGER (Rule 6)
- Name of specified data type is "DECIMAL" -> error

Describe the data type as follows in the NewSQL interface when using the data type equivalent to the one used in the clients of the NoSQL interface. Except for some data types which cannot be used since the equivalent type do not exist.

| Data type in NoSQL interface in client    | Equivalent column data type descriptions in NewSQL interface           |
|--------------------------------------|----------------------------------------------------|
| STRING (string data type)                 | STRING or "Expression to be STRING"                                    |
| BOOL (Boolean)                            | BOOL                                                                   |
| BYTE (8-bit integer)                      | BYTE or "Expression to be BYTE"                                        |
| SHORT (16-bit integer)                    | SHORT or "Expression to be SHORT"                                      |
| INTEGER (32-bit integer)                  | INTEGER or "Expression to be INTEGER"                                  |
| LONG (64-bit integer)                     | LONG or "Expression to be LONG"                                        |
| FLOAT (32 bitwise floating point number)  | FLOAT or "Expression to be FLOAT"                                      |
| DOUBLE (64 bitwise floating point number) | DOUBLE or "Expression to be DOUBLE"                                    |
| TIMESTAMP (time data type)                | TIMESTAMP                                                              |
| GEOMETRY (spatial data type)              | Cannot be specified as a data type of the column when creating a table |
| BLOB                                      | BLOB or "Expression to be BLOB"                                        |
| ARRAY                                     | Cannot be specified as a data type of the column when creating a table |

### Data type when accessing a container as a table and the treatment of the values

The container created with the NoSQL interface client is handled as follows using the container's column type and value when accessing it with the NewSQL interface:

| Column type of container | Data type mapped in NewSQL                      | Value                   |
|--------------------|----------------------------------|----------------|
| STRING                   | STRING                                          | Same as original value  |
| BOOL                     | BOOL                                            | Same as original value  |
| BYTE                     | BYTE                                            | Same as original value  |
| SHORT                    | SHORT                                           | Same as original value  |
| INTEGER                  | INTEGER                                         | Same as original value  |
| LONG                     | LONG                                            | Same as original value  |
| FLOAT                    | FLOAT                                           | Same as original value  |
| DOUBLE                   | DOUBLE                                          | Same as original value  |
| TIMESTAMP                | TIMESTAMP                                       | Same as original value  |
| GEOMETRY                 | Same data type as NULL constant (Types.UNKNOWN) | All the values are NULL |
| BLOB                     | BLOB                                            | Same as original value  |
| ARRAY                    | Same data type as NULL constant (Types.UNKNOWN) | All the values are NULL |

### Treatment of the data type not supported by SQL

The data types which are supported by the NoSQL interface, but not by the NewSQL interface are as follows.

- GEOMETRY
- ARRAY

This section explains how to handle the data of these data types when accessed using the NewSQL interface.

- Creating a table using CREATE TABLE 
  - These data types cannot be specified as a data type of the column when creating a table. An error occurs.

- Deleting a table using DROP TABLE   
  - The table, which has any columns of these data types, can be deleted.

- Registration/updating/deleting using INSERT/UPDATE/DELETE   
  - For a table with the column of these data types,  INSERT/UPDATE/DELETE causes an error.   
  - Rows can not be registered or updated even by specifying only the column values of the supported data types, without specifying any column values of these data types.

    ```        
    // The table created using the NoSQL interface
    name: sample1
    Column: id INTEGER
            value DOUBLE
            geometry GEOMETRY
            
    // Register rows by specifying only INTEGER and DOUBLE columns. -> An error occurs because the table has a GEOMETRY type column.
    INSERT INTO sample1 (id, value) VALUES (1, 192.3)
    ```
    
- Searching using SELECT   
  - Whenever a table with the column of these data types are searched, NULL returns from these columns.


- Creating/deleting an index using CREATE INDEX/DROP INDEX 
  - Creating/deleting an index on a GEOMETRY type column is possible.
  - Creating/deleting an index on an array type column is not allowed. An error occurs. (In the NoSQL interface, creating/deleting an index on an array type column is not allowed.)

## User and database

There are 2 types of GridDB user, an administrator user and a general user, which differ in terms of the functions which can be used. In addition, access can be separated on a user basis by creating a database. 
See "GridDB Features Reference ([GridDB_FeaturesReference](GridDB_FeaturesReference.md)) for the details of users and a database.

## Naming rules

The naming rules are as follows:

- A database name, table name, view name, column name, index name and general user name is a string composed of one or more ASCII alphanumeric characters, the underscore "_" , the hyphen "-" , the dot "." , the slash "/" and the equal "=".
- For table name, the "@" character can also be specified for the node affinity function.

See "GridDB Features Reference" ([GridDB_FeaturesReference](GridDB_FeaturesReference.md)) for the details about the node affinity function, and the rules and the restrictions of naming.

[Notice]
- If the name of a table or a column contains characters other than ASCII alphanumeric characters and underscore, or if the first character of the name is a number in a SQL statement, enclose the name with double quotation marks.

  ```
  SELECT "column.a1" FROM "Table-5"
  ```
---

<a id="sql_commands_supported_by_griddb_ae"></a>