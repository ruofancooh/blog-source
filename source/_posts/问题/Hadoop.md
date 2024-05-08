---
title: Hadoop
date: 2024-04-26 17:45:00
categories: 问题
permalink: hadoop.html
---

只有当笔者意识到：写教程是在浪费时间的时候，说明笔者是真的学会了。

理由：这些文档在各个软件的网站上，别人早就写好了。笔者写的不叫教程，顶多叫操作步骤，这些步骤不可能适用于所有环境。

回想起来，笔者当初为什么选大数据这个专业？就是它相对于其他计算机专业简单，用的软件都是别人已经写好的，它对于你的数学底子要求不高，没有《编译原理》这种听上去就很吓人的课。笔者想借此把时间倾斜到其他通识的东西上。就过程看来，笔者确实没有做到，因为笔者去纠结软件了。

不作死就不会死。用 Ubuntu + VM Player 的后果是：隔一段时间系统就会卡死（与 Hadoop 无关），挂起再开后，watchdog 说：软锁定，你的 CPU 又卡住了好几十秒。

1. 改用 WSL（有三层动机，就第一种，笔者还是有点叛逆的想法；第二种，据说它比虚拟机的性能好，实际上，它几秒钟就能开机；第三种，笔者没有自信以看日志的方式解决卡死的问题）
2. 以后安装各种软件，先看文档。配置文件能不改就不改，能用默认的就用默认的，改了费时费力。

真的，笔者有想把软件全部转移到 C 盘的冲动，把 C 盘和 D 盘合并，东西全放在桌面上，这样做比较不反人类。就事实看来，这几年根本没有出现系统崩了导致文件丢了的情况；仅就学术价值看来，没有对笔者来说重要顶过天的文件；就个人价值看来，也没有，因为笔者是一个俗人。也只是想想而已，想想而已……

<!--more-->

Hadoop 是一个软件，它是用 Java 写的，需要运行在 Java 虚拟机上。你以后还要通过写 Java 代码来连接它其中的一个组件，叫 HDFS。所有 Java 代码都得过一道 Java 编译器，然后在 JVM（Java 虚拟机）上运行。

我们为什么要装 Linux 虚拟机？

1. 模拟分布式集群
2. 生产环境都用 Linux

按理来说：

1. Hadoop 需要 JVM 去运行
2. 在 Windows 上照样可以运行 JVM
3. Hadoop 可以运行在 Windows 上

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

WSL 的网络比较特殊，你在它上面开一个端口，可以直接在物理机上使用 `localhost:port` 访问。

（“比较特殊”的意思是：我还没有搞明白。“我还没有搞明白”的意思是：我还没有搞，我还没有在 WSL 上装 Hadoop，如果装了，肯定会面临如何通信的问题。如果搞不明白，我可能又得放弃 WSL）

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
11. 修改它们的配置文件，要保证每台机器配置文件内容相同。使用 VSCode 的 Remote-SSH 插件可以直接修改虚拟机内的文件。当 CPU 占用高，写磁盘不到 1MB/s，可能是出问题了在一直写 log。
    - `hadoop-env.sh` 指定 JAVA_HOME，NN、2NN、DN、RM、NM 的用户名，启动 JVM 时的参数
    - `core-site.xml` 指定 hdfs 的 URI，文件系统存在本地哪个目录，http 登录用户名
    - `hdfs-site.xml` 指定谁当 NN、2NN，副本个数
    - `mapred-site.xml` 指定 MR 框架，MR 历史服务器
    - `yarn-site.xml` 指定 RM，YARN 历史服务器
    - `workers` 指定谁当 DataNode
12. 在 NameNode 上执行 `hdfs -namenode format`，把 Hadoop 的文件系统 HDFS 初始化。在你的物理机文件系统上有一个虚拟机文件系统，在虚拟机文件系统上又有一个 HDFS

## 连接 HDFS

何意？

