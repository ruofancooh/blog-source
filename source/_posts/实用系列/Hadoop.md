---
title: Hadoop
date: 2024-04-26 17:45:00
categories: 实用系列
permalink: hadoop.html
---

只有当笔者意识到：写教程是在浪费时间的时候，说明笔者是真的学会了。

理由：这些文档在各个软件的网站上，别人早就写好了。或者<span class="red-text">在你软件安装的目录里面，有一个大大的 doc 文件夹。</span>

回想起来，笔者当初为什么选大数据这个专业？就是它相对于其他计算机专业简单，用的软件都是别人已经写好的，它对于你的数学底子要求不高，没有《编译原理》这种听上去就很吓人的课。笔者想借此把时间倾斜到其他通识的东西上。就过程看来，笔者确实没有做到，因为笔者去纠结软件了。

不作死就不会死。用 Ubuntu + VM Player 的后果是：隔一段时间系统就会卡死（与 Hadoop 无关），挂起再开后，watchdog 说：软锁定，你的 CPU 又卡住了好几十秒。

<style>
    .red-text {
        color: red;
    }
</style>

1. 改用 WSL（有三层动机，就第一种，笔者还是有点叛逆的想法；第二种，据说它比虚拟机的性能好，实际上，它几秒钟就能开机；第三种，笔者没有自信以看日志的方式解决卡死的问题）
2. 以后安装各种软件，先看文档。配置文件能不改就不改，能用默认的就用默认的，改了费时费力。有一种心法是：<span class="red-text">在软件安装完之后，什么配置都别写，上来先启动了再说。然后查看日志，搜索 `WARN` `ERROR`。这样做你才能知道，哪些配置是必须有的，而哪些配置是多余的（或者人家默认配置好的）。</span>

真的，笔者有想把软件全部转移到 C 盘的冲动，把 C 盘和 D 盘合并，东西全放在桌面上，这样做比较不反人类。就事实看来，这几年根本没有出现系统崩了导致文件丢了的情况；仅就学术价值看来，没有对笔者来说重要顶过天的文件；就个人价值看来，也没有，因为笔者是一个俗人。

- 使用 https://www.diskgenius.cn/ 可以把你 D 盘的空间向 C 盘匀一点。如果你有多余的恢复分区，可以把它删了，只保留一个。
- 使用 https://github.com/redtrillix/SpaceSniffer 可以可视化地展示你硬盘的占用情况。
- 给虚拟机扩容：`https://hrfis.me/blog/linux.html#扩容`

<!--more-->

---

Hadoop 是一个软件，它是用 Java 写的，需要运行在 Java 虚拟机上。你以后还要通过写 Java 代码来连接它其中的一个组件，叫 HDFS。所有 Java 代码都得过一道 Java 编译器，然后在 JVM（Java 虚拟机）上运行。

我们为什么要装 Linux 虚拟机？

1. 模拟分布式集群
2. 生产环境都用 Linux

按理来说：

1. Hadoop 需要 JVM 去运行
2. 在 Windows 上照样可以运行 JVM
3. Hadoop 可以运行在 Windows 上

## Java 代码运行环境的问题

你只要想“连接”一个什么东西，一定会碰到这个问题。

“连接 HDFS”是什么意思？

再往前问：你是如何知道你的“集群”是正在运行着的？用 `jps` 查看 Java 进程。

`jps` 查看的是什么？是所有正在运行着的 JVM 实例，每一个进程是一个单独的 JVM。

“连接 HDFS”的意思是：**再运行一个新的 JVM**，称为“客户端”。这个 JVM 要与另一个 JVM 通信，那个 JVM 叫 **NameNode**。

怎么通信？虽然不知道细节，但你可能看过这样的代码：

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

1. <b><span class="red-text">它 `import` 的东西是怎么来的？</span></b>
2. <b><span class="red-text">在它编译完之后，放到 JVM 上运行的时候（即“运行时”），它还需不需要它 `import` 的东西？</span></b>
3. <b><span class="red-text">它运行时的 JVM 在哪里，在虚拟机上还是在物理机上？如果在物理机上，它能不能与虚拟机通信？</span></b>
4. <b><span class="red-text">IDE 起的是什么作用？</span></b>

先回答第四个问题：**IDE 起的是工具人的作用**。如果你用的 IDEA，并且成功连接 HDFS 了，你会在 IDEA 的命令行看到：

