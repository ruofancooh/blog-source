---
title: 一些概念与 Linux 命令
date: 2024-1-14 10:30:00
categories: Hadoop
permalink: linux.html
---

基础不牢，工具没用明白

<!--more-->

## 查看软件版本与帮助

dpkg 是 Debian 的包管理器。Linux -> Debian -> Ubuntu

```sh
dpkg -l | grep xxx
# | 是管道操作符，把上一个进程的输出作为下一个进程的输入
```

apt 是基于 dpkg 的包管理器

```sh
apt list --installed | grep xxx
# apt does not have a stable CLI interface. Use with caution in scripts.
```

找不到就

```sh
xxx -h 或 --help
```

一般会有帮助，然后 `-V` `-version` `--version` 之类的

或者**直接看 man 手册，写得非常详细**。剩下的就是愿不愿意看、愿不愿意查翻译的问题了。

[一文读懂 man 手册](https://zhuanlan.zhihu.com/p/518891500)

## 程序、进程、线程、服务

程序是代码，静态的，以文件的形式存储在存储介质上。

进程是在内存里正在运行的程序，有代码段，数据段（存全局变量、静态变量），栈（管理函数的调用和返回、存局部变量、参数）等。

一个进程可包含一个或多个线程，这些线程共享进程资源。

服务是特定的一个或多个进程

`ps` 列出当前用户的进程状态，`-e` 参数列出所有

## Internet connections 与 UNIX domain sockets

前者是基于 TCP/IP 协议的网络连接。每个套接字都由 IP 地址和端口号唯一标识。

后者用于本地进程之间的通信，而不是跨网络的通信。使用文件系统路径作为套接字的地址。

## 连接状态

LISTEN 服务端正在等待客户端的连接

established 既定了

## 端口

端口是进程之间通信用的


## net-tools 2.10-alpha

```sh
netstat -tunlp
```

- -t：**仅**显示 TCP 连接信息
- -u：**仅**显示 UDP 连接信息
- -n：以数字形式显示 IP 地址和端口号
- -l：**仅**显示监听状态的连接
- -p：显示与连接关联的进程信息

## OpenBSD netcat (Debian patchlevel 1.218-4ubuntu1)
