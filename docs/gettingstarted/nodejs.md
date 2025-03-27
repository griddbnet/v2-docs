# Node.JS

[GridDB node.js API Reference](https://griddb.org/node-api/NodeAPIReference.htm)


## Installation
The easiest way to use the node.js client is to install it with the node package manager (npm). So please make sure that you have it installed, with a node.js version of at least v16.

The GridDB c_client is a prerequisite for the node.js connector and is a part of the `griddb-meta` package which you might have used to install GridDB Server onto your machine. You can verify by checking your `/usr/` directory. In there, you should be able to find the corresponding c_client directory (for example: `/usr/griddb_c_client-5.3.0`)

The source code and package files can also be found on GitHub here: [https://github.com/griddb/c_client](https://github.com/griddb/c_client). 

With the prerequisites on hand, we can install the node.js connector. To do so, we can download the source code and build from source from the github page: [https://github.com/griddb/node-api](https://github.com/griddb/node-api) or we can simply use npm.

To use npm, make a new directory and `npm init`. This should handle the basic scaffolding for your project and make a `node_modules` directory. Once it's done, it's simply a matter of telling the package manager to add the node.js client to our project like so: 

``` bash
$ npm i griddb-node-api
```
and now you've got the GridDB Node.js client installed and ready for use.

We can now officially run JavaScript with our GridDB cluster.

## Usage
To use the client, simply import the griddb library into your program

```javascript
const griddb = require('griddb-node-api');
```

To define your actual cluster, it looks like this:

```javascript
const factory = griddb.StoreFactory.getInstance();
        const store = factory.getStore({
            "notificationMember": '127.0.0.1:10001',
            "clusterName": "myCluster",
            "username": "admin",
            "password": "admin"
        });
```
Making containers and defining their schema is easy too (collection container):

```javascript
const colConInfo = new griddb.ContainerInfo({
            'name': "Person",
            'columnInfoList': [
                ["name", griddb.Type.STRING],
                ["age", griddb.Type.INTEGER],
            ],
            'type': griddb.ContainerType.COLLECTION, 'rowKey': true
        });
```
Time Series container:

```javascript
var timeConInfo = new griddb.ContainerInfo({
        'name': "HeartRate",
        'columnInfoList': [
            ["timestamp", griddb.Type.TIMESTAMP],
            ["heartRate", griddb.Type.INTEGER],
            ["activity", griddb.Type.STRING]
        ],
        'type': griddb.ContainerType.TIME_SERIES, 'rowKey': true
    });
```
And then to actually put data into your container (and then query), it looks like this:

```javascript
let time_series;
        store.putContainer(timeConInfo, false)
            .then(ts => {
                time_series = ts;
                return ts.put([new Date(), 60, 'resting']);
            })
            .then(() => {
                query = time_series.query("select * where timestamp > TIMESTAMPADD(HOUR, NOW(), -6)");
                return query.fetch();
            })
            .then(rowset => {
                while (rowset.hasNext()) {
                    var row = rowset.next();
                    console.log("Time =", row[0], "Heart Rate =", row[1].toString(), "Activity =", row[2]);
                }
            })
            .catch(err => {
                if (err.constructor.name == "GSException") {
                    for (var i = 0; i < err.getErrorStackSize(); i++) {
                        console.log("[", i, "]");
                        console.log(err.getErrorCode(i));
                        console.log(err.getMessage(i));
                    }
                } else {
                    console.log(err);
                }
            });
```

Because the GridDB node api relies on promises, you can also instead opt to use async functions instead. For example: 

```javascript
const queryCont = async (containerName, queryStr) => {

    const data = [] // arr will be returned
    try {
        const col = await store.getContainer(containerName)
        const query = await col.query(queryStr)
        const rs = await query.fetch(query)
        while(rs.hasNext()) {
            data.push(rs.next())
        }
        return data
    } catch (error) {
        console.log("error: ", error)
    }
}
```