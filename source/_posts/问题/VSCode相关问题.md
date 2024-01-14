---
title: VSCode 相关问题
date: 2024-1-12 10:40:00
categories: 问题
permalink: vscode.html
---

工具没用明白

[文档](https://code.visualstudio.com/docs/)

<!--more-->

## 解决集成终端按键与快捷键冲突

`Ctrl + Shift + P` 打开命令面板，搜键盘快捷方式

搜冲突的按键，右键更改 When 表达式，加上 `&& !terminalFocus`

## 远程附加调试 Hadoop 的 Java 进程

在物理机上开 VSCode，开不开 Remote - SSH 插件都可。

如果开了，工作区在虚拟机上。如果没开，工作区在物理机上。

这个暂时没什么作用，只能看到函数名，看不到来源代码。还没折腾明白

[文档](https://code.visualstudio.com/docs/java/java-debugging)

### hadoop-env.sh

```sh
export 某某_OPTS="-agentlib:jdwp=transport=dt_socket,address=8888,server=y,suspend=n"
```

### launch.json

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
