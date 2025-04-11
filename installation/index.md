---
# https://vitepress.dev/reference/default-theme-home-page
layout: home

hero:
  name: "Quick Start"
  text: ""
  tagline: 
  actions:
    - theme: brand
      text: Ubuntu (Standalone Page)
      link: /installation/ubuntu
    - theme: alt
      text: Rocky Linux
      link: /installation/rocky-linux
    - theme: alt
      text: Docker
      link: /installation/docker
---


## GridDB Server (Ubuntu)

```bash
sudo sh -c 'echo "deb https://www.griddb.net/apt griddb/5.7 multiverse" > /etc/apt/sources.list.d/griddb.list'
```

And then import the key: 

```bash
wget -qO - https://www.griddb.net/apt/griddb.asc | sudo apt-key add -
```

Then install GridDB:
    
```bash
$ sudo apt update
$ sudo apt install griddb-meta
```

::: info
The griddb-meta package installs the following packages: griddb, griddb-c-client, griddb-cli, griddb-webapi, griddb-jdbc
:::

### Starting GridDB

```bash
$ sudo systemctl start gridstore
```

## CLI Quickstart

```bash{7}
$ sudo su gsadm
$ gs_sh

Loading "/var/lib/gridstore/.gsshrc"
The connection attempt was successful(NoSQL).
The connection attempt was successful(NewSQL).
gs[public]>
```


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

and to start and use:

```bash
$ sudo systemctl start griddb-webapi.service
$ curl --location -I 'http://localhost:8081/griddb/v2/myCluster/dbs/public/checkConnection' \
--header 'Authorization: Basic YWRtaW46YWRtaW4='

HTTP/1.1 200 
Content-Length: 0
Date: Wed, 09 Apr 2025 16:37:44 GMT
```

the password here is `admin:admin` encoded to base64 format