使用 org.apache.hadoop.fs.FileSystem 这个类的 get 方法，传一个 core-site.xml 里指定的 URI。

在物理机上编码，带上这些依赖，带依赖打成 jar 包，在虚拟机上使用 `java -jar xxx.jar`

```xml
<dependency>
  <groupId>org.apache.hadoop</groupId>
  <artifactId>hadoop-common</artifactId>
  <version>3.3.6</version>
</dependency>
<dependency>
  <groupId>org.apache.hadoop</groupId>
  <artifactId>hadoop-client</artifactId>
  <version>3.3.6</version>
</dependency>
<dependency>
  <groupId>org.apache.hadoop</groupId>
  <artifactId>hadoop-hdfs</artifactId>
  <version>3.3.6</version>
</dependency>
```

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

`hbase-env.sh` 指定 JAVA_HOME

`hbase-site.xml` 指定是否以分布式运行，数据库根目录是本地文件系统还是 HDFS，Web 端口，Zookeeper 数据目录，HBase 临时目录，不强制执行与流式传输相关的不安全操作

注意：hbase 自带 zookeeper。如果想使用本地已安装的 zookeeper：下次再说（下次再说的意思是永远都不说）

## 网络

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

两台机器上都执行：

```sh
ssh-keygen -t rsa -m PEM
```

笔者这里的版本是 `OpenSSH_8.9p1 Ubuntu-3ubuntu0.6, OpenSSL 3.0.2 15 Mar 2022`，要加上 `-m PEM`，确保私钥以 -----BEGIN **RSA** PRIVATE KEY----- 开头。[后续错误](https://www.cnblogs.com/simple-li/p/14654812.html)

两台机器上都执行：

```sh
ssh-copy-id ubuntu101
ssh-copy-id ubuntu102
```

## 目录

EditLog 和 FsImage 在：

- NN 的 `${hadoop.tmp.dir}/dfs/name/current`
- 2NN 的 `${hadoop.tmp.dir}/data/dfs/namesecondary/current`

## MR

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

你可以使用 `which xxx` 或 `readlink -f $(which xxx)` 找你的命令源文件在哪里。

查看虚拟机的 IP 地址：`ifconfig`

查看 JVM 进程：`jps`

start-all.sh

stop-all.sh

```sh
mapred --daemon start historyserver
```

```sh
hadoop jar $HADOOP_HOME/share/hadoop/mapreduce/hadoop-mapreduce-examples-3.3.6.jar wordcount /wcinput /wcoutput
```

```sh
hdfs oev -p XML -i edits_xxxx -o ./edits_xxxx.xml
```

```sh
hdfs oiv -p XML -i fsimage_xxxx -o ./fsimage_xxxx.xml
```

### all

对集群的所有机器执行操作。

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

### xsync

同步文件/目录到所有机器

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

### myhadoop

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

### zks

```sh
#!/bin/bash

ZK_HOME="/opt/zookeeper-3.8.2"
ZKS_SH="$ZK_HOME/bin/zkServer.sh"
servers="ubuntu101 ubuntu102"

echo -e "\n"


# 参数 $1 是操作名，$2 是主机名
if [ -n "$2" ]; then
    # 如果指定了主机名，对指定主机操作
    echo ------ zkServer $2 $1 ------
    ssh $2 $ZKS_SH $1
    echo -e "\n"
else
    # 如果没有指定主机名，就对所有主机操作
    for server in $servers; do
        echo ------ zkServer $server $1 ------
        ssh $server $ZKS_SH $1
        echo -e "\n"
    done
fi
```

### zkc

就是把自带的脚本 `zkCli.sh` 再封装一层

```sh
#!/bin/bash

ZK_HOME="/opt/zookeeper-3.8.2"
ZKC_SH="$ZK_HOME/bin/zkCli.sh"
servers="ubuntu101 ubuntu102"

"$ZKC_SH" -server $(hostname)
```
