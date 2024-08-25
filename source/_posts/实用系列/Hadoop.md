---
title: Hadoop
date: 2024-04-26 17:45:00
categories: 实用系列
permalink: hadoop.html
---

Hadoop 基础不牢。

<!--more-->

分享一种不看完整教程把集群搭起来的方法：

1. 在你软件安装的目录里面，通常有一个 doc 文件夹
2. 在解压软件包之后，什么配置都别写，上来先启动了再说
3. 找到你软件的日志文件在哪里
4. 在日志里搜索 `WARN` `ERROR`
5. 在网上搜索或者问 GPT 为什么会出现这个错误

<style>
    .main{
        width:100%
    }
</style>

Hadoop 是一个软件，它是用 Java 写的，需要运行在 Java 虚拟机上。你以后还要通过写 Java 代码来连接它其中的一个组件，叫 HDFS。所有 Java 代码都得过一道 Java 编译器，然后在 JVM（Java 虚拟机）上运行。

我们为什么要装 Linux 虚拟机？

1. 模拟分布式集群
2. 生产环境都用 Linux

按理来说：

1. Hadoop 需要 JVM 去运行
2. 在 Windows 上照样可以运行 JVM
3. Hadoop 可以运行在 Windows 上

## Java 代码运行环境的问题

“连接 HDFS”是什么意思？再往前问：你是如何知道你的“集群”是正在运行着的？用 `jps` 查看 Java 进程。

`jps` 查看的是什么？是所有正在运行着的 JVM 实例，每一个进程是一个单独的 JVM。

“连接 HDFS”的意思是：再运行一个新的 JVM，称为“客户端”。这个 JVM 要与另一个 JVM 通信，那个 JVM 叫 NameNode。怎么通信？虽然不知道细节，但你可能看过这样的代码：

```java
package com.example;

import java.io.IOException;
import java.net.URI;
import java.net.URISyntaxException;

import org.apache.hadoop.conf.Configuration;
import org.apache.hadoop.fs.FileStatus;
import org.apache.hadoop.fs.FileSystem;
import org.apache.hadoop.fs.Path;

public class App {
    public static void main(String[] args) throws IOException, URISyntaxException {
        Configuration conf = new Configuration();
        FileSystem fs = FileSystem.get(new URI("hdfs://ubuntu101:9820"), conf);
        FileStatus[] fileStatuses = fs.listStatus(new Path("/"));
        for (FileStatus status : fileStatuses) {
            System.out.println(status.getPath());
        }
        fs.close();
    }
}
```

现在的问题在于：

1. <b>它 `import` 的东西是怎么来的？</span></b>
2. <b>在它编译完之后，放到 JVM 上运行的时候（即“运行时”），它还需不需要它 `import` 的东西？</span></b>
3. <b>它运行时的 JVM 在哪里，在虚拟机上还是在物理机上？如果在物理机上，它能不能与虚拟机通信？</span></b>
4. <b>IDE 起的是什么作用？</span></b>

先回答第四个问题：IDE 起的是工具人的作用。如果你用的 IDEA，并且成功连接 HDFS 了，你会在 IDEA 的命令行看到：

```sh
/lib/jvm/java-8-openjdk-amd64/bin/java -javaagent:/opt/idea-IC-241.15989.150/lib/idea_rt.jar=43273:/opt/idea-IC-241.15989.150/bin\
                                        -Dfile.encoding=UTF-8\
                                        -classpath /lib/jvm/java-8-openjdk-amd64/jre/lib/charsets.jar:/后面全都是Jar包的路径
```

它就是执行了一条命令：打开你的 JDK 目录里的 `java` ，然后向这个东西传了几个参数：工具人、文件编码、classpath

关键的就是 classpath，你需要保证你代码“运行时”的东西能在 classpath 里找到。

再回答第二个问题：它 `import` 的东西都是它的“运行时”需要的东西吗？

不一定，这是它“编译时”需要的东西。当他报错报找不到某个类的时候，就是它“运行时”需要的东西。

再回答第一个问题：搞到这些 jar 包。

- 用 Maven
- 如果你看过你 Hadoop 的安装目录，你会看到一个 `share` 文件夹

对于第三个问题的解决思路：

- 在虚拟机上运行客户端，连接虚拟机上的 NameNode
- 在物理机上运行客户端，连接物理机上的 NameNode（如果你物理机搞成功了）
- 在物理机上运行客户端，通过 winutils 这个中间人与虚拟机上的 NameNode 通信

笔者最终的解决方案是：在虚拟机上安装 IDE，把 `$HADOOP_HOME/share/hadoop` 里的 Jar 包导进 IDE 里（这里用的是 IDEA），按播放键运行。如果报找不到类的错误，注意：在 `$HADOOP_HOME/share/hadoop/子文件夹` 下还有一个叫 `lib` 的文件夹。

但是这种方法存在一个潜在的问题：<b>Jar 包冲突</span></b>。如果你新建了一个 Scala 2.12.15 的工程，用到 Spark 和 HDFS，并且在 `build.sbt` 里什么依赖都没写，只是把 Hadoop 3.3.6 和 Spark 3.5.1 自带的 Jar 包导进去了，你会遇到这样一个错误：

