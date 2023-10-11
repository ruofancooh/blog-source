---
title: HD04 - 编写ZooKeeper集群控制脚本
date: 2023-09-28 13:30:00
categories: Hadoop
permalink: HD/04/
---

在此之前，我重新修改了三台机器的主机名。

<!--more-->

## 在此之前

主机名 master、worker1、worker2 还是太不好看了（因为我命名的 worker1 对应的是 102，worker2 对应的是 103，加上在 ZK 里不一定谁当 Leader，加上不一定只用这一个软件），所以我把主机名**改成了 ubuntu101、ubuntu102、ubuntu103**，对应 IP 地址。

需要改以下几个文件：

- 物理机的 C:\\Windows\\System32\\drivers\\etc\\hosts
- Hadoop 配置文件
  - core-site.xml
  - hdfs-site.xml
  - mapred-site.xml
  - yarn-site.xml
  - workers
- ZK 配置文件
  - zoo.cfg
- 集群分发脚本 xsync.sh
- 虚拟机的 /etc/hostname
- 虚拟机的 /etc/hosts

用 Xftp 传到物理机上改（后两者直接 `sudo vi` 比较方便），留个备份再传回去，然后重启。

然后重新互相 `ssh-copy-id`。

## 服务端的

就是把自带的脚本 `zkServer.sh` 再封装一层，取名 `zks.sh`：

```sh
#!/bin/bash

ZK_HOME="/usr/local/zookeeper-3.8.2"
ZKS_SH="$ZK_HOME/bin/zkServer.sh"
servers="ubuntu101 ubuntu102 ubuntu103"

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

增加执行权限：

```sh
chmod +x zks.sh
```

执行之后报错，写入文件的权限不够。发现 Zookeeper 文件夹和里面的所有文件所属用户和组都是 `root`。

所以**在 Zookeeper 文件夹里**改用户和用户组：

```sh
sudo chown -R rc:rc .
```

可以把脚本后缀 `.sh` 去了，然后移动到 `/usr/bin`，这样可以随地执行：

```sh
sudo mv zks.sh /usr/bin/zks
```

### 示例

启动所有：

```sh
zks start
```

关闭某个：

```sh
zks stop ubuntu102
```

## 客户端的

就是把自带的脚本 `zkCli.sh` 再封装一层，取名 `zkc.sh`：

```sh
#!/bin/bash

ZK_HOME="/usr/local/zookeeper-3.8.2"
ZKC_SH="$ZK_HOME/bin/zkCli.sh"
servers="ubuntu101 ubuntu102 ubuntu103"

"$ZKC_SH" -server $(hostname)
```

同样加执行权限，去后缀并移动位置。

### 示例

```sh
zkc
```
