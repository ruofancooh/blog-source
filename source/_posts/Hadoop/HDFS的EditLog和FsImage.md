---
title: HDFS 的 EditLog 和 FsImage
date: 2023-10-30 22:01:00
categories: Hadoop
permalink: hdfs-editlog-fsimage.html
---

有两种二进制文件保证元数据的可靠性：

- EditLog：编辑日志，对 HDFS 进行操作的日志
- FsImage：文件系统（元数据）镜像

位于 NN 的 `${hadoop.tmp.dir}/dfs/name/current`

和 2NN 的 `${hadoop.tmp.dir}/data/dfs/namesecondary/current`

<!--more-->

执行下面两个命令都不需要启动集群（dfs）。

## 用 oev 命令转换 EditLog 为 xml

```sh
hdfs oev -p XML -i edits_xxxx -o ./edits_xxxx.xml
```

## 用 oiv 命令转换 FsImage 为 xml

```sh
hdfs oiv -p XML -i fsimage_xxxx -o ./fsimage_xxxx.xml
```