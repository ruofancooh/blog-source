---
title: MongoDB - 00 - 准备
date: 2023-09-05 17:51:00
categories: MongoDB
---

- Windows 10 环境配置
- 启动脚本

<!--more-->

## Windows 10 环境配置

1. [下载 MongoDB](https://www.mongodb.com/try/download/community)，我下载的是`7.0.0 (current)`的`zip`格式。
2. 解压，右键用 PowerShell 运行`Install-Compass.ps1`，安装 GUI。
   默认会安装到 C 盘，安装完后手动移到 D 盘。
3. 建数据库文件夹，建一个空日志`test.log`。
4. 启动 `mongod`
   ```sh
   mongod --dbpath [数据库文件夹路径] --logpath [日志文件路径] --logappend
   ```
5. 用 MongoDBCompass 连接。

## 启动脚本

`mo.bat`

```bat
set MONGODB_HOME=D:\ProgramData\mongodb-win32-x86_64-windows-7.0.0\
cd /d %MONGODB_HOME%\bin
call mongod --dbpath %MONGODB_HOME%\db^
           --logpath %MONGODB_HOME%\test.log --logappend
```

脚本会 `call mongod`，停止则断开连接。
