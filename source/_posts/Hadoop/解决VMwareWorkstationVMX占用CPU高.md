---
title: 解决 VMware Workstation VMX 占用 CPU 高
date: 2023-10-30 22:00:00
categories: Hadoop
permalink: vmware-vmx-high-cpu-usage.html
---

只是在做完这些操作后的一段时间，没有再出现这个问题，并不能保证这些操作的每一步都是一定对的，或有用的。过了两个月，这个问题又出现了。并且前三步的结果还是放在那里的，说明前三步可能是没有用的。方向搞错了：你在物理机上看任务管理器，为什么不在虚拟机上看任务管理器。

<!--more-->

## 可能没有用的操作

1. 控制面板 -> 程序 -> 程序和功能 -> 启用 Windows 功能 -> 取消勾选【适用于 Linux 的 Windows 子系统】
2. `Win + R` 打开 `services.msc`，停止【HV 主机服务】。
3. 管理员身份在 cmd 里执行：

```cmd
bcdedit /set hypervisorlaunchtype off
```

4. 重启电脑。

## 新问题

起因是，配置 HDFS 高可用自动故障转移，把 Active 的 NN 杀了。然后它不但没有故障转移，反而故障了。

查看进程：

```sh
top
```

DataNode 出问题了，CPU 占满了。看 log：DataNode 和 ZKFC 的 log 文件大小都在涨，一直在尝试重连。所以**当 CPU 占用高，写磁盘不到 1MB/s，可能是出问题了在一直写 log**。所以要习惯看 log，本来就是盲人摸 Hadoop，log 看不明白就完了。
