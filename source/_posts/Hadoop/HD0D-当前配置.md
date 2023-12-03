---
title: HD10 - 当前配置
date: 2023-12-4 00:00:00
categories: Hadoop
permalink: HD/10/
---

在笔记里粘贴 xml 用处不大，遇到报错会常改配置。

主要把 ubuntu101 加进 workers 里（之前没加），删 data 和 logs 文件夹，然后重新 `hdfs namenode -format`。

[https://hadoop.apache.org/docs/r3.3.6/](https://hadoop.apache.org/docs/r3.3.6/)左下角菜单有默认的配置文件。

<!--more-->

|                                           | ubuntu101   | ubuntu102                        | ubuntu103   |
| ----------------------------------------- | ----------- | -------------------------------- | ----------- |
| **HDFS**                                  | NameNode    |                                  | 2NN         |
| **HDFS（workers 文件里配置的）**          | DataNode    | DataNode                         | DataNode    |
| **MR/YARN（与 DN 一一对应）**             | NodeManager | NodeManager                      | NodeManager |
| **MR/YARN**                               |             | ResourceManager JobHistoryServer |             |
| **虚拟机设置里的内存**                    | 4GB         | 4GB                              | 4GB         |
| **上述进程全开后，all free -h 后的 free** |             |                                  |             |

## all 脚本

```sh
#!/bin/bash
if [ $# -eq 0 ]; then
    echo "Error: Please provide at least one argument."
    exit 1
else
    for host in ubuntu101 ubuntu102 ubuntu103
    do
        echo "============ $host ==========="
        ssh $host "$@"
    done
fi
```
