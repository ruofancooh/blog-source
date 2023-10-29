---
title: HD08 - HDFS 的读写流程和工作机制
date: 2023-10-29 10:10:00
categories: Hadoop
permalink: HD/08/
mermaid: true
---

HDFS 的读写流程和工作机制

<!--more-->

在 HDFS 中，数据是分块（Block）存储的。相当于你一个人分割在了多个社交平台上。

在 Hadoop2.x 和 3.x 中，数据块大小默认是 128MB。

如果数据分块太小，分割数量会变多，寻址时间会增加。就是你切换 APP 的时间增加。

如果数据块太大，磁盘传输时间占比增加。就是你花在这一个 APP 上的时间增加。且分割数量变少，MR 的并行任务数变少。

当寻址时间是传输时间的 1% 时，状态最佳。

## 写数据

创建一个文件，将数据写入文件，关闭文件。

```sh
hadoop fs -put ./voice.wav /app
```

如果是一个 200MB 的文件，会被分为 128MB 的一块和 72MB 的一块。

distributed：分布式

### 写数据的流程

```mermaid
sequenceDiagram
    participant C as Client
    participant NN as NameNode
    participant DN1 as DataNode1
    participant DN2 as DataNode2
    participant DN3 as DataNode3

    C->>NN: 1
    NN-->>C: 2
    C->>NN: 3
    NN-->>C: 4
    C->>DN1: 5
    DN1->>DN2: 5
    DN2->>DN3: 5
    DN3-->>DN2: 6
    DN2-->>DN1: 6
    DN1-->>C: 6
    C->>DN1: 7
    DN1->>DN2: 7
    DN2->>DN3: 7
```

把 Client 看成你，NameNode 看成手机，DataNode 看成 APP。（类比不恰当，但是好记）

1. Client 通过[DistributedFileSystem](https://github.com/apache/hadoop/blob/branch-3.3.6/hadoop-hdfs-project/hadoop-hdfs-Client/src/main/java/org/apache/hadoop/hdfs/DistributedFileSystem.java)模块向 NameNode 发请求：上传文件
2. NameNode 给 Client 响应：是/否允许上传

前两步是你和你的手机建立连接，看手机能不能用。

3. Client 再给 NameNode 发请求：上传第一个块/可用的 DataNode 列表
4. NameNode 返回 DataNode 的服务器地址

这两步是你想发动态了，看目前装了哪些 APP。

5. Client 通过[FSDataOutputStream](https://github.com/apache/hadoop/blob/branch-3.3.6/hadoop-common-project/hadoop-common/src/main/java/org/apache/hadoop/fs/FSDataOutputStream.java)模块向 DataNode1 请求上传数据，DataNode1 收到请求之后向 DataNode2 请求……这叫建立通信管道。
6. 通信管道建立之后，DataNode 向前面的 DataNode 逐级应答到 Client

你想发一条动态，打开了 NeteaseCloudMusic，但是 APP 们都是有灵性的，一个接连唤醒一个。

7. Client 向 DataNode1 发送第一个数据块的多个数据包（Packet），DataNode1 收到之后发给 DataNode2……类似路由器分组转发，但是保存了数据。
8. 重复步骤 3 到 7，上传第二、第三……个数据块直到传输完成，Client 关闭连接。

总结：Client 和 NameNode 问答两次（是否可以上传，DN 的地址），和 DataNode 问答一次（建立通信管道），之后开始分包传数据。

### 副本放置策略与机架感知

机架（rack）是放机器的架子，是连接到同一个交换机的物理存储节点的集合。