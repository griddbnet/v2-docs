## GridDB Web API Quickstart

If using GridDB in FIXED_LIST Mode (which is the default mode!), make the following changes to your web-api config:

```bash
$ cd /var/lib/gridstore/webapi/conf
$ sudo vim repository.json
```

```bash
{
  "clusters" : [
    {
      "name" : "",
      "mode" : "MULTICAST",
      "address" : "239.0.0.1",
      "port" : 31999,
      "jdbcAddress" : "239.0.0.1",
      "jdbcPort" : 41999,
      "transactionMember": "",
      "sqlMember": "",
      "providerUrl": null
    }
  ]
}
```
becomes

```bash
{
  "clusters" : [
    {
      "name" : "myCluster",
      "mode" : "FIXED_LIST",
      "transactionMember": "127.0.0.1:10001",
      "sqlMember": "127.0.0.1:20001",
      "providerUrl": null
    }
  ]
}
```

You can start/stop the service with the following command: `service griddb-webapi [start|stop|status|restart]`

For example:

```bash
$ service griddb-webapi start
```

And then to use: 

```
$ curl --location -I 'http://localhost:8081/griddb/v2/myCluster/dbs/public/checkConnection' \
--header 'Authorization: Basic YWRtaW46YWRtaW4='

HTTP/1.1 200 
Content-Length: 0
Date: Wed, 09 Apr 2025 16:37:44 GMT
```
The Basic Auth credentials used here are in the style of `user:pass` encoded to base64. If using the defaults like shown in the example above, the values should be set to `admin:admin`.