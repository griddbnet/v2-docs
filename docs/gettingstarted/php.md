# PHP

GridDB has released a database connector for the PHP programming language. Like the Python, Ruby, and Go API's for GridDB, it was built using the [SWIG](http://www.swig.org/) library. The connector supports versions of PHP 7 or higher, and can work on CentOS version 7.4 or higher.

PHP or Hypertext Preprocessor is an open-source programming language developed by Rasmus Lerdorf.

## PHP Client Setup and Installation
Begin by cloning the github repository for the PHP Client.
``` bash
$ git clone https://github.com/griddb/php_client.git
```
To build the PHP Client, you will need to have the GridDB [C Client](https://github.com/griddb/c_client) built and installed. You can follow this [blog post](https://griddb.net/en/blog/using-griddbs-cpythonruby-apis/#c-intro) on how to set up and test the C Client if you are not familiar.
::: warning Note
Before you make and build the PHP client on your system, ensure that you have PHP version 7 or higher. You can follow instructions on this [page](https://linuxize.com/post/install-php-7-on-centos-7/) which explains how to get and configure PHP version 7.
:::
Now that you have obtained the source code from Github, you can simply follow the instructions in the `README` on the PHP Client’s [Github page](https://github.com/griddb/php_client).

## Connecting to GridDB with the PHP Client
If you wish to connect to GridDB in a PHP program, simply import the PHP API with: `include('griddb_php_client.php');` The name of the GridDB package for PHP is `StoreFactory`.

From there you can obtain an instance of it using `get_default();` and connect it to your GridDB cluster with the factory instance's `->get_store` method. The parameters you give this method are a `array(` object. The elements in the array are simply the configuration fields you want to specify to connect to GridDB.

::: warning Note
Port must be specified as an integer while all the other database configuration values like host or cluster name can be strings.
:::

``` php
<?php
  include('griddb_php_client.php');
  $factory = StoreFactory::get_default();
  $update = true;
  try {
      //Get GridStore object
      $gridstore = $factory->get_store(array("notificationAddress" => $argv[1],
                        "notificationPort" => $argv[2],
                        "clusterName" => $argv[3],
                        "user" => $argv[4],
                        "password" => $argv[5]
                    ));
    } catch(GSException $e){
        echo($e->what()."\n");
        echo($e->get_code()."\n");
    }
?>
```
## Creating Row Schemas in PHP
Schemas for containers and rows can be created using arrays with GridDB API types.

You can simply use two-dimensional array of interfaces to map the column types for your container. From there you can create a container schema `(array(array()))` by using `->put_container()` method. You can use and insert these schemas to create containers.

For example, if in a container the second column stores a boolean with the value of false, then the value should be mapped as `$row->set_field_by_bool(1, false);`.

``` php
// Creating container info
#Create ContainerInfo
        $conInfo =
// Creating schema for our TimeSeries Container
// The first column is always the row key
#Create TimeSeries
        $ts = $gridstore->put_container("point01", array(array("timestamp" => GS_TYPE_TIMESTAMP),
                        array("active" => GS_TYPE_BOOL),
                        array("voltage" => GS_TYPE_DOUBLE)),
                        GS_CONTAINER_TIME_SERIES);
        #Create and set row data
        $row = $ts->create_row();
        $row->set_field_by_timestamp(0, TimestampUtils::current());
        $row->set_field_by_bool(1, false);
        $row->set_field_by_double(2, 100);
        #Put row to timeseries with current timestamp
        $ts->put_row($row);
```
You can also obtain a Row with a simple call to the `get_next();` method on the container with the name of the row object. As mentioned before, a row is created using GridDB  API methods, all one needs to do to access the column value is to reference the row-index of the column.

``` php
        //Create Collection
        $col = $gridstore->put_container("col01", array(array("name" => GS_TYPE_STRING),
                  array("status" => GS_TYPE_BOOL),
                  array("count" => GS_TYPE_LONG),
                  array("lob" => GS_TYPE_BLOB)),
                  GS_CONTAINER_COLLECTION);
        //Change auto commit mode to false
        $col->set_auto_commit(false);
        //Set an index on the Row-key Column
        $col->create_index("name", GS_INDEX_FLAG_DEFAULT);
        //Set an index on the Column
        $col->create_index("count", GS_INDEX_FLAG_DEFAULT);
        //Create and set row data
        $row = $col->create_row(); //Create row for refer
        $row->set_field_by_string(0, "name01");
        $row->set_field_by_bool(1, False);
        $row->set_field_by_long(2, 1);
        $row->set_field_by_blob(3, "ABCDEFGHIJ");
        //Put row: RowKey is "name01"
        $col->put_row($row);
        $col->commit();
        $row2 = $col->create_row(); //Create row for refer
        $col->get_row_by_string("name01", True, $row2); //Get row with RowKey "name01"
        $col->delete_row_by_string("name01"); //Remove row with RowKey "name01"
        //Put row: RowKey is "name02"
        $col->put_row_by_string("name02", $row);
        $col->commit();
        //Create normal query
        $query = $col->query("select * where name = 'name02'");
        //Execute query
        $rrow = $col->create_row();
        $rs = $query->fetch($update);
        while ($rs->has_next()){
            $rs->get_next($rrow);
            $name = $rrow->get_field_as_string(0);
            $status = $rrow->get_field_as_bool(1);
            $count = $rrow->get_field_as_long(2) + 1;
            $lob = $rrow->get_field_as_blob(3);
            echo("Person: name=$name status=");
            echo $status ? 'true' : 'false';
            echo(" count=$count lob=$lob\n");
            //Update row
            $rrow->set_field_by_long(2, $count);
            $rs->update_current($rrow);
        }
        //End transaction
        $col->commit();
```
## Queries and Data Management
Once you have your containers populated with data and inserted into GridDB, you are ready to query and fetch your data. Similar to the Python or Java APIs, all you need to is to construct a Query object (by using the query method from a container object `$query = $ts->query("select * ")` with the specific query you would like to issue to your container. Once that is done, simply fetch the query’s results and store it in the query object.

::: warning Note
If you want to select specific rows to update, you must set the commit-mode of the container you are trying update to false.
:::

Once you have finished with updating row values, you can simply `->commit();` the changes.

It should now be quite easy to connect and manage your GridDB cluster using PHP. With all the various utilities offered by the GridDB PHP Client, storing data and developing high-performance PHP applications with GridDB should now be possible.

### References
The source code for the GridDB PHP client can be found on the [official Github repository](https://github.com/griddb/php_client).