```log
Scala module 2.15.2 requires Jackson Databind version >= 2.15.0 and < 2.16.0
- Found jackson-databind version 2.12.7
```

这又是几个问题：

1. Scala module 2.15.2 是怎么回事？不是 2.12.15 吗？
2. Found jackson-databind version 2.12.7 是哪里来的？是 Hadoop 的 Share 文件夹里的：common 目录下一个，hdfs 目录下一个。如果把它们删了，上面的报错问题可以解决，但是 NameNode 会起不起来了。

幸运的是：在笔者重建了一次工程之后，这个问题就没有出现了。所以可能是 IDEA 的锅。

## 安装 Ubuntu 22.04.3

1. 下载 Linux 操作系统镜像，可以理解为操作系统的“安装包”。https://launchpad.net/ubuntu/+cdmirrors
2. 下载一个支持在 Windows 操作系统下运行 Linux 镜像的软件（宿主），它相当于一个没装操作系统的电脑，但是装了引导加载程序 GRUB
   - 使用 VM Player
3. 在宿主里“创建两台虚拟机”，相当于对这一份镜像，安装了两个新的操作系统，运行在你的宿主和 Windows 操作系统上

前面三步改用 WSL（适用于 Linux 的 Windows 子系统）https://learn.microsoft.com/zh-cn/windows/wsl/

4. 配置网络，给虚拟机和物理机搭上鹊桥

   - 不同虚拟机采用不同静态 IP
   - 把虚拟机网卡路由到宿主的网关，在 `C:\ProgramData\VMware\vmnetnat.conf` 查看 VM 的 NAT 网关地址
   - 修改 `/etc/hostname` 为自定义主机名
   - `/etc/hosts` `C:\Windows\System32\drivers\etc\hosts`

如果你用的是 WSL，你在它上面开一个端口，可以直接在物理机上使用 `localhost:port` 访问。**如果你装了两台 WSL，它们的 IP 会是相同的**，这个问题不好解决。据说学大数据的都找不到大数据相关工作。那我们就退而求其次，根本没有必要搭分布式集群，在一台机器上搭个伪分布式就行了，文件分片只分一片。这样配置文件还不至于备份来备份去，只保留一份配置文件。

5. 配置 Ubuntu 软件源 https://mirrors.ustc.edu.cn/help/ubuntu.html
6. 安装 JDK https://cwiki.apache.org/confluence/display/HADOOP/Hadoop+Java+Versions

7. 写环境变量

8. 配置 SSH https://wangdoc.com/ssh/

### 网络

如果你用的 WSL + 单机伪分布式，只需要修改 `/etc/wsl.conf`：

```conf
[network]
hostname=localhost
```

```sh
exit
wsl --shutdown
wsl
```

如果你用的 VM + Ubuntu 22.04:

