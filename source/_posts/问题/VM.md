---
title: VM
date: 2023-08-11 20:10:00
categories: 问题
permalink: ubuntu-on-vmplayer.html
---

- 真机系统：Windows 10
- 使用软件：VMware Workstation 17.0.2 Player
- 虚拟机系统：Ubuntu 22.04.3 server

<!--more-->

也可以给硬盘分一个新的区，单独安装 Linux。不过没有必要。

好像还能用 Docker，我没试过。

## 安装

### 下载安装 VMware Workstation Player

> 使用 VMware Workstation Player 在 Windows 或 Linux PC 上轻松地将多个操作系统作为虚拟机运行。——网站介绍

[下载页面](https://customerconnect.vmware.com/cn/downloads/info/slug/desktop_end_user_computing/vmware_workstation_player/)

这里下载的是当前最新版 `VMware Workstation 17.0.2 Player for Windows 64-bit Operating Systems`。

安装过程略（“增强型键盘驱动程序”不知道有什么用，先勾上）。

### 下载 Ubuntu 镜像

是一种 Linux 发行版操作系统。

[下载页面（仓库集合）](https://launchpad.net/ubuntu/+cdmirrors)，找到 China。

这里下载的是`ubuntu-22.04.3-live-server-amd64.iso`。

### 在 VM Player 中新建虚拟机

1. `创建新虚拟机(N)`
2. `安装程序光盘文件(iso)(M)`
3. `浏览(R)`，选择下载的镜像文件，下一步。
4. 设置虚拟机名称和位置，下一步。（我这里设置的是`Ubuntu100`和`D:\VMachines\Ubuntu100`）
5. 指定磁盘容量，下一步。
6. 自定义硬件（我这里把 CPU 改成了 4 核）。完成。

你会看到：

<img src="/blog/images/vm.png">

按回车开始安装 Ubuntu。

### 安装 Ubuntu

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

报错不要紧，回车。

输入用户名和密码登录 Ubuntu。注意输入密码默认是不回显的。

### 设置时区

```sh
sudo dpkg-reconfigure tzdata
```

选择 `Asia`

再选择 `Shanghai`

### 设置虚拟机与真机的共享文件夹

VM 的虚拟磁盘文件不好直接打开。有时候需要在虚拟机和真机之间互传文件，可以通过共享文件夹。

（以后用的都是[SSH](https://wangdoc.com/ssh/)和[Xftp](https://www.xshell.com/zh/free-for-home-school/)）

在 VM Player 里打开虚拟机设置->选项->共享文件夹。

我这里设置在`D:\VMachines\Shared`。

在虚拟机里的位置是`/mnt/hgfs/Shared`。

## 扩容

### 工具

- `df -h`：查看文件系统使用情况、挂载到的目录
- `lsblk`：查看块设备相关信息、挂载点
- `parted`：分区管理
- `vgs` `vgdisplay`：卷组信息（Volume Group）
- `pvs` `pvdisplay`：物理卷信息（Physical volume）
- `lvs` `lvdisplay`：逻辑卷信息（Logical Volume）

### 层次（空间缝隙）

- `/dev/sda`：大概是 VM 设置里分配的硬盘空间大小
  - `/dev/sda1`：bios_grub
  - `/dev/sda2`：`/boot`
  - 物理卷 pv：`/dev/sda3`
    - 逻辑卷 lv：
      - 文件系统 `/dev/mapper/ubuntu--vg-ubuntu--lv` -> `/dev/dm-0`

需求：

1. 先扩 sda
2. 从 sda 向 sda3 匀
3. 从 sda3 向 lv 匀

### 步骤

1. 给 VM 的虚拟磁盘扩容

   关机状态下：编辑虚拟机设置 -> 硬盘 -> 扩展

2. 从 sda 向 sda3 匀

   ```sh
   sudo parted
   ```

   ```
   GNU Parted 3.4
   Using /dev/sda
   Welcome to GNU Parted! Type 'help' to view a list of commands.
   (parted) print all
   // 输出……

   (parted) print free
   Model: VMware, VMware Virtual S (scsi)
   Disk /dev/sda: 32.2GB
   Sector size (logical/physical): 512B/512B
   Partition Table: gpt
   Disk Flags:

   Number  Start   End     Size    File system  Name  Flags
           17.4kB  1049kB  1031kB  Free Space
    1      1049kB  2097kB  1049kB                     bios_grub
    2      2097kB  1904MB  1902MB  ext4
    3      1904MB  21.5GB  19.6GB
           21.5GB  32.2GB  10.7GB  Free Space

   (parted) resizepart 3
   End?  [21.5GB]? 32.3GB //在后面输入扩到的 End，比 End 略大就是扩到底
   ```

   扩完后，`sudo pvs` 出的 /dev/sda3 会比 `lsblk` 出的 sda3 小，执行：

   ```sh
   sudo pvresize /dev/sda3
   ```

3. 从 sda3 向 lv 匀

   ```sh
   sudo lvresize -l +100%FREE /dev/mapper/ubuntu--vg-ubuntu--lv
   ```

   扩完后，`df -h` 出的 /dev/mapper/ubuntu--vg-ubuntu--lv 还没变，执行：

   ```sh
   sudo resize2fs /dev/mapper/ubuntu--vg-ubuntu--lv
   ```

## 解决 VMware Workstation VMX 占用 CPU 高

只是在做完这些操作后的一段时间，没有再出现这个问题，并不能保证这些操作的每一步都是一定对的，或有用的。过了两个月，这个问题又出现了。并且前三步的结果还是放在那里的，说明前三步可能是没有用的。方向搞错了：你在物理机上看任务管理器，为什么不在虚拟机上看任务管理器。

### 可能没有用的操作

1. 控制面板 -> 程序 -> 程序和功能 -> 启用 Windows 功能 -> 取消勾选【适用于 Linux 的 Windows 子系统】
2. `Win + R` 打开 `services.msc`，停止【HV 主机服务】。
3. 管理员身份在 cmd 里执行：

```cmd
bcdedit /set hypervisorlaunchtype off
```

4. 重启电脑。

### 新问题

起因是，配置 HDFS 高可用自动故障转移，把 Active 的 NN 杀了。然后它不但没有故障转移，反而故障了。

查看进程：

```sh
top
htop
```

DataNode 出问题了，CPU 占满了。看 log：DataNode 和 ZKFC 的 log 文件大小都在涨，一直在尝试重连。所以**当 CPU 占用高，写磁盘不到 1MB/s，可能是出问题了在一直写 log**。
