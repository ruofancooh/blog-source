---
title: HD03 - 对Hadoop集群启动脚本的注解
date: 2023-09-26 17:45:00
categories: Hadoop
permalink: HD/03/
---

r3.3.6

- [UnixShellAPI](https://hadoop.apache.org/docs/r3.3.6/hadoop-project-dist/hadoop-common/UnixShellAPI.html)

<!--more-->

## $HADOOP_HOME/sbin/start-all.sh

对应 https://github.com/apache/hadoop/blob/branch-3.3.6/hadoop-common-project/hadoop-common/src/main/bin/start-all.sh

<iframe
  src="https://github.com/apache/hadoop/blob/branch-3.3.6/hadoop-common-project/hadoop-common/src/main/bin/start-all.sh"
  width=100%
  height=500>
</iframe>

干的事：

1. 【28-36】找目录 `${HADOOP_HOME}/libexec`，里面有其他脚本，和配置文件 `hadoop-config.sh`
2. 【38-44】把 `hadoop-config.sh` 包含到当前脚本里
3. 【46-53】如果 `hadoop_privilege_check` 返回 0，进行 10 秒的启动前确认
4. 【55-63】运行另两个启动脚本 `start-dfs.sh` 和 `start-yarn.sh`

- 28：if [[ -n ]] 判断字符串非空，非空为 1
- 31：获取当前脚本的完整路径。$0 表示当前脚本的名称（含扩展名）
- 32：-P 表示使用物理路径，不使用软链接。-- 表示后面跟的不是选项了，是参数。对于 dirname 命令，如果路径不以/结束，返回最后一个/之前的内容；如果路径以/结束，返回倒数第二个/之前的内容。>/dev/null 就是把输出重定向到 /dev/null，丢弃输出的数据。pwd 获取当前目录的绝对路径
- 37：注释告诉 ShellCheck 工具忽略 SC2034 警告（定义了未使用的变量）
- 39：-f 用于检查文件是否存在，并且是一个常规文件（不是目录、符号链接、设备文件或管道）
- 40：. 将另一个脚本包含到当前脚本中
- 42：2>&1 将标准错误输出重定向到标准输出
- 47：trap 设置信号处理程序
- 52：取消对 INT 信号的捕获

## $HADOOP_HOME/libexec/hadoop-config.sh

## $HADOOP_HOME/sbin/start-dfs.sh

对应 https://github.com/apache/hadoop/blob/branch-3.3.6/hadoop-hdfs-project/hadoop-hdfs/src/main/bin/start-dfs.sh

干的事：

1. 【43-61】同样找 `${HADOOP_HOME}/libexec` 目录，并包含 `hdfs-config.sh`
2. 【63-78】对本脚本传参个数大于等于一个时，如果第一个参数为 `-upgrade` 或 `-rollback`，把它赋值给 `nameStartOpt` 或 `dataStartOpt`

- 64: $# 参数个数，-ge 大于等于
- 66：shift 把所有参数“左移”一位（丢弃第一个参数，原来第二个参数变成第一个参数……）
- 82：$* 所有当前参数（shift 后的）拼接起来的字符串
- 89：if [[ -z ]] 判断字符串空，空为 1
- 101：$? 上一个进程结束的状态码，0 成功 1 失败
- 112：(( )) 可在里面进行算术运算并赋值
- 121：=~ 正则匹配
- 147：2>&- 把标准错误输出重定向到“关闭”
- 149："${#JOURNAL_NODES}" 获取 JOURNAL_NODES 变量存储的字符串的长度
- 163：| tr '[:upper:]' '[:lower:]' 把前面的输出结果通过管道传递给 tr 命令，转换成小写字母