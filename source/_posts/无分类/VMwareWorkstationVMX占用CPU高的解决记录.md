---
title: VMware Workstation VMX 占用 CPU 高的解决记录
date: 2023-10-30 22:00:00
categories: 无分类
permalink: UC/b0/
---

只是【在做完这些操作后的一段时间，没有再出现这个问题】

并不能保证【这些操作的每一步都是一定对的，或有用的】

因为我是通过搜索解决的，并不理解每一步操作背后的东西。

过了两个月，这个问题又出现了。并且前三步的结果还是放在那里的，说明前三步可能是没有用的。

现在是把虚拟机内存缩小了一点，不知道有没有用。磨刀不误砍柴工，即使磨的是刀背，负面经验也是经验。

<!--more-->

## 操作

1. 控制面板 -> 程序 -> 程序和功能 -> 启用 Windows 功能 -> 取消勾选【适用于 Linux 的 Windows 子系统】
2. `Win + R` 打开 `services.msc`，停止【HV 主机服务】。
3. 管理员身份在 cmd 里执行：

```cmd
bcdedit /set hypervisorlaunchtype off
```

4. 重启电脑。