---
title: 用 Magisk 获取 Android 手机的 root 权限
date: 2023-7-8 22:24:00
permalink: magisk.html
---

好奇心旺盛。

<!--more-->

你需要：

- 一台系统为 Android 6.0 以上的手机
- 一台能够正常使用 [Android SDK Platform-Tools](https://developer.android.google.cn/studio/releases/platform-tools?hl=zh-cn) 的电脑

另外，如果你手机的 Android kernel 版本在 5.10 以上，你也可以使用[KernelSU](https://kernelsu.org/zh_CN/)——这不属于此教程的范围。

## 背景知识

### Linux 与 Android

Linux 是一种操作系统内核，由 Linus Torvalds 开发。**基于 Linux 内核**，Android Inc.公司开发出了 Android 操作系统。

2005 年，Google 收购 Android Inc.。2007 年，Google 将 Android 的源代码公开，并创建了[AOSP](https://source.android.google.cn/?hl=zh-cn)（Android Open Source Project）项目。

许多手机厂商的定制系统，如 MIUI、Flyme、HarmonyOS 等都是**基于 AOSP 源码**开发的。和 AOSP 对标的[OpenHarmony](https://gitee.com/openharmony)也有用到 Linux 内核。所以，如果你的手机不是苹果，它里面大概率就会有一个修改过的 Linux 内核。

### Linux 与 Android 中的用户权限

Linux 操作系统是多用户操作系统，用户`root`拥有最高权限——对系统的完全控制权。拥有 root 权限的用户可以把其他用户添加到 root 用户组。在 root 用户组里，每个用户都有 root 权限。

在 Android 操作系统中，**每个应用（APP）都是一个独立的用户**。如果没有`root`用户把 APP 添加到 root 用户组，就没有 APP 能够获得 root 权限。

而在正常情况下，你在手机上见到的所有画面都是 APP 的进程（比如系统界面是`com.android.systemui`）。这时想要获得 root 权限，就需要修改更底层的东西。

### Bootloader 锁

Bootloader，即启动引导加载程序。它负责在计算机启动时，引导操作系统加载。

在 bootloader 执行的过程中，如果签名验证未通过，说明系统底层文件被修改。这时 bootloader 会停止执行，**无法进入系统**。这被称为 bootloader（BL）锁。

### Magisk

The **Magic Mask** for Android，是一套用于定制 Android 的开源软件。它可以为应用程序提供 root 访问权限。后文简称**面具**。

面具获取 root 权限的原理是通过修改 boot 分区，代理 linux 内核的第一个进程 init。[^1]

[^1]: [何为 root？维术：https://mp.weixin.qq.com/s/eF9izvazeSZ1bVxOcxamQg](https://mp.weixin.qq.com/s/eF9izvazeSZ1bVxOcxamQg)

面具修改了系统分区。因此，使用面具的前提是解除 BL 锁。

## 准备工作

### 解除 BL 锁

> 解锁 BootLoader 实际上就是让 BootLoader 启动链上某些阶段的签名验证不生效。[^2]

[^2]: [当我们谈论解锁 BootLoader 时，我们在谈论什么？维术：https://mp.weixin.qq.com/s/-9VKyraHq5Qt2PTzqVqZOg](https://mp.weixin.qq.com/s/-9VKyraHq5Qt2PTzqVqZOg)

你需要在你手机厂商的网站上申请，然后用他们提供的工具解锁。但不是所有厂商都支持。

注意：解锁 BL 后会**清除所有用户数据，恢复出厂设置**。请提前做好你重要文件的备份。

### 提取 boot.img

在网上搜索，找到你手机的安装包。

通常是一个`.zip`或.`tgz`格式的压缩包。确保手机型号一致、操作系统版本一致。

解压后找到`boot.img`或者`init_boot.img（如果有）`。复制两份，分别保存到手机和电脑，备用。

- 如果你找不到`boot.img`，而找到了`payload.bin`：参考[这篇教程](https://magiskcn.com/payload-dumper-go-boot)。或者使用[MT 管理器](https://mt2.cn/)提取。
- 如果你的手机<em><strong>已经 root 了</strong></em>：可以在`adb shell`下使用`ls -l /dev/block/by-name/`查看分区表。找到 boot 分区，比如`/dev/block/sdc41`。使用`dd if=/dev/block/sdc41 of=/sdcard/boot.img`提取 boot 分区。

### 通过 USB 调试手机

在手机设置里找到系统版本（比如 MIUI，是在“全部参数”里的“MIUI 版本”）。连续点击，直到手机出现提示框“您现在处于开发者模式”。

在手机设置里找到开发者选项，进入。找到**USB 调试**选项并开启。

下载[Android SDK Platform-Tools](https://developer.android.google.cn/studio/releases/platform-tools?hl=zh-cn)，解压到你喜欢的目录。比如`D:\platform-tools`。你会看到目录里有`adb.exe`和`fastboot.exe`等一些文件。

打开命令行（Windows 下 win+R 输入 cmd，回车），你会看到：

```shell
C:\Users\你的用户名\>
```

这是你当前所在的目录。当你要执行一个`.exe`文件时，系统先从当前目录里寻找。如果找不到，就从环境变量里寻找。再找不到就打印错误信息。

你刚才解压出来的`.exe`文件只能在它们所在的目录下运行。如果不想切换目录，想让它们在任意目录下都可以运行，需要把它们**所在的目录**添加到**环境变量 Path**。

Windows 10 下，`Win + I`打开设置。系统->关于->高级系统设置->环境变量，双击系统变量`Path`，新建，把`D:\platform-tools`复制到列表，确定确定确定。这样环境变量就设置好了。

用数据线连接手机和电脑。你可以尝试在`cmd`里使用命令

```shell
adb devices
```

这时手机会弹出授权窗口。点击确定，你会在电脑上看到：

```shell
List of devices attached
你手机的序列号        device
```

说明 adb 连接成功。

## 戴上面具

[下载面具](https://github.com/topjohnwu/Magisk/releases)并安装打开，你将看到：

<img src="/blog/images/magisk.webp">

如果 Ramdisk 为**否**，或者你的手机品牌是**华为**或**三星**：参考 [Magisk 中文文档](https://jesse205.github.io/MagiskChineseDocument/install.html)。

点击“安装”按钮。如果你手机的安装包中有`vbmeta.img`，选中“修补 boot 映像中的 vbmeta”选项。否则不选中。

在方式中选择“选择并修补一个文件”。然后选择你提取出来的`boot.img`或`init_boot.img`。点击“安装”。

面具会把修补后的文件`magisk_patched-[版本号_随机字符].img`存放到 SD 卡的`Download`目录下。

把修补后的文件复制到电脑：

```shell
adb pull /sdcard/Download/magisk_patched-[版本号_随机字符].img 电脑上的一个文件夹路径
```

重启手机到`fastboot`模式：

```shell
adb reboot bootloader
```

刷写新的`boot`分区：

```shell
fastboot flash boot（或者init_boot） 电脑上的一个文件夹路径\magisk_patched-[版本号_随机字符].img
```

重启手机：

```shell
fastboot reboot
```

打开面具。如果看到了 Magisk->当前的版本号，说明成功。

- 如果你的手机打不开了：说明面具不适合你的手机，或者你有地方做错了。
  你需要长按【电源】键重启，然后马上同时按住【电源】键和【音量+】键（也有手机是【电源】键和【音量-】键）。这会把手机重启到`fastboot`模式。
  然后使用以下命令恢复 boot 分区：
  ```shell
  fastboot flash boot（或者init_boot） 电脑上的一个文件夹路径\你修补前的boot.img
  ```
- 在安装面具后：需要禁用系统自动更新。[后续处理——更新系统时](#后续处理更新系统时)

## 隐藏面具

为了用户安全，一些银行类的 app 在检测到 root 后会禁止用户使用。需要对这一类 app 隐藏 root。

### 使用 Shamiko 隐藏 root

Shamiko 是一个面具模块，用于隐藏 root。

- 如果使用的是[Magisk Delta](https://github.com/magojohnji/Magisk-delta/blob/main/intro.md)，则不能安装此模块。可用其内置的 MagiskHide。

在面具设置里：

- 找到“Zygisk”，**开启**。

- 找到“遵守排除列表”，**关闭**。

- 找到“配置排除列表”，选择要对其隐藏 root 的应用。点击，在展开的列表里全部打上勾，直到上方进度条满。

[下载 Shamiko](https://github.com/LSPosed/LSPosed.github.io/releases/) 。打开面具->模块->从本地安装->选择下载的`shamiko-[版本号]-release.zip`->确定->重启手机。

如果看到模块->Shamiko 的简介里露出了 😋，说明 Shamiko 正常运行。

### 使用随机包名隐藏面具应用

面具设置->隐藏 Magisk 应用

## 后续处理——更新系统时

系统更新前：先打开面具，选择“卸载 Magisk”->**还原原厂映像**。然后更新系统。

系统更新后：仍然使用提取 boot->修补 boot->刷入 boot 的方式安装面具。

- 如果希望在更新系统时保留面具：参考[这篇文档](https://jesse205.github.io/MagiskChineseDocument/ota.html)。
