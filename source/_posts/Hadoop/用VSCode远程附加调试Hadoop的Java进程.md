---
title: 用 VSCode 远程附加调试 Hadoop 的 Java 进程
date: 2024-1-12 10:40:00
categories: Hadoop
permalink: hadoop-java-debug.html
---

在物理机上开 VSCode，开不开 Remote - SSH 插件都可，开了大概就不叫远程了。

这个暂时没什么作用，只能看到函数名，看不到来源代码。还没折腾明白

[文档](https://code.visualstudio.com/docs/java/java-debugging)

<!--more-->

## hadoop-env.sh

```sh
export 某某_OPTS="-agentlib:jdwp=transport=dt_socket,address=8888,server=y,suspend=n"
```

## launch.json

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "java",
      "name": "Hadoop 某某",
      "request": "attach",
      "hostName": "ubuntu101",
      "port": 8888
    }
  ]
}
```