编辑`/etc/netplan`下的`00-installer-config.yaml`文件。[netplan 文档](https://netplan.readthedocs.io/en/stable/netplan-tutorial/)

选择`192.168.78`的依据是：

- 在物理机使用`ipconfig`命令得到的【VMnet8】的 IPv4 地址`192.168.78.1`
- 查看 `C:\ProgramData\VMware\vmnetnat.conf` 里的 NAT 网关地址`192.168.78.2`

```yaml
network:
  version: 2
  ethernets:
    ens33:
      dhcp4: false
      dhcp6: false
      addresses:
        - 192.168.78.101/24 # 每台机器设置成不同的
      routes:
        - to: default
          via: 192.168.78.2
      nameservers:
        addresses:
          - 192.168.78.2
```

```sh
sudo netplan try
```

### SSH

如果你用的 WSL + 单机伪分布式，下面两条命令只用做一次。

如果你搭的分布式：每台机器上都执行：

```sh
ssh-keygen -t rsa -m PEM
```

笔者这里的版本是 `OpenSSH_8.9p1 Ubuntu-3ubuntu0.6, OpenSSL 3.0.2 15 Mar 2022`，要加上 `-m PEM`，确保私钥以 -----BEGIN **RSA** PRIVATE KEY----- 开头。[后续错误](https://www.cnblogs.com/simple-li/p/14654812.html)

每台机器上都执行：

```sh
ssh-copy-id ubuntu101
ssh-copy-id ubuntu102
...
```

### 存储空间

```sh
sudo du -h --max-depth=1
```

- 给虚拟机扩容：`https://hrfis.me/blog/linux.html#扩容`
- 使用 https://www.diskgenius.cn/ 可以把你 D 盘的空间向 C 盘匀一点。如果你有多余的恢复分区，可以把它删了，只保留一个。
- 使用 https://github.com/redtrillix/SpaceSniffer 可以可视化地展示你硬盘的占用情况。

### 中文字体

```sh
sudo apt install language-pack-zh-hans
sudo vi /etc/default/locale
sudo mv /mnt/c/path/to/font ~ /usr/share/fonts
```

```conf
LANG=zh_CN.UTF-8
LANGUAGE="zh_CN:zh:en_US:en"
```

## Hadoop 3.3.6

9. 下载 Hadoop 软件包
   - 在虚拟机上直接用 `wget`
   - 用物理机下载它，从物理机的文件系统上再转移到虚拟机的文件系统上（在你的物理机硬盘上表现为 `.vmdk` 文件）
     - VM Player 有共享文件夹功能，把你物理机硬盘的某一个文件夹挂载到虚拟机的 `/mnt/hgfs/Shared`
     - 如果使用 WSL，你的物理机硬盘会被挂载到虚拟机的 `/mnt`
     - 使用 XFtp 软件，与你的虚拟机进行 SSH 网络协议连接
10. 在两台虚拟机上都把软件包解压。`/opt` 目录是空的，option 的意思，让你自己选择装不装到这里。

### 配置

11. 修改它们的配置文件，要保证每台机器配置文件内容相同。使用 VSCode 的 Remote-SSH 插件可以直接修改虚拟机内的文件，如果你用的是 WSL 更方便。

在 $HADOOP_HOME/share/doc/hadoop/index.html 左下角有默认的配置文件。

- `hadoop-env.sh` 指定 JAVA_HOME，启动 JVM 时的参数
- `core-site.xml` 指定 hdfs 的 URI，文件系统存在本地哪个目录
- `hdfs-site.xml` 指定谁当 NN、2NN，副本个数
- `mapred-site.xml` 指定 MR 框架，MR 历史服务器
- `yarn-site.xml` 指定 RM，YARN 历史服务器
- `workers` 指定谁当 DataNode

勤看日志。当 CPU 占用高，写磁盘不到 1MB/s，可能是出问题了在一直写 log。

- 我们为什么要在 `hadoop-env.sh` 里写 `JAVA_HOME`？因为没写的时候，它会报错： JAVA_HOME is not set and could not be found；
- 我们为什么要配置 SSH？因为没配置它会报错：Could not resolve hostname xxx: Name or service not known；
- 我们为什么要在 `core-site.xml` 里配置 `fs.defaultFS` ？因为没配置它会报错：Cannot set priority of namenode process xxx。在日志文件里有：No services to connect, missing NameNode address；
- 我们为什么要在 `core-site.xml` 里配置 `hadoop.tmp.dir` ？因为它默认存在 `/tmp` 文件夹下，而 `/tmp` 文件夹一重启就没了；
- 我们为什么要在 `hdfs-site.xml` 里配置 `dfs.namenode.http-address` ？因为我们想用浏览器访问 HDFS；
- 我们为什么要在 `core-site.xml` 里配置 `hadoop.http.staticuser.user` ？因为如果不配置，只有读的权限，没有写的权限；
- ~~我们为什么可以不在 `hadoop-env.sh` 里配置各种用户名？因为还没有遇到报错的时候~~

12. 在 NameNode 上执行 `hdfs -namenode format`，把 Hadoop 的文件系统 HDFS 初始化。在你的物理机文件系统上有一个虚拟机文件系统，在虚拟机文件系统上又有一个 HDFS

### MapReduce

1. `start-dfs.sh` 再 `jps` 查看 JVM 进程，你会看到 NN、2NN、DN
2. 不需要 `start-yarn.sh`（如果你没有指定 MR 框架为 YARN，它默认为 local）
3.

```sh
cd
vi 1.txt
hdfs dfs -put 1.txt /wcinput
hadoop jar $HADOOP_HOME/share/hadoop/mapreduce/hadoop-mapreduce-examples-3.3.6.jar wordcount /wcinput /wcoutput
```

#### 配置

```xml
<property>
  <name>mapreduce.framework.name</name>
  <value>yarn</value>
</property>
<property>
  <name>yarn.app.mapreduce.am.env</name>
  <value>HADOOP_MAPRED_HOME=/opt/hadoop-3.3.6</value>
</property>
<property>
  <name>mapreduce.map.env</name>
  <value>HADOOP_MAPRED_HOME=/opt/hadoop-3.3.6</value>
</property>
<property>
  <name>mapreduce.reduce.env</name>
  <value>HADOOP_MAPRED_HOME=/opt/hadoop-3.3.6</value>
</property>
```

### HDFS

```sh
start-dfs.sh
```

```sh
hdfs oev -p XML -i edits_xxxx -o ./edits_xxxx.xml
```

```sh
hdfs oiv -p XML -i fsimage_xxxx -o ./fsimage_xxxx.xml
```

EditLog 和 FsImage 在：

- NN 的 `${hadoop.tmp.dir}/dfs/name/current`
- 2NN 的 `${hadoop.tmp.dir}/data/dfs/namesecondary/current`

### YARN

```sh
start-yarn.sh
```

#### 配置

```xml
<property>
  <name>yarn.resourcemanager.hostname</name>
  <value>localhost</value>
</property>
<property>
  <name>yarn.nodemanager.aux-services</name>
  <value>mapreduce_shuffle</value>
</property>
```

## ZooKeeper

如果你只用一台机器，应该不用装。

ZooKeeper 特点是只要有半数以上的节点正常工作，整个集群就能正常工作，所以适合装到奇数台服务器上。

配置 `zkData/myid`

配置 `conf/zoo.cfg`

```
dataDir=/usr/local/zookeeper-3.8.2/zkData
server.101=master:2888:3888
server.102=worker1:2888:3888
```

## HBase 2.5.8

它自带 ZooKeeper 3.8.3，StandAlone 模式下只有一个 HMaster 进程：其中包括 HMaster，单个 HRegionServer 和 ZooKeeper 守护进程。

它的数据可以存在本地或 HDFS 上，这里配置存在 HDFS 上。

https://hbase.apache.org/book.html#standalone_dist

https://hbase.apache.org/book.html#shell_exercises

### 命令

```sh
start-dfs.sh
start-hbase.sh
hbase shell
```

```sh
help
list
create 'tablename','cfname1','cfname2'
put 'tablename','rowkey','cfname1:qualifiername1','value'
put 'tablename','rowkey','cfname2:','value'
scan 'tablename'
scan 'tablename',{COLUMNS=>'cfname1'}
get 'tablename','rowkey'
describe 'tablename'
truncate 'tablename'
drop 'tablename'
```

### 配置

如果你没有在 `hbase-env.sh` 里配置 `JAVA_HOME`，你会看到：

```
127.0.0.1: +======================================================================+
127.0.0.1: |                    Error: JAVA_HOME is not set                       |
127.0.0.1: +----------------------------------------------------------------------+
127.0.0.1: | Please download the latest Sun JDK from the Sun Java web site        |
127.0.0.1: |     > http://www.oracle.com/technetwork/java/javase/downloads        |
127.0.0.1: |                                                                      |
127.0.0.1: | HBase requires Java 1.8 or later.                                    |
127.0.0.1: +======================================================================+
```

`hbase-site.xml`：

```xml
  <property>
    <name>hbase.cluster.distributed</name>
    <value>false</value>
  </property>
  <property>
    <name>hbase.rootdir</name>
    <value>hdfs://localhost:9820/hbase</value>
  </property>
   <property>
    <name>hbase.wal.provider</name>
    <value>filesystem</value>
  </property>
```

如果不设置 zkData 目录，它会在 `/tmp/hbase-yourname` 下。

第三个配置项是为了解决：参见 https://hbase.apache.org/book.html#wal.providers

```log
ERROR [RS-EventLoopGroup-3-2] util.NettyFutureUtils (NettyFutureUtils.java:lambda$addListener$0(58)) - Unexpected error caught when processing netty
java.lang.IllegalArgumentException: object is not an instance of declaring class
```

## Spark 3.5.1

### 命令

```sh
start-master.sh
start-workers.sh
```

```sh
spark-submit --class org.apache.spark.examples.SparkPi --master yarn $SPARK_HOME/examples/jars/spark-examples_2.12-3.5.1.jar
```

```sh
spark-shell --master yarn
val textFile = sc.textFile("hdfs://localhost:9820/wcinput")
textFile.count()
```

### 配置

`spark-env.sh`：

```sh
export SPARK_DIST_CLASSPATH=$(/opt/hadoop-3.3.6/bin/hadoop classpath)
export HADOOP_CONF_DIR=/opt/hadoop-3.3.6/etc/hadoop
export SPARK_MASTER_HOST=localhost
```

`workers`：

```
localhost
```

## Hive 4.0.0

https://developer.aliyun.com/article/632261

Hive 的数据默认存在 HDFS 里，元数据可以存在 MySQL 上。

分外部表和内部表。内部表默认存在 HDFS，外部表可以存在 HBase 里。

### 配置元数据存在 MySQL 上

https://www.mysqltutorial.org/getting-started-with-mysql/install-mysql-ubuntu/

```sh
sudo systemctl start mysql.service
mysql -u root -p
create database hive;
```

把 MySQL 驱动程序 https://dev.mysql.com/downloads/connector/j/ JAR 包复制到 `$HIVE_HOME/lib`

`hive-site.xml`：

```xml
  <property>
    <name>javax.jdo.option.ConnectionURL</name>
    <value>jdbc:mysql://localhost:3306/hive</value>
    <description>
      JDBC connect string for a JDBC metastore.
      To use SSL to encrypt/authenticate the connection, provide database-specific SSL flag in the connection URL.
      For example, jdbc:postgresql://myhost/db?ssl=true for postgres database.
    </description>
  </property>
  <property>
    <name>javax.jdo.option.ConnectionDriverName</name>
    <value>com.mysql.jdbc.Driver</value>
    <description>Driver class name for a JDBC metastore</description>
  </property>
  <property>
    <name>javax.jdo.option.ConnectionUserName</name>
    <value>root</value>
    <description>Username to use against metastore database</description>
  </property>
    <property>
    <name>javax.jdo.option.ConnectionPassword</name>
    <value>xxx</value>
    <description>password to use against metastore database</description>
  </property>
```

```sh
schematool -dbType mysql -initSchema
```

```sh
mysql -u root -p
use hive;
show tables;
select * from DBS;
```

### 启动 MySQL、DFS、YARN 和 HiveServer2，再用 beeline 连接 HS2

它的日志默认在 `${java.io.tmpdir}/yourname/hive.log`

```sh
java -XshowSettings:properties -version
sudo systemctl start mysql.service
start-dfs.sh
start-yarn.sh
hiveserver2
beeline -u "jdbc:hive2://localhost:10000/;user=yourname"
help
```

运行建表脚本：

```sh
0: jdbc:hive2://localhost:10000/> !run /path/to/create_table1.hql
```

执行 HQL：

```sh
0: jdbc:hive2://localhost:10000/> show tables;
0: jdbc:hive2://localhost:10000/> select * from table1;
0: jdbc:hive2://localhost:10000/> drop table table1;
```

### 创建内部分区表

它的 LOAD DATA INTO TABLE 操作会调用 MapReduce

加 LOCAL 是本地的，不加是 HDFS 的（？）

HQL 示例：

```sql
CREATE TABLE table1 (
  id STRING,
  name STRING,
  age INT,
  department STRING
)
PARTITIONED BY (city STRING)
ROW FORMAT DELIMITED
FIELDS TERMINATED BY '\t'
STORED AS TEXTFILE;

ALTER TABLE table1 ADD PARTITION (city='nanjing');
ALTER TABLE table1 ADD PARTITION (city='wuhan');
ALTER TABLE table1 ADD PARTITION (city='shanghai');
ALTER TABLE table1 ADD PARTITION (city='beijing');

LOAD DATA LOCAL INPATH '/home/rc/hive_test/data1.txt' INTO TABLE table1;

SELECT * FROM table1;
```

文本文件示例：

```
1	Alice	25	HR	nanjing
2	Bob	30	Finance	wuhan
3	Charlie	28	Sales	shanghai
4	David	35	Marketing	beijing
5	Eve	32	IT	nanjing
6	Frank	27	HR	wuhan
```

### 创建有结构列的内部分区表

```sql
CREATE TABLE table2 (
  id INT,
  name STRING,
  hobbies ARRAY<STRING>,
  address_map MAP<STRING, STRING>
)
ROW FORMAT DELIMITED
FIELDS TERMINATED BY ','
COLLECTION ITEMS TERMINATED BY ';'
MAP KEYS TERMINATED BY ':';

LOAD DATA LOCAL INPATH '/home/rc/hive_test/data2.txt' INTO TABLE table2;

SELECT * FROM table2;
```

```
1,Lilei,book;tv;code,beijing:chaoyang;shanghai:pudong
2,Hanmeimei,book;Lilei;code;basketball,beijing:haidian;shanghai:huangpu
```

### 创建外部分桶表到 HBase，用临时表数据覆写

```sql
CREATE EXTERNAL TABLE table3 (
    rowid STRING,
    name STRING,
    sex STRING,
    age INT
)
CLUSTERED BY (rowid) INTO 5 BUCKETS
STORED BY 'org.apache.hadoop.hive.hbase.HBaseStorageHandler'
WITH SERDEPROPERTIES (
    "hbase.columns.mapping" = ":key,cf:name,cf:sex,cf:age"
)
TBLPROPERTIES (
    "hbase.table.name" = "table3"
);
```

```
CREATE TEMPORARY TABLE table4 (
  rowid STRING,
  name STRING,
  department STRING,
  age INT
)
ROW FORMAT DELIMITED
FIELDS TERMINATED BY ':';

LOAD DATA LOCAL INPATH '/home/rc/hive_test/data3.txt' INTO TABLE table4;

INSERT OVERWRITE TABLE table3
SELECT * FROM table4;

SELECT * FROM table3;
```

重启 Hive 客户端后，临时表 table4 会消失

```
1:John:Male:25
2:Smith:Female:30
3:Bob:Male:40
4:Alice:Female:22
5:Michael:Male:35
6:Emily:Female:28
```

### 配置

```log
java.lang.RuntimeException: Error applying authorization policy on hive configuration: java.net.URISyntaxException: Relative path in absolute URI: ${system:java.io.tmpdir%7D/$%7Bsystem:user.name%7D
	at org.apache.hive.service.cli.CLIService.init(CLIService.java:122) ~[hive-service-4.0.0.jar:4.0.0]
```

在 `hive-site.xml` 里把报错信息里报的开头的 `system` 去了

```log
java.lang.RuntimeException: java.lang.RuntimeException: org.apache.hadoop.ipc.RemoteException(org.apache.hadoop.security.authorize.AuthorizationException): User: xxx is not allowed to impersonate anonymous
	at org.apache.hive.service.cli.session.HiveSessionProxy.invoke(HiveSessionProxy.java:89) ~[hive-service-4.0.0.jar:4.0.0]
```

`core-site.xml`：

```xml
  <property>
	  <name>hadoop.proxyuser.xxx.hosts</name>
	  <value>*</value>
  </property>
  <property>
	  <name>hadoop.proxyuser.xxx.groups</name>
	  <value>*</value>
  </property>
```

## Flume 1.11.0

<img src="https://flume.apache.org/_images/DevGuide_image00.png">

Flume 是一个水槽，用于采集、聚合和传输流数据（事件）。对于每一个代理 agent，有源 source、汇 sink、渠道 channel。

https://flume.apache.org/documentation.html

### 启动参数

```sh
flume-ng agent --conf conf -f <配置文件路径> -n <代理名>
```

注意：下面的配置不一定对。笔者不小心把配置文件夹删了，但是保留的还有配置内容截图。所以下面的实际是 [OCR](https://web.baimiaoapp.com/) 过来后再修改的。之前是实验成功了的，而之后没有做过实验。

### Hello（netcat 源与 logger 接收器）

```conf
# 代理名为 a1
# 以 s 结尾说明可以有多个 source、sink、channel
a1.sources = r1
a1.sinks = k1
a1.channels = c1

# 设置 a1 的渠道 c1 为内存通道
a1.channels.c1.type = memory
a1.channels.c1.capacity = 1000
a1.channels.c1.transactionCapacity = 100

# 把 a1 的源和汇 r1 和 k1 绑定到 a1 的渠道 c1 上
# source 可以指定多个渠道，sink 只能指定一个
# 以多种方式流向一个结果
a1.sources.r1.channels = c1
a1.sinks.k1.channel = c1

# 设置 a1 的源 r1 为一个 netcat-like source
# 行为像 nc -lk [host] [port]
# 它侦听给定端口并将每行文本转换为一个事件
a1.sources.r1.type = netcat
a1.sources.r1.bind = localhost
a1.sources.r1.port = 44444

# 设置 a1 的汇 k1 为 logger 类型，写到 flume.log 里面
a1.sinks.k1.type = logger
```

### 实时监控单个追加文件（exec 源与 hdfs 接收器）

Exec Source 在启动时运行给定的 Unix 命令，并期望该进程在标准输出时连续生成数据。使用 `tail –F <filename>` 命令可以看到文件末尾的实时追加。

这里监控本机的 datanode 日志，并上传到 HDFS。

```conf
# 代理
a2.sources = r2
a2.sinks = k2
a2.channels = c2

# 渠道
a2.channels.c2.type = memory
a2.channels.c2.capacity = 1000
a2.channels.c2.transactionCapacity = 100

# 源
a2.sources.r2.type = exec
a2.sources.r2.command = tail -F /opt/hadoop-ha/hadoop-3.3.6/logs/hadoop-rc-datanode-ubuntu101.log
a2.sources.r2.channels= c2

# 汇
a2.sinks.k2.type = hdfs
a2.sinks.k2.hdfs.path = hdfs://mycluster/flume/%Y%m%d/%H
a2.sinks.k2.hdfs.filePrefix = logs-
a2.sinks.k2.hdfs.fileType = DataStream
# 使用本地事件戳，把时间戳向下舍入，结合上面的配置是以小时作为子文件夹，即按小时分隔a2.sinks.k2.hdfs.useLocalTimeStamp = true
a2.sinks.k2.hdfs.round = true
a2.sinks.k2.hdfs.roundValue = 1
a2.sinks.k2.hdfs.roundUnit = hour
# 最多积攒多少个事件后，才将文件 flush 到 HDFS
a2.sinks.k2.hdfs.batchSize = 100
# 指定多少秒生成一个新的文件（滚动）
a2.sinks.k2.hdfs.rollInterval = 60
# 生成的文件最大大小（字节），略小于128M（HDFS的文件分块大小）
a2.sinks.k2.hdfs.rollSize = 134217700
# 不指定滚动文件的事件数量
a2.sinks.k2.hdfs.rollCount = 0
a2.sinks.k2.channel = c2
```

### 实时监控多个新文件（spooldir 源与 hdfs 接收器）

Spooling Directory Source 监视指定目录中的新文件，并在新文件出现时解析事件。

这里监控 `/opt/flume-1.11.0/upload` 目录。向目录里添加文件后，上传到 HDFS。

```conf
# 代理
a3.sources = r3
a3.sinks = k3
a3.channels = c3
# 渠道
a3.channels.c3.type = memory
a3.channels.c3.capacity = 1000
a3.channels.c3.transactionCapacity = 100
# 源
a3.sources.r3.type = spooldir
a3.sources.r3.spoolDir = /opt/flume-1.11.0/upload
a3.sources.r3.fileSuffix = .COMPLETED
# 是否添加存储绝对路径文件名的标头
a3.sources.r3.fileHeader = true
# 忽略以.tmp 结尾的文件
# [^ ]*匹配任意不是空格的字符零次或多次
a3.sources.r3.ignorePattern = ^([^ ]*\.tmp)$

a3.sources.r3.channels = c3

# 汇
a3.sinks.k3.type = hdfs
a3.sinks.k3.hdfs.path = hdfs://mycluster/flume/upload/%Y%m%d/%H
a3.sinks.k3.hdfs.filePrefix = upload-
a3.sinks.k3.hdfs.fileType = DataStream
# 使用本地事件戳，把时间戳向下舍入，结合上面的配置是以小时作为子文件夹，即按小时分隔
a3.sinks.k3.hdfs.useLocalTimeStamp = true
a3.sinks.k3.hdfs.round = true
a3.sinks.k3.hdfs.roundValue = 1
a3.sinks.k3.hdfs.roundUnit = hour
# 最多积攒多少个事件后，才将文件 flush 到 HDFS
a3.sinks.k3.hdfs.batchSize = 100
# 指定多少秒生成一个新的文件（滚动）
a3.sinks.k3.hdfs.rollInterval = 60
# 生成的文件最大大小（字节），略小于128M（HDFS的文件分块大小）
a3.sinks.k3.hdfs.rollSize = 134217700
# 不指定滚动文件的事件数量
a3.sinks.k3.hdfs.rollCount = 0

a3.sinks.k3.channel = c3
```

### 实时监控多个追加文件（TAILDIR 源与 hdfs 接收器）

Taildir Source：监视指定的文件，并在检测到附加到每个文件的新行后几乎实时地跟踪它们。如果正在写入新行，则此源将重试读取它们，等待写入完成。

监控 flume 目录里的 upload 目录和 upload1 目录。

```conf
# 代理
a4.sources = r4
a4.sinks = k4
a4.channels = c4
# 渠道
a4.channels.c4.type = memory
a4.channels.c4.capacity = 1000
a4.channels.c4.transactionCapacity = 100
# 源
a4.sources.r4.type = TAILDIR
# JSON 格式的文件，用于记录每个尾部文件的inode、绝对路径和最后位置
a4.sources.r4.positionFile = /opt/flume-1.11.0/taildir_position.json
a4.sources.r4.filegroups = f1 f2
# 正则表达式只能用于文件名
a4.sources.r4.filegroups.f1 = /opt/flume-1.11.0/upload/.*
a4.sources.r4.filegroups.f2 = /opt/flume-1.11.0/upload1/.*
a4.sources.r4.channels = c4


# 汇
a4.sinks.k4.type = hdfs
a4.sinks.k4.hdfs.path = hdfs://mycluster/flume/upload/%Y%m%d/%H
a4.sinks.k4.hdfs.filePrefix = upload-
a4.sinks.k4.hdfs.fileType = DataStream
# 使用本地事件戳，把时间戳向下舍入，结合上面的配置是以小时作为子文件夹，即按小时分隔
a4.sinks.k4.hdfs.useLocalTimeStamp = true
a4.sinks.k4.hdfs.round = true
a4.sinks.k4.hdfs.roundValue = 1
a4.sinks.k4.hdfs.roundUnit = hour
# 最多积攒多少个事件后，才将文件 flush 到 HDFS
a4.sinks.k4.hdfs.batchSize = 100
# 指定多少秒生成一个新的文件（滚动）
a4.sinks.k4.hdfs.rollInterval = 20
# 生成的文件最大大小（字节），略小于128M（HDFS的文件分块大小）
a4.sinks.k4.hdfs.rollSize = 134217700
# 不指定滚动文件的事件数量
a4.sinks.k4.hdfs.rollCount = 0

a4.sinks.k4.channel = c4
```

查看 `taildir_position.json`：其中 inode 号码是操作系统里文件的唯一 id，pos 是 flume 的读取到的最新的文件位置（偏移量）

Taildir source 是存在问题的：如果文件名变了，会重新上传。如果日志的文件名在一天过后变了，它会被重新上传一份。解决方案有修改 flume 的源码，或者修改生成日志文件名部分的源码。

### 监控 MapReduce 结果，上传到 HDFS

（1）使用 Flume 的 spooldir 源递归监控 `/opt/result/` 目录下的文件，汇总到 hdfs 接收器 `hdfs://mycluster/flume/mrresult`。

（2）将文献上传到 HDFS 的 `/wcinput` 目录，执行 MR 输出到本地路径 `file:///opt/result/mrresult`

注意：如果提前建好 MR 的输出目录，MR 会报错。而如果不提前建好 flume 的监控目录，flume 会报错。

所以只提前建好外层目录，用 flume 递归监控外层目录，MR 输出到内层目录。

```conf
# 代理
a5.sources = r5
a5.sinks = k5
a5.channels = c5
# 渠道
a5.channels.c5.type = memory
a5.channels.c5.capacity = 1000
a5.channels.c5.transactionCapacity = 100
# 源
a5.sources.r5.type = spooldir
a5.sources.r5.spoolDir = /opt/result
# 递归监视子目录
a5.sources.r5.recursiveDirectorySearch = true
# 指定文件名
a5.sources.r5.includePattern = ^part-r-00000$

a5.sources.r5.fileSuffix = .COMPLETED
# 是否添加存储绝对路径文件名的标头
a5.sources.r5.fileHeader = true
# 忽略以.tmp 结尾的文件
# [^ ]*匹配任意不是空格的字符零次或多次
a5.sources.r5.ignorePattern = ^([^ ]*\.tmp)$

a5.sources.r5.channels = c5

# 汇
a5.sinks.k5.type = hdfs
a5.sinks.k5.hdfs.path = hdfs://mycluster/flume/mrresult
a5.sinks.k5.hdfs.filePrefix = upload-
a5.sinks.k5.hdfs.fileType = DataStream
# 使用本地事件戳，把时间戳向下舍入，结合上面的配置是以小时作为子文件夹，即按小时分隔
a5.sinks.k5.hdfs.useLocalTimeStamp = true
a5.sinks.k5.hdfs.round = true
a5.sinks.k5.hdfs.roundValue = 1
a5.sinks.k5.hdfs.roundUnit = hour
# 最多积攒多少个事件后，才将文件 flush 到 HDFS
a5.sinks.k5.hdfs.batchSize = 100
# 指定多少秒生成一个新的文件（滚动）
a5.sinks.k5.hdfs.rollInterval = 60
# 生成的文件最大大小（字节），略小于128M（HDFS的文件分块大小）
a5.sinks.k5.hdfs.rollSize = 134217700
# 不指定滚动文件的事件数量
a5.sinks.k5.hdfs.rollCount = 0

a5.sinks.k5.channel = c5
```

执行 MR：

```sh
hadoop jar $HADOOP_HOME/share/hadoop/mapreduce/hadoop-mapreduce-examples-3.3.6.jar wordcount /wcinput file:///opt/result/mrresult
```

## 超链接

- [rsync 用法教程](https://www.ruanyifeng.com/blog/2020/08/rsync.html)
- [FileSystem Shell](https://hadoop.apache.org/docs/r3.3.6/hadoop-project-dist/hadoop-common/FileSystemShell.html)
- [FileSystem API](https://hadoop.apache.org/docs/r3.3.6/api/org/apache/hadoop/fs/FileSystem.html)
- [FileUtil API](https://hadoop.apache.org/docs/r3.3.6/api/org/apache/hadoop/fs/FileUtil.html)
- [FileStatus API](https://hadoop.apache.org/docs/r3.3.6/api/org/apache/hadoop/fs/FileStatus.html)
- [zookeeper CLI](https://zookeeper.apache.org/doc/r3.8.2/zookeeperCLI.html)
- [zookeeper Server API](https://zookeeper.apache.org/doc/r3.8.2/apidocs/zookeeper-server/index.html)

## 持久化

### 命令

所谓使用命令，就是使用别人已经写好的软件。

环境变量 `PATH` 和物理路径，就是域名和 IP 地址的区别，要过一道中间商。域名和 IP 地址的中间商叫 DNS，`PATH` 和物理路径的中间商叫命令行解释器。

你输入一个命令，命令行解释器会在 `PATH` 里寻找你命令的源文件入口在哪，然后向它传递参数。

你可以使用 `which xxx` 或 `readlink -f $(which xxx)` 找你的命令源文件在哪里；使用 `which which` 找你的 `which` 在哪里。

查看虚拟机的 IP 地址：`ifconfig` `ip addr`

### 集群脚本

前提是你搭了集群。笔者已经放弃集群了，太麻烦了。

**all：对集群的所有机器执行操作**

```sh
#!/bin/bash
if [ $# -eq 0 ]; then
    echo "Error: Please provide at least one argument."
    exit 1
else
    for host in ubuntu101 ubuntu102
    do
        echo "============ $host ==========="
        ssh $host "$@"
    done
fi
```

**xsync：同步文件/目录到所有机器**

先测试从一台机器上同步到另一台机器上：

```sh
rsync -av /path/to/src ubuntu102:/path/to/dst
```

从某台机器上同步到所有机器上：

```sh
#!/bin/bash
if [ $# -lt 1 ]
then
    echo Not Enough Argument!
    exit;
fi

for host in ubuntu101 ubuntu102 ubuntu103
do
    echo ==================== $host ====================
    for file in $@
    do
        if [ -e $file ]
        then
            pdir=$(cd -P $(dirname $file); pwd)
            fname=$(basename $file)
            ssh $host "mkdir -p $pdir"
            rsync -av $pdir/$fname $host:$pdir
        else
            echo $file does not exists!
        fi
    done
done
```

**myhadoop**

```sh
#!/bin/bash
case "$1" in
    "start")
        echo "============ 启动 hadoop 集群 ============"

        echo "-------- 启动 HDFS --------"
        ssh "ubuntu101" "$HADOOP_HOME/sbin/start-dfs.sh"
        echo "-------- 启动 YARN --------"
        ssh "ubuntu102" "$HADOOP_HOME/sbin/start-yarn.sh"
        echo "-------- 启动 historyserver --------"
        ssh "ubuntu102" "$HADOOP_HOME/bin/mapred --daemon start historyserver"

        all jps
        ;;
    "stop")
        echo "============ 关闭 hadoop 集群 ============"

        echo "-------- 关闭 historyserver --------"
        ssh "ubuntu102" "$HADOOP_HOME/bin/mapred --daemon stop historyserver"
        echo "-------- 关闭 YARN --------"
        ssh "ubuntu102" "$HADOOP_HOME/sbin/stop-yarn.sh"
        echo "-------- 关闭 HDFS --------"
        ssh "ubuntu101" "$HADOOP_HOME/sbin/stop-dfs.sh"

        all jps
        ;;
    *)
        echo "Invalid parameter!"
        exit 1
        ;;
esac
```

## 搭建 Hadoop 高可用集群

HDFS 和 YARN 都是主从架构，当主节点挂了或者系统升级，集群会无法正常工作。高可用是指 7x24 小时系统可用，为此设置多个主节点。

对于 HDFS，主节点是 NameNode，它负责保存文件系统快照、操作日志、处理客户端读写请求，2NN 负责定期合并文件系统快照和操作日志。为实现高可用，设置多个 NameNode 和 JournalNode。同一时间只能有一个 NameNode 为 Active，它负责生成快照文件 FsImage，其他 NameNode 为 Standby，拉取同步 FsImage，还起到 2NN 的作用。JournalNode 负责保证 EditLog 的一致性。Zookeeper 负责监控集群，如果 Active 的 NameNode 挂了，通过 ZKFC 进行故障转移。

对于 YARN，主节点是 ResourceManager，从节点是 NodeManager。为此配置多个 ResourceManager。

https://hadoop.apache.org/docs/r3.3.6/hadoop-project-dist/hadoop-hdfs/HDFSHighAvailabilityWithQJM.html

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
| dfs.datanode.data.dir                         | `file://${hadoop.tmp.dir}/data`                                           |
| dfs.journalnode.edits.dir                     | `${hadoop.tmp.dir}/journalnode`                                           |
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

```log
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
