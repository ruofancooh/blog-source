---
title: MD04 - 在Ubuntu上安装MongoDB并部署副本集
date: 2023-10-25 18:20:00
categories: MongoDB
permalink: MD/04/
---

官方教程：

- [在 Ubuntu 上安装](https://www.mongodb.com/docs/manual/tutorial/install-mongodb-on-ubuntu/)
- [部署副本集](https://www.mongodb.com/docs/manual/tutorial/deploy-replica-set/)

<!--more-->

## 执行了以下几句命令

分别在三台虚拟机上。

```sh
sudo apt-get install gnupg curl
```

```sh
curl -fsSL https://pgp.mongodb.com/server-7.0.asc | \
   sudo gpg -o /usr/share/keyrings/mongodb-server-7.0.gpg \
   --dearmor
```

```sh
echo "deb [ arch=amd64,arm64 signed-by=/usr/share/keyrings/mongodb-server-7.0.gpg ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list
```

```sh
sudo apt-get update
```

```sh
sudo apt-get install -y mongodb-org
```

## 绑定 IP

```sh
sudo vi /etc/mongod.conf
```

```conf
net:
  port: 27017
  bindIp: localhost,ubuntu101
```

绑定 IP 的后者是当前机器的主机名。

这样既可以在当前机器上使用 `mongosh`，又可以在物理机上用 MongoDB Compass 连接。

## 启动 mongod/停止/重新启动/查看状态

```sh
sudo systemctl [start] [stop] [restart] [status] mongod
```

## 部署副本集

副本集就是在多台机器上保存同一组数据的副本。

改配置文件并重启 mongod。三台机器取同一个副本集名字。

```conf
replication:
  replSetName: "rs0"
```

只在一台机器的 mongosh 里，用下面的命令初始化：

```js
rs.initiate({
  _id: "rs0",
  members: [
    { _id: 101, host: "ubuntu101:27017" },
    { _id: 102, host: "ubuntu102:27017" },
    { _id: 103, host: "ubuntu103:27017" },
  ],
});
```

（这里没有设置仲裁节点）

查看节点状态：

```js
rs.status();
```

### 如果出错了

我不小心配置并初始化错了，然后不知道为何 MongoDB Compass 也连不上了。

简单的解决方法是把数据目录删了重建，重新配置。刚装上，所以没有删库成本：

```sh
sudo systemctl stop mongod &&
sudo rm -r /var/lib/mongodb &&
sudo mkdir /var/lib/mongodb &&
sudo chown -R mongodb:mongodb /var/lib/mongodb &&
sudo systemctl start mongod
```

## 在 primary 节点上 CRUD

CRUD 就是增删改查 Create、Read、Update、Delete。

## Replication Methods

[Replication Methods](https://www.mongodb.com/docs/manual/reference/method/js-replication/)

## 另外

还有一种【分片集群】，但是需要电脑性能很强。这里不部署。
