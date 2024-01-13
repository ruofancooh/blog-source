---
title: 解决 JSch 认证失败
date: 2024-1-12 23:00:00
categories: Hadoop
permalink: jsch-auth-fail.html
---

问题出现在配置 HDFS HA 自动故障转移时。杀掉活跃的 NN 之后，它没有被隔离成功。

JSch 是一个库，它在 Java 程序里建立 SSH 连接。

<!--more-->

## 在杀掉 Acitive 的 NN 过程中

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

## 软件版本

客户端（Standby 上的 org.apache.hadoop.ha.SshFenceByTcpPort.jsch）：

- Hadoop 3.3.6 [SshFenceByTcpPort 源码](https://github.com/apache/hadoop/blob/branch-3.3.6/hadoop-common-project/hadoop-common/src/main/java/org/apache/hadoop/ha/SshFenceByTcpPort.java)
- JSch 0.1.55

服务端（被杀的）：

- OpenSSH_8.9p1 Ubuntu-3ubuntu0.6, OpenSSL 3.0.2 15 Mar 2022 里的 sshd

生成密钥时用的命令：

```sh
ssh-keygen -t rsa -m PEM
```

## 关键日志

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

## 解决思路

A. 看 sshd 的日志

B. 想办法用 JSch 现写一个连接测试

C. 想办法调试 Hadoop，看源码

## 解决方法

A，选简单直接的。在怀疑别人代码之前，先怀疑自己配置

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

这应该是集群自带的心跳机制，不是问题