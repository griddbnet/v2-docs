---
# https://vitepress.dev/reference/default-theme-home-page
layout: home

hero:
  name: "Installation"
  text: ""
  tagline: 
  actions:
    - theme: brand
      text: Ubuntu
      link: /installation/ubuntu
    - theme: alt
      text: Rocky Linux
      link: /installation/rocky-linux
    - theme: alt
      text: Docker
      link: /installation/docker
---


## GridDB (Ubuntu) Quickstart

```bash
sudo sh -c 'echo "deb https://www.griddb.net/apt griddb/5.7 multiverse" >  /etc/apt/sources.list.d/griddb.list'
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

## CLI Quickstart

```bash
$ sudo su gsadm
$ gs_sh
```


## GridDB Web API Quickstart

```bash
$ sudo su gsadm
$ nohup java -jar /usr/griddb-ce-webapi-5.7.0/griddb-webapi-ce-5.7.0.jar &
$ curl --location 'http://localhost:8081/myCluster/dbs/public/checkConnection' \
--header 'Authorization: Basic YWRtaW46YWRtaW4='
```