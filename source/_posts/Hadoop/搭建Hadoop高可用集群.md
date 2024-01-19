---
title: 搭建 Hadoop 高可用集群
date: 2024-01-19 08:31:00
categories: Hadoop
permalink: hadoop-ha.html
---

HDFS 和 YARN 都是主从架构，当主节点挂了或者系统升级，集群会无法正常工作。高可用是指 7x24 小时系统可用，为此设置多个主节点。

对于 HDFS，主节点是 NameNode，它负责保存文件系统快照、操作日志、处理客户端读写请求，2NN 负责定期合并文件系统快照和操作日志。为实现高可用，设置多个 NameNode 和 JournalNode。同一时间只能有一个 NameNode 为 Active，它负责生成快照文件 FsImage，其他 NameNode 为 Standby，拉取同步 FsImage，还起到 2NN 的作用。JournalNode 负责保证 EditLog 的一致性。Zookeeper 负责监控集群，如果 Active 的 NameNode 挂了，通过 ZKFC 进行故障转移。

对于 YARN，主节点是 ResourceManager，从节点是 NodeManager。为此配置多个 ResourceManager。

[文档](https://hadoop.apache.org/docs/r3.3.6/hadoop-project-dist/hadoop-hdfs/HDFSHighAvailabilityWithQJM.html)

<!--more-->

## HDFS-HA

把原来的非高可用的 Hadoop 文件夹单独复制一份，重新写配置文件和环境变量、删除 data 和 logs 文件夹。先启动所有 journalnode 服务，再格式化一台机器的 namenode，启动该机器的 namenode 服务，然后在另两台机器上同步 namenode1 的元数据信息，并启动 namenode 服务。

### 配置

三台机器上分别都配一个 NameNode、JournalNode、DataNode

`core-site.xml`:

| name                        | value                                  |
| --------------------------- | -------------------------------------- |
| fs.defaultFS                | hdfs://mycluster                       |
| hadoop.tmp.dir              | /usr/local/hadoop-ha/hadoop-3.3.6/data |
| hadoop.http.staticuser.user | rc                                     |

`hdfs-site.xml`:

注意 `dfs.journalnode.edits.dir` 不能以 `file://` 开头，前两个要以 `file://` 开头，不然报错。以及小心各种拼写错误。

| name                                          | value                                                                     |
| --------------------------------------------- | ------------------------------------------------------------------------- |
| dfs.nameservices                              | mycluster                                                                 |
| dfs.namenode.name.dir                         | `file://${hadoop.tmp.dir}/name`                                           |
| dfs.datanode.data.dir                         | `file://${hadoop.tmp.dir}/data`                                            |
| dfs.journalnode.edits.dir                     | `${hadoop.tmp.dir}/journalnode`                                            |
| dfs.ha.namenodes.mycluster                    | namenode1,namenode2,namenode3                                             |
| dfs.namenode.rpc-address.mycluster.namenode1  | ubuntu101:8020                                                            |
| dfs.namenode.rpc-address.mycluster.namenode2  | ubuntu102:8020                                                            |
| dfs.namenode.rpc-address.mycluster.namenode3  | ubuntu103:8020                                                            |
| dfs.namenode.http-address.mycluster.namenode1 | ubuntu101:9870                                                            |
| dfs.namenode.http-address.mycluster.namenode2 | ubuntu102:9870                                                            |
| dfs.namenode.http-address.mycluster.namenode3 | ubuntu103:9870                                                            |
| dfs.namenode.shared.edits.dir                 | qjournal://ubuntu101:8485;ubuntu102:8485;ubuntu103:8485/mycluster         |
| dfs.client.failover.proxy.provider.mycluster  | org.apache.hadoop.hdfs.server.namenode.ha.ConfiguredFailoverProxyProvider |
| dfs.ha.fencing.methods                        | sshfence                                                                  |
| dfs.ha.fencing.ssh.private-key-files          | /home/rc/.ssh/id_rsa                                                      |

### 实验

在每一台机器上启动 JournalNode 服务：

```sh
hdfs --daemon start journalnode
```

在 101 机器上对 namenode 进行格式化，并启动 namenode：

```sh
hdfs namenode -format
hdfs --daemon start namenode
```

在 Web 界面查看，为 Standby。

在另两台机器上同步 namenode1 的元数据信息，并启动 namenode：

```sh
hdfs namenode -bootstrapStandby
hdfs --daemon start namenode
```

在每一台机器上启动 DataNode：

```sh
hdfs --daemon start datanode
```

把 namenode2 切换成 Active 状态：

```sh
hdfs haadmin -transitionToActive namenode2
```

模拟 namenode2 挂掉：

```sh
kill -9 <进程号>
```

这时 namenode1 和 namenode3 还是 Standby。如果手动激活某一个，会显示 102 拒绝连接。

重启 namenode2 后，三个 namenode 还是 Standby。这时再激活某一个，激活成功。这说明当所有的 namenode 都启动成功时，才可以激活某一个 namenode。这失去了高可用的意义和作用。为什么会这样呢？因为我们前面配置了隔离机制，同一时刻只能有一台 Active 的 namenode 响应客户端。如果有 namenode 挂了，其他 namenode 只是联系不上它，不知道是不是真的挂了。如果它没挂且是 Active，再激活其他机器，会出现两台 Active。为了准确无误地知道它是否挂了，需要配置 ZooKeeper 监控集群。

### 自动故障转移配置

在三台机器上都加一个 Zookeeper 和 ZKFC。

在上面的配置文件基础上增加。

`hdfs-site.xml`:

| name                              | value |
| --------------------------------- | ----- |
| dfs.ha.automatic-failover.enabled | true  |

`core-site.xml`:

端口号要与 ZooKeeper 配置文件里的一致。

| name                | value                                        |
| ------------------- | -------------------------------------------- |
| ha.zookeeper.quorum | ubuntu101:2181,ubuntu102:2181,ubuntu103:2181 |

### 自动故障转移实验

必须在 stop-dfs 之后，并启动 ZooKeeper 集群成功后，再在任意一台机器上初始化 HA 在 Zookeeper 中状态。

```sh
hdfs zkfc –formatZK
```

然后 start-dfs。formatZK 成功后，以后启动集群需要先启动 ZK 服务端，后启动 dfs。如果先启动 dfs，这时会有 ZKFC 进程，再启动 ZK 服务端后，ZKFC 进程被挤掉了，所有 namenode 都是 Standby。

查看当前活跃节点：

```sh
hdfs haadmin -getAllServiceState
```

或者在 ZK 客户端查看选举锁：

```sh
get -s /hadoop-ha/mycluster/ActiveStandbyElectorLock
```

验证集群会不会进行故障转移：kill 掉 Active 的 namenode

## YARN-HA

### 配置

三台机器上分别都配一个 ResourceManager、NodeManager、ZooKeeper

`yarn-site.xml`:

| name                                              | value                                                                                                                         |
| ------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| yarn.nodemanager.aux-services                     | mapreduce_shuffle                                                                                                             |
| yarn.resourcemanager.ha.enabled                   | true                                                                                                                          |
| yarn.resourcemanager.recovery.enabled             | true                                                                                                                          |
| yarn.resourcemanager.store.class                  | org.apache.hadoop.yarn.server.resourcemanager.recovery.ZKRMStateStore                                                         |
| yarn.resourcemanager.zk-address                   | ubuntu101:2181,ubuntu102:2181,ubuntu103:2181                                                                                  |
| yarn.resourcemanager.cluster-id                   | cluster-yarn1                                                                                                                 |
| yarn.resourcemanager.ha.rm-ids                    | rm1,rm2,rm3                                                                                                                   |
| yarn.resourcemanager.hostname.rm1                 | ubuntu101                                                                                                                     |
| yarn.resourcemanager.hostname.rm2                 | ubuntu102                                                                                                                     |
| yarn.resourcemanager.hostname.rm3                 | ubuntu103                                                                                                                     |
| yarn.resourcemanager.webapp.address.rm1           | ubuntu101:8088                                                                                                                |
| yarn.resourcemanager.webapp.address.rm2           | ubuntu102:8088                                                                                                                |
| yarn.resourcemanager.webapp.address.rm3           | ubuntu103:8088                                                                                                                |
| yarn.resourcemanager.address.rm1                  | ubuntu101:8032                                                                                                                |
| yarn.resourcemanager.address.rm2                  | ubuntu102:8032                                                                                                                |
| yarn.resourcemanager.address.rm3                  | ubuntu103:8032                                                                                                                |
| yarn.resourcemanager.scheduler.address.rm1        | ubuntu101:8030                                                                                                                |
| yarn.resourcemanager.scheduler.address.rm2        | ubuntu102:8030                                                                                                                |
| yarn.resourcemanager.scheduler.address.rm3        | ubuntu103:8030                                                                                                                |
| yarn.resourcemanager.resource-tracker.address.rm1 | ubuntu101:8031                                                                                                                |
| yarn.resourcemanager.resource-tracker.address.rm2 | ubuntu102:8031                                                                                                                |
| yarn.resourcemanager.resource-tracker.address.rm3 | ubuntu103:8031                                                                                                                |
| yarn.nodemanager.env-whitelist                    | JAVA_HOME,HADOOP_COMMON_HOME,HADOOP_HDFS_HOME,HADOOP_CONF_DIR,CLASSPATH_PREPEND_DISTCACHE,HADOOP_YARN_HOME,HADOOP_MAPRED_HOME |

### 实验

查看当前活跃节点：

```sh
yarn rmadmin -getAllServiceState
```

如果浏览器访问 Standby 节点的 8088 端口（RM），会自动跳转到 Active 节点。

## 解决 JSch 认证失败

问题出现在配置 HDFS HA 自动故障转移时。杀掉活跃的 NN 之后，它没有被隔离成功。

JSch 是一个库，它在 Java 程序里建立 SSH 连接。

### 在杀掉 Acitive 的 NN 过程中

被杀的 Acitive 的 NN 上的 ZKFC 日志：

1. [08:38:38,534] hadoop 高可用健康监测者抛出 EOF 异常，进入 SERVICE_NOT_RESPONDING 状态
2. [08:38:38,615]
   - org.apache.hadoop.hdfs.tools.DFSZKFailoverController: 获取不到本地 NN 的线程转储，由于连接被拒绝
   - org.apache.hadoop.ha.ZKFailoverController: 退出 NN 的主选举，并标记需要隔离
   - hadoop 高可用激活/备用选举者开始重新选举
3. [08:38:38,636] ZK 客户端不能从服务端读取会话的附加信息，说服务端好像把套接字关闭了
4. [08:38:38,739] 会话被关闭，ZK 客户端上对应的事件线程被终止
5. 之后 hadoop 高可用健康监测者一直尝试重新连接 NN，连不上

原来 Standby 的 NN 上的 ZKFC 日志：

1. [08:38:38,719] 选举者检查到了需要被隔离的原活跃节点，ZKFC 找到了隔离目标
2. [08:38:39,738] org.apache.hadoop.ha.FailoverController 联系不上被杀的 NN
3. [08:38:39,748] 高可用节点隔离者开始隔离，用 org.apache.hadoop.ha.SshFenceByTcpPort，里面用了 JSch 库建立客户端（本机）与服务端（被杀的）之间的 SSH 连接
4. [08:38:40,113] SSH 认证失败，隔离方法没有成功，选举失败
5. 之后选举者一直在重建 ZK 连接，重新连 NN 连不上，重新隔离失败

### 软件版本

客户端（Standby 上的 org.apache.hadoop.ha.SshFenceByTcpPort.jsch）：

- Hadoop 3.3.6 [SshFenceByTcpPort 源码](https://github.com/apache/hadoop/blob/branch-3.3.6/hadoop-common-project/hadoop-common/src/main/java/org/apache/hadoop/ha/SshFenceByTcpPort.java)
- JSch 0.1.55

服务端（被杀的）：

- OpenSSH_8.9p1 Ubuntu-3ubuntu0.6, OpenSSL 3.0.2 15 Mar 2022 里的 sshd

生成密钥时用的命令：

```sh
ssh-keygen -t rsa -m PEM
```

### 关键日志

原来为 Standby 的 NN 上的 ZKFC 日志：

```
INFO org.apache.hadoop.ha.SshFenceByTcpPort.jsch:
//...
Remote version string: SSH-2.0-OpenSSH_8.9p1 Ubuntu-3ubuntu0.6
Local version string: SSH-2.0-JSCH-0.1.54
// JSch 0.1.55 的源码里，写的字符串就是 0.1.54，这个应该不影响
//...
Authentications that can continue: publickey,keyboard-interactive,password
Next authentication method: publickey
// 这里用公钥认证失败了
Authentications that can continue: password
Next authentication method: password
Disconnecting from ubuntu103 port 22
WARN org.apache.hadoop.ha.SshFenceByTcpPort: Unable to connect to ubuntu103 as user rc
com.jcraft.jsch.JSchException: Auth fail
```

### 解决思路

看 sshd 的日志：

```
userauth_pubkey: key type ssh-rsa not in PubkeyAcceptedAlgorithms
error: Received disconnect from 192.168.78.101 port 49968:3: com.jcraft.jsch.JSchException: Auth fail
Disconnected from authenticating user rc 192.168.78.101 port 49968
```

```sh
sudo vi /etc/ssh/sshd_config
```

```
PubkeyAuthentication yes
PubkeyAcceptedAlgorithms +ssh-rsa
```

```sh
sudo systemctl restart sshd
```

## 不是问题的问题

用

```sh
hdfs haadmin -getAllServiceState
```

查看 Active 转移成功了，但是联系不上被杀的那一方。

具体地说，转移成功之后，三个方的 DN 都一直在尝试连被杀那一方的 NN，一直在写日志。除此之外上传下载都没问题。

这应该是集群自带的心跳机制，不是问题。