```sh
/lib/jvm/java-8-openjdk-amd64/bin/java\ -javaagent:/opt/idea-IC-241.15989.150/lib/idea_rt.jar=43273:/opt/idea-IC-241.15989.150/bin\
                                        -Dfile.encoding=UTF-8\
                                        -classpath /lib/jvm/java-8-openjdk-amd64/jre/lib/charsets.jar:/后面全都是Jar包的路径
```

它就是执行了一条命令：打开你的 JDK 目录里的 `java` ，然后向这个东西传了几个参数：工具人、文件编码、classpath

关键的就是 classpath，**你需要保证你代码“运行时”的东西能在 classpath 里找到**。

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

## 安装 Ubuntu

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

如果你用的是 WSL，你在它上面开一个端口，可以直接在物理机上使用 `localhost:port` 访问。**如果你装了两台 WSL，它们的 IP 会是相同的**，这个问题不好解决。据说<span class="red-text">学大数据的都找不到大数据相关工作</span>。那我们就退而求其次，根本没有必要搭分布式集群，在一台机器上搭个伪分布式就行了，文件分片只分一片。这样配置文件还不至于备份来备份去，只保留一份配置文件。

5. 配置 Ubuntu 软件源 https://mirrors.ustc.edu.cn/help/ubuntu.html
6. 安装 JDK https://cwiki.apache.org/confluence/display/HADOOP/Hadoop+Java+Versions

7. 写环境变量

8. 配置 SSH https://wangdoc.com/ssh/

## 安装 Hadoop

9. 下载 Hadoop 软件包
   - 在虚拟机上直接用 `wget`
   - 用物理机下载它，从物理机的文件系统上再转移到虚拟机的文件系统上（在你的物理机硬盘上表现为 `.vmdk` 文件）
     - VM Player 有共享文件夹功能，把你物理机硬盘的某一个文件夹挂载到虚拟机的 `/mnt/hgfs/Shared`
     - 如果使用 WSL，你的物理机硬盘会被挂载到虚拟机的 `/mnt`
     - 使用 XFtp 软件，与你的虚拟机进行 SSH 网络协议连接
10. 在两台虚拟机上都把软件包解压。`/opt` 目录是空的，option 的意思，让你自己选择装不装到这里。

## 配置 Hadoop

11. 修改它们的配置文件，要保证每台机器配置文件内容相同。使用 VSCode 的 Remote-SSH 插件可以直接修改虚拟机内的文件，如果你用的是 WSL 更方便。

<span class="red-text">在 https://hadoop.apache.org/docs/r3.3.6/index.html 左下角有默认的配置文件。

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
- 我们为什么可以不在 `hadoop-env.sh` 里配置各种用户名？因为还没有遇到报错的时候

12. 在 NameNode 上执行 `hdfs -namenode format`，把 Hadoop 的文件系统 HDFS 初始化。在你的物理机文件系统上有一个虚拟机文件系统，在虚拟机文件系统上又有一个 HDFS

## MR

1. `start-dfs.sh` 再 `jps` 查看 JVM 进程，你会看到 NN、2NN、DN
2. 不需要 `start-yarn.sh`
3.

```sh
cd
vi 1.txt
hdfs dfs -put 1.txt /wcinput
hadoop jar $HADOOP_HOME/share/hadoop/mapreduce/hadoop-mapreduce-examples-3.3.6.jar wordcount /wcinput /wcoutput
```

```sh
mapred --daemon start historyserver
```

## HDFS

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

## ZooKeeper

ZooKeeper 特点是只要有半数以上的节点正常工作，整个集群就能正常工作，所以适合装到奇数台服务器上。

配置 `zkData/myid`

配置 `conf/zoo.cfg`

```
dataDir=/usr/local/zookeeper-3.8.2/zkData
server.101=master:2888:3888
server.102=worker1:2888:3888
```

## HBase

https://hbase.apache.org/book.html#standalone_dist

https://hbase.apache.org/book.html#shell_exercises

```sh
start-dfs.sh
start-hbase.sh
hbase shell
```

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

第三个配置项是为了解决：参见 https://hbase.apache.org/book.html#wal.providers

```
ERROR [RS-EventLoopGroup-3-2] util.NettyFutureUtils (NettyFutureUtils.java:lambda$addListener$0(58)) - Unexpected error caught when processing netty
java.lang.IllegalArgumentException: object is not an instance of declaring class
```

## Spark

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

## 网络

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

## SSH

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

查看虚拟机的 IP 地址：`ifconfig` `ip -a`

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
