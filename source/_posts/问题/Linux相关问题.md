---
title: Linux 相关问题
date: 2024-1-14 10:30:00
categories: 问题
permalink: linux.html
---

基础不牢，工具没用明白

```sh
top
htop
ps -aux
netstat -anp
nc -l <端口号>
nc -N <目标主机> <端口号>
nc -zv <目标主机> <起始端口>-<结束端口>
```

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

```sh
ps -aux
```

- `-a`：显示所有用户的进程
- `-u`：以详细的格式显示进程信息
- `-x`：同时显示没有控制终端的进程

## net-tools 2.10-alpha

```sh
netstat -anp
```

- `-a`：显示所有连接
- `-n`：以数字形式显示 IP 地址和端口号
- `-p`：显示与连接关联的进程信息

```sh
netstat -tunlp
```

- -t：**仅**显示 TCP 连接信息，不带这个参数显示所有
- -u：**仅**显示 UDP 连接信息，不带这个参数显示所有
- -l：**仅**显示 LISTEN 状态的连接，不带这个参数会显示 ESTABLISHED、CLOSE_WAIT。-a 参数显示所有

## Internet connections 与 UNIX domain sockets

前者是基于 TCP/IP 协议的网络连接。每个套接字都由 IP 地址和端口号唯一标识。

后者用于本地进程之间的通信，而不是跨网络的通信。使用文件系统路径作为套接字的地址。

## TCP 连接状态

LISTEN 监听状态，本机在等待外部连接（准确说是传入的连接，也可以本机连本机）

ESTABLISHED 既定了，连接建立了

CLOSE_WAIT 远程端已关闭，等待套接字关闭

TIME_WAIT 套接字在关闭后等待处理仍在网络中的数据包

## 端口

端口是进程之间通信用的

## 本地地址和外部地址

对于本机上看到的 TCP 连接，这两个地址就是连接双方的地址

## OpenBSD netcat

先

```sh
nc -l 1234
```

- `-l`：监听传入的连接，而不是启动与远程主机的连接（就是在本机上打开 1234 端口，等待外部给本机连接）
  - 本地地址：`0.0.0.0:1234`
  - 外部地址：`0.0.0.0:*` 表示接受所有外部连接
  - 状态为 LISTEN

后

```sh
nc -N ubuntu101 1234
```

启动与目标主机的 1234 端口上的 TCP 连接

- `-N`：输入 EOF （Ctrl+D）之后终止连接

```sh
nc -zv <目标主机> <起始端口>-<结束端口>
```

端口扫描，-z 选项表示不发送数据，-v 选项表示输出详细信息
