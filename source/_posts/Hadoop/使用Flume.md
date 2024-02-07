---
title: 使用 Flume
date: 2024-01-19 08:32:00
categories: Hadoop
permalink: flume.html
---

<img src="https://flume.apache.org/_images/DevGuide_image00.png">

Flume 是一个水槽，用于采集、聚合和传输流数据（事件）。对于每一个代理 agent，有源 source、汇 sink、渠道 channel。

[文档](https://flume.apache.org/documentation.html)

<!--more-->

## 启动参数

```sh
flume-ng agent --conf conf -f <配置文件路径> -n <代理名>
```

注意：下面的配置不一定对。笔者不小心把配置文件夹删了，但是保留的还有配置内容截图。所以下面的实际是 [OCR](https://web.baimiaoapp.com/) 过来后再修改的。之前是实验成功了的，而之后没有做过实验。

## Hello（netcat 源与 logger 接收器）

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

## 实时监控单个追加文件（exec 源与 hdfs 接收器）

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

## 实时监控多个新文件（spooldir 源与 hdfs 接收器）

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

## 实时监控多个追加文件（TAILDIR 源与 hdfs 接收器）

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

## 监控 MapReduce 结果，上传到 HDFS

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
