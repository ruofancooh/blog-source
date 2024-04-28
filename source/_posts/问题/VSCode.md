---
title: VSCode
date: 2024-1-12 10:40:00
categories: 问题
permalink: vscode.html
---

工具没用明白

https://code.visualstudio.com/docs/

<!--more-->

## 解决集成终端按键与快捷键冲突

`Ctrl + Shift + P` 打开命令面板，搜键盘快捷方式

搜冲突的按键，右键更改 When 表达式，加上 `&& !terminalFocus`

## 远程附加调试

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
