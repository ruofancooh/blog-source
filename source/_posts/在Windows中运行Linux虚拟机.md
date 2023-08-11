---
title: 在Windows中安装Linux虚拟机
date: 2023-08-11 20:10:00
categories: 教程
---

- 真机系统：Windows 10
- 使用软件：VMware Workstation 17.0.2 Player
- 虚拟机系统：Ubuntu 22.04.3 server

<!--more-->

也可以给硬盘分一个新的区，单独安装 Linux。不过没有必要。

## 下载安装 VMware Workstation Player

> 使用 VMware Workstation Player 在 Windows 或 Linux PC 上轻松地将多个操作系统作为虚拟机运行。——网站介绍

[下载页面](https://customerconnect.vmware.com/cn/downloads/info/slug/desktop_end_user_computing/vmware_workstation_player/)

这里下载的是当前最新版 `VMware Workstation 17.0.2 Player for Windows 64-bit Operating Systems`。

安装过程略（“增强型键盘驱动程序”不知道有什么用，先勾上）。

## 下载 Ubuntu 镜像

是一种 Linux 发行版操作系统。

[下载页面（仓库集合）](https://launchpad.net/ubuntu/+cdmirrors)，找到 China。

这里下载的是`ubuntu-22.04.3-live-server-amd64.iso`。

## 在 VM Player 中新建虚拟机

1. `创建新虚拟机(N)`
2. `安装程序光盘文件(iso)(M)`
3. `浏览(R)`，选择下载的镜像文件，下一步。
4. 设置虚拟机名称和位置，下一步。（我这里设置的是`Ubuntu100`和`D:\VMachines\Ubuntu100`）
5. 指定磁盘容量，下一步。
6. 自定义硬件（我这里把 CPU 改成了 4 核）。完成。

你会看到：

{% asset_img 1.png %}

按回车开始安装 Ubuntu。

## 安装 Ubuntu

1. 语言选择，默认回车。
2. 键盘布局选择，默认回车。
3. 安装类型，默认回车。
4. 网络，默认回车。
5. 代理，默认回车。
6. 配置镜像源，如果网络不好，改成

   - 清华源：`https://mirrors.tuna.tsinghua.edu.cn/ubuntu/`

   - 南京源：`https://mirror.nju.edu.cn/ubuntu/`

   - 北邮源：`https://mirrors.bupt.edu.cn/ubuntu/`

     等均可。

7. 配置存储布局，默认选择`Done`，回车。
8. 文件系统，`Done`，`Continue`。
9. 设置用户名密码等。
10. 是否升级到 Pro 版，默认不升级，`Continue`。
11. 是否安装 OpenSSH server，先不安装。
12. 是否安装其他东西，先都不选。
13. 等待安装系统。
14. 安装完成后，点击 VM Player 下方的“我已完成安装”，然后`Reboot Now`。

输入用户名和密码登录 Ubuntu。注意输入密码默认是不回显的。

## 设置虚拟机与真机的共享文件夹

VM 的虚拟磁盘文件不好直接打开。有时候需要在虚拟机和真机之间互传文件，可以通过共享文件夹。

在 VM Player 里打开虚拟机设置->选项->共享文件夹。

我这里设置在`D:\VMachines\Shared`。

在虚拟机里的位置是`/mnt/hgfs/Shared`。
