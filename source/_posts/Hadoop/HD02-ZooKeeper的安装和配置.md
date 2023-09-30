---
title: HD02 - ZooKeeper的安装和配置
date: 2023-09-14 16:48:00
categories: Hadoop
permalink: HD/02/
---

ZooKeeper，顾名思义，就是管动物园的。因为 Hadoop 的形象是大象，名字是它的兄弟起的（Hadoop 是其开发者儿子的玩具名），加上 Hadoop 许多周边项目的形象都是动物，ZooKeeper 就是协调它们工作的。

除了[官方文档](https://zookeeper.apache.org/doc/r3.8.2/index.html)之外，还有个网站：[大象教程](https://www.hadoopdoc.com/)。

<!--more-->

## 下载 ZooKeeper

[下载地址](https://zookeeper.apache.org/releases.html)

最新稳定版是 3.8.2，于两个月之前发布。特别地：

- ZooKeeper 3.5 已经在 2022 年儿童节结束生命周期。
- ZooKeeper 3.6 已经在 2022 年倒数第二天结束生命周期。

结束生命周期不是不能用了，Windows XP 现在照样有人用。要考虑到实际情况，企业不可能那么快的换软件，有新的变化时所有人都需要花时间学习试错。但是要有点探索精神，还是选择下 Apache ZooKeeper 3.8.2(asc, sha512)，文件名带 bin 的那一个。

ZooKeeper 特点是只要有半数以上的节点正常工作，整个集群就能正常工作，所以适合装到奇数台服务器上。

## 安装 ZooKeeper

用 Xftp 把压缩包传到 master，然后：

```sh
:: 解压
sudo tar -zxvf apache-zookeeper-3.8.2-bin.tar.gz -C /usr/local;
:: 重命名文件夹
cd /usr/local;
sudo mv apache-zookeeper-3.8.2-bin zookeeper-3.8.2;
```

## 配置 ZooKeeper

三台机器上都要配置。配好 master 后用 xsync 传到另外两台上，然后改。

### 配置 `zkData/myid`

```sh
cd zookeeper-3.8.2;
sudo mkdir zkData;
cd zkData;
sudo vi myid;
```

我填的是 _当前主机_ 的 ip 后三位 `10x`。

### 配置 `conf/zoo.cfg`

```sh
cd ../conf;
sudo mv zoo_sample.cfg zoo.cfg;
sudo vi zoo.cfg;
```

改默认的 dataDir，并配置三台主机的端口：

```cfg
dataDir=/usr/local/zookeeper-3.8.2/zkData
server.101=master:2888:3888
server.102=worker1:2888:3888
server.103=worker2:2888:3888
```

## ZooKeeper，启动！

三台机器都执行：

```sh
cd /usr/local/zookeeper-3.8.2;
sudo bin/zkServer.sh start;
```

## 查看任意一台机器的服务状态

```sh
bin/zkServer.sh status;
```

输出：

```txt
ZooKeeper JMX enabled by default
Using config: /usr/local/zookeeper-3.8.2/bin/../conf/zoo.cfg
Client port found: 2181. Client address: localhost. Client SSL: false.
Mode: follower
```

会有一个 leader 和两个 follower。

## 停止 ZooKeeper

```sh
bin/zkServer.sh stop;
```

（获取这些命令，可以通过直接看脚本里有什么内容）
