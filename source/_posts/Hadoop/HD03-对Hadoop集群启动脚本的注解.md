---
title: HD03 - 对Hadoop集群启动脚本的注解
date: 2023-09-26 17:45:00
categories: Hadoop
permalink: HD/03/
---

`$HADOOP_HOME/sbin/`

<!--more-->

## start-all.sh

对应 https://github.com/apache/hadoop/blob/branch-3.3.6/hadoop-common-project/hadoop-common/src/main/bin/start-all.sh

<iframe
  src="https://github.com/apache/hadoop/blob/branch-3.3.6/hadoop-common-project/hadoop-common/src/main/bin/start-all.sh"
  width=100%
  height=500>
</iframe>

28-36 找库目录

- 28：-n 检查字符串是否非空。
- 31：$0 表示当前脚本的名称（含扩展名不含路径）。
- 32：-P 表示使用物理路径，不使用软链接。-- 表示后面跟的不是选项了，是参数。对于 dirname 命令，如果路径不以/结束，返回最后一个/之前的内容；如果路径以/结束，返回倒数第二个/之前的内容。>/dev/null 就是把输出重定向到 /dev/null，丢弃输出的数据。pwd 获取当前目录的绝对路径。

37 注释告诉 ShellCheck 工具忽略 SC2034 警告（定义了未使用的变量）

38-44 找配置文件

- 39：-f 用于检查文件是否存在，并且是一个常规文件（不是目录、符号链接、设备文件或管道）
- 40：. 将另一个脚本包含到当前脚本中
- 42：2>&1 将标准错误输出重定向到标准输出

46-53 启动前的确认

- 47：trap 设置信号处理程序
- 52：取消对 INT 信号的捕获

55-63 运行另两个启动脚本 `start-dfs.sh` 和 `start-yarn.sh`

## start-dfs.sh

对应 https://github.com/apache/hadoop/blob/branch-3.3.6/hadoop-hdfs-project/hadoop-hdfs/src/main/bin/start-dfs.sh
