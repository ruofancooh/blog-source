---
title: HD00 - 搭建 Hadoop 环境
date: 2023-09-11 17:45:00
categories: Hadoop
permalink: HD/00/
links:
  - 在Windows中安装Linux虚拟机
---

Hadoop 完全分布式模式环境配置：

| 用                                                                   | 名                                                                                   |
| -------------------------------------------------------------------- | ------------------------------------------------------------------------------------ |
| **物理机系统**                                                       | Windows 10                                                                           |
| **虚拟机容器**                                                       | VMware Workstation 17.0.2 Player（免费的，但是不支持克隆虚拟机，需要手动装另外两台） |
| **虚拟机系统**                                                       | Ubuntu 22.04.3 server                                                                |
| **主角**                                                             | Hadoop 3.3.6                                                                         |
| **SSH 连接虚拟机用的，不装直接操作也可以，装了比较方便可以复制粘贴** | Xshell 7 （可用 VSCode 里调用系统的 cmd 代替，也可以复制粘贴）                       |
| **虚拟机与物理机互传文件用的**                                       | Xftp 7                                                                               |

装了三台机器，名：master、worker1、worker2。（[后来](/blog/HD/04)又改成 ubuntu101、ubuntu102、ubuntu103 了）

配置仅供参考。

<!--more-->

## 在 Windows 中安装 Linux 虚拟机

[教程](/blog/UC/wl)

- 其中，【安装 Ubuntu】的第 4 步，笔者选的还是默认的 DHCP，装好之后再改成静态 IP。
- 第 11 步，要安装 OpenSSH server。
- 不用设置共享文件夹，因为我们有 Xftp。

## 安装 Xshell 和 Xftp

