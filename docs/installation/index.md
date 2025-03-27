---
# https://vitepress.dev/reference/default-theme-home-page
layout: home

hero:
  name: "Installing GridDB"
  text: "Documentation for GridDB.net"
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