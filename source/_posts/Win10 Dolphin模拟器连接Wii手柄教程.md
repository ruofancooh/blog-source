---
title: Win10 Dolphin模拟器连接Wii手柄教程
date: 2024-10-13 19:00:00
permalink: win10-dolphin-wii.html
---

手柄 --> 蓝牙适配器 --> 蓝牙驱动 --> 操作系统 --> 模拟器

- 第一个箭头：同时按手柄的 1 和 2 键，或者后盖里面的 SYNC 按钮。这时手柄的四个灯会一起闪
- 蓝牙适配器：使用 [Zadig](https://zadig.akeo.ie/) 查看蓝牙适配器的 USB ID 和驱动程序版本，Options -> List All Devices

<!--more-->

## 直通模式

0. 在[Bluetooth Passthrough](https://wiki.dolphin-emu.org/index.php?title=Bluetooth_Passthrough#Adapter_test_results)的 Adapter test results 表格查看硬件测试结果，需要一个型号匹配的蓝牙适配器
1. 使用 Zadig 把蓝牙适配器的驱动改成 libusbK
   - 如果想要恢复原来的驱动：
     1. 右击开始图标 -> 设备管理器 -> libusbK USB Devices -> 卸载设备
     2. 操作 -> 扫描检测硬件改动
2. 打开一个游戏
3. Dolphin 模拟器 -> 控制器

<img src="/blog/images/wii-remote.webp">

4. 点击“同步”，再同时按手柄的 1 和 2 键
5. 连上的标志是手柄变成只有一个灯亮，按连接的顺序，第一个连接的手柄是 1P，亮第一个灯

## 模拟模式

参考：[Configuring Controllers](https://wiki.dolphin-emu.org/index.php?title=Configuring_Controllers#Real_Wii_Remote)

## 手柄离灯条的距离

据笔者并不怎么精确的测量，手柄前端相对于灯条的水平方向向前 80cm 处，竖直方向向下 30cm 处为宜，手柄从下往上对着灯条照。

<img src="/blog/images/wii-remote-2.webp">

## 存档转移

- Win
  - 查看游戏 ID：右键属性 -> 信息，如 RNVW01 (00010000524e5657)
  - 导入导出：工具
- 安卓
  - 导入存档：右上角三个点 -> Import Wii Save
  - 导出：设置 -> Config -> User Data
- 手动导入导出
  - Win 的存档路径在：
  ```
  C:\Users\yourname\Documents\Dolphin Emulator\Wii\title
  ```
  - 安卓的存档路径在：
  ```
  /sdcard/Android/data/org.dolphinemu.dolphinemu/files/Wii/title/
  ```