[下载地址](https://www.xshell.com/zh/free-for-home-school/)

## 用 Xftp 连接虚拟机

查看虚拟机的 IP 地址：

```sh
sudo apt install net-tools
ifconfig
```

然后用 Xftp 连接。

## 下载 Hadoop

[下载页面（清华源）](https://mirrors.tuna.tsinghua.edu.cn/apache/hadoop/common/)

笔者这里下载的是`hadoop-3.3.6.tar.gz`。

用 Xftp 把压缩包传到虚拟机的家目录下，然后：

## 安装软件及配置环境变量，写脚本避免重复工作

把脚本也传到家目录，然后执行：

```sh
bash ha.sh
```

其中，安装 OpenJDK 是按照 [https://cwiki.apache.org/confluence/display/HADOOP/Hadoop+Java+Versions](https://cwiki.apache.org/confluence/display/HADOOP/Hadoop+Java+Versions) 里的说明，指向 [https://github.com/apache/hadoop/blob/rel/release-3.2.1/dev-support/docker/Dockerfile#L92](https://github.com/apache/hadoop/blob/rel/release-3.2.1/dev-support/docker/Dockerfile#L92) 里的命令。

`ha.sh`：

```sh
# 安装 JDK
sudo apt-get update;
sudo apt-get install openjdk-8-jdk libbcprov-java;
sudo apt-get clean;
# 存放 Hadoop 压缩包的位置
cd;
# 解压，删除（这两句笔者执行的时候没执行上，重启后手动执行）
sudo tar -zxvf hadoop-3.3.6.tar.gz -C /usr/local;
sudo rm hadoop-3.3.6.tar.gz;
# 写环境变量
# env 查看所有环境变量
# echo $NAME 查看某个
JAVA_HOME="/lib/jvm/java-1.8.0-openjdk-amd64";
HADOOP_HOME="/usr/local/hadoop-3.3.6";
text="export JAVA_HOME=$JAVA_HOME
export HADOOP_HOME=$HADOOP_HOME
export PATH=$PATH:$HADOOP_HOME/bin:$HADOOP_HOME/sbin:$JAVA_HOME/bin
";
sudo echo "$text" >> .bashrc;
# 应用，重启
source .bashrc;
reboot;
```

## 改虚拟机内的文件

[Vim 教程](https://www.runoob.com/linux/linux-vim.html)

不用 Vim，传到真机上修改也可，这样还方便传到其他机器上。注意行尾序列是**LF**，小心操作不当变成 CRLF。

（还可以写一个集群分发脚本，不过暂时没必要）

（[HD01 - 编写 Linux 集群分发脚本](/blog/HD/01)）

把改好的文件存真机上一份，直接用 Xftp 传（如果传输失败，就修改文件权限）。

注意传之前把静态 IP 改了，不同机器设成不同静态 IP。

### 改`00-installer-config.yaml`，改成静态 IP

编辑`/etc/netplan`下的`.yaml`文件：

```sh
cd /etc/netplan
ll
sudo vi 00-installer-config.yaml
```

原来的文件：

```yaml
# This is the network config written by 'subiquity'
network:
  ethernets:
    ens33:
      dhcp4: true
  version: 2
```

修改后的文件：

参考 [https://netplan.readthedocs.io/en/stable/netplan-tutorial/](https://netplan.readthedocs.io/en/stable/netplan-tutorial/)

选择`192.168.78`的依据是：

- 在真机使用`ipconfig`命令得到的【VMnet8】的 IPv4 地址`192.168.78.1`
- 查看 `C:\ProgramData\VMware\vmnetnat.conf` 里的 NAT 网关地址`192.168.78.2`

```yaml
network:
  version: 2
  ethernets:
    ens33:
      dhcp4: false
      dhcp6: false
      addresses:
        - 192.168.78.101/24
      routes:
        - to: default
          via: 192.168.78.2
      nameservers:
        addresses:
          - 192.168.78.2
```

每台机器的`ens33.addresses`要设置成不同的。

测试：

```sh
sudo netplan try
```

回车以应用。

### 改 `hosts`

```sh
sudo vi /etc/hosts
```

```txt
192.168.78.101 master
192.168.78.102 worker1
192.168.78.103 worker2
```

注意，如果有：

```txt
127.0.1.1 [主机名]
```

要把这一行删了，否则绑定不到`192.168.78.x`。暂时不知道有没有不良影响。

### 改`$HADOOP_HOME/etc/hadoop/hadoop-env.sh`

- `JAVA_HOME`：JAVA 主目录
- `HDFS_NAMENODE_USER`：启动集群 NameNode 服务的用户
- `HDFS_DATANODE_USER`：启动集群 DataNode 服务的用户
- `HDFS_SECONDARYNAMENODE_USER`：启动集群 SecondaryNamenode 服务的用户
- `YARN_RESOURCEMANAGER_USER`：启动集群 ResourceManager 服务的用户
- `YARN_NODEMANAGER_USER`：启动集群 NodeManager 服务的用户

```sh
export JAVA_HOME=/lib/jvm/java-1.8.0-openjdk-amd64
export HDFS_NAMENODE_USER=rc
export HDFS_DATANODE_USER=rc
export HDFS_SECONDARYNAMENODE_USER=rc
export YARN_RESOURCEMANAGER_USER=rc
export YARN_NODEMANAGER_USER=rc
```

rc 是笔者每台机器的用户名。

**下面的文件都是在`$HADOOP_HOME/etc/hadoop`目录里。**

### 改`core-site.xml`

- `fs.defaultFS`：NameNode 的地址
- `haoodp.tmp.dir`：HDFS 数据保存的临时目录
- `hadoop.http.staticuser.user`：HDFS 网页登录使用的静态用户

```xml
<configuration>
  <property>
    <name>fs.defaultFS</name>
    <value>hdfs://master:9820</value>
  </property>
  <property>
    <name>hadoop.tmp.dir</name>
    <value>/usr/local/hadoop-3.3.6/data</value>
  </property>
  <property>
    <name>hadoop.http.staticuser.user</name>
    <value>rc</value>
  </property>
</configuration>
```

### 改`hdfs-site.xml`

- `dfs.namenode.http-address`：Web 方式访问 NameNode 的主机和端口号
- `dfs.namenode.secondary.http-address`：SecondaryNamenode 部署的主机

```xml
<configuration>
  <property>
    <name>dfs.namenode.http-address</name>
    <value>master:9870</value>
  </property>
  <property>
    <name>dfs.namenode.secondary.http-address</name>
    <value>worker2:9868</value>
  </property>
</configuration>
```

### 改`mapred-site.xml`

- `mapreduce.framework.name`：配置为 yarn 进行 MapReduce 作业的调度
- `mapreduce.jobhistory.address`：历史服务器端地址
- `mapreduce.jobhistory.webapp.address`：历史服务器 web 地址
- 下面三个环境变量是 Hadoop 的目录。

```xml
<configuration>
  <property>
    <name>mapreduce.framework.name</name>
    <value>yarn</value>
  </property>
  <property>
    <name>mapreduce.jobhistory.address</name>
    <value>worker1:10020</value>
  </property>
  <property>
    <name>mapreduce.jobhistory.webapp.address</name>
    <value>worker1:19888</value>
  </property>
  <property>
    <name>yarn.app.mapreduce.am.env</name>
    <value>HADOOP_MAPRED_HOME=/usr/local/hadoop-3.3.6/</value>
  </property>
  <property>
    <name>mapreduce.map.env</name>
    <value>HADOOP_MAPRED_HOME=/usr/local/hadoop-3.3.6/</value>
  </property>
  <property>
    <name>mapreduce.reduce.env</name>
    <value>HADOOP_MAPRED_HOME=/usr/local/hadoop-3.3.6/</value>
  </property>
</configuration>
```

### 改`yarn-site.xml`

- `yarn.resourcemanager.hostname`： ResourceManager 的主机名
- `yarn.nodemanager.aux-services`：NodeManager 获取数据的方式

```xml
<configuration>
  <property>
    <name>yarn.resourcemanager.hostname</name>
    <value>worker1</value>
  </property>
  <property>
    <name>yarn.nodemanager.aux-services</name>
    <value>mapreduce_shuffle</value>
  </property>
  <!-- 环境变量的继承 -->
  <property>
    <name>yarn.nodemanager.env-whitelist</name>
    <value>JAVA_HOME,HADOOP_COMMON_HOME,HADOOP_HDFS_HOME,HAD
      OOP_CONF_DIR,CLASSPATH_PREPEND_DISTCACHE,HADOOP_YARN_HOME,
      HADOOP_MAPRED_HOME</value>
  </property>
  <!-- 开启日志聚集功能 -->
  <property>
    <name>yarn.log-aggregation-enable</name>
    <value>true</value>
  </property>
  <!-- 设置日志聚集服务器地址 -->
  <property>
    <name>yarn.log.server.url</name>
    <value>http://worker1:19888/jobhistory/logs</value>
  </property>
  <!-- 设置日志保留时间 7 天 -->
  <property>
    <name>yarn.log-aggregation.retain-seconds</name>
    <value>604800</value>
  </property>
</configuration>
```

### 改`workers`

```txt
worker1
worker2
```

## 再建两个虚拟机 worker1 和 worker2，配置好之后，互相复制 SSH KEY

三台机器上都执行：

```sh
ssh-keygen -t rsa -m PEM
```

SSH-2.0-JSCH-0.1.54

笔者这里的版本是 `OpenSSH_8.9p1 Ubuntu-3ubuntu0.6, OpenSSL 3.0.2 15 Mar 2022`，要加上 `-m PEM`，确保私钥以 -----BEGIN **RSA** PRIVATE KEY----- 开头。[后续错误](https://www.cnblogs.com/simple-li/p/14654812.html)

三台机器上都执行：

```sh
ssh-copy-id master
ssh-copy-id worker1
ssh-copy-id worker2
```

## 格式化 HDFS

只用在 master 执行一次：

```sh
hdfs namenode -format
```

如果以后遇到问题，需要重新格式化时，需停止进程，然后删除每台机器的 `$HADOOP_HOME/data/` 和 `$HADOOP_HOME/logs/`。

## 启动 Hadoop

在 master 执行：

```sh
start-all.sh
```

## 启动历史服务器

在 worker1 执行：

```sh
mapred --daemon start historyserver
```

## 检查环境

### 查看相关进程

```sh
jps
```

master 应该有：

```txt
[PID] NameNode
[PID] Jps
```

worker1 应该有：

```txt
[PID] Jps
[PID] JobHistoryServer
[PID] DataNode
[PID] NodeManager
```

worker2 应该有：

```txt
[PID] NodeManager
[PID] SecondaryNameNode
[PID] Jps
[PID] DataNode
```

### 查看进程的 Web 端口

```sh
netstat -tunlp
```

- -t：显示 TCP 连接信息
- -u：显示 UDP 连接信息
- -n：以数字形式显示 IP 地址和端口号
- -l：仅显示监听状态的连接
- -p：显示与连接关联的进程信息

## 改真机的`hosts`，方便用浏览器访问

`C:\Windows\System32\drivers\etc\hosts`：

```txt
192.168.78.101 master
192.168.78.102 worker1
192.168.78.103 worker2
```

## 用浏览器访问 Namenode

master:9870

## 测试进行 wordcount

### 创建文件夹在 Ubuntu

```sh
cd $HADOOP_HOME
mkdir wcinput
```

### 创建文本文档在 Ubuntu

```sh
cd wcinput
vi word.txt
```

`word.txt`：

```txt
ss ss
cls cls
aaabbbccc
rf rf rfr
```

### 创建文件夹到 HDFS

```sh
hadoop fs -mkdir /wcinput
```

### 上传文件到 HDFS

```sh
hadoop fs -put word.txt /wcinput
```

### 测试进行 wordcount

```sh
cd $HADOOP_HOME
hadoop jar share/hadoop/mapreduce/hadoop-mapreduce-examples-3.3.6.jar wordcount /wcinput /wcoutput
```

如果成功，HDFS 的`/wcoutput`目录里会有一个`_SUCCESS`文件和输出文件，可以通过浏览器查看：

master:9870 -> 菜单 -> Utilities -> Browse the file system -> `/wcoutput/part-r-00000`：

```txt
aaabbbccc	1
cls	2
rf	2
rfr	1
ss	2
```

## 用浏览器访问 JobHistory

worker1:19888

## 停止 Hadoop

在 master 执行：

```sh
stop-all.sh
```
