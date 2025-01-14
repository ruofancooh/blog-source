---
title: Win10 Dolphin模拟器连接Wii手柄教程
date: 2024-10-13 19:00:00
categories: 实用系列
permalink: win10-dolphin-wii.html
---

## 环境

- Windows 10
- Dolphin 2412
- 看你具体的蓝牙适配器型号

Dolphin 连接游戏控制器有两种模式：直通模式和模拟模式。前者可以连接多个真实手柄；后者只能连接一个真实的手柄（存疑），但可以手柄和电脑键盘混用。

参考[Dolphin Emulator Wiki 的蓝牙直通模式](https://wiki.dolphin-emu.org/index.php?title=Bluetooth_Passthrough)。

## 步骤

1. 使用[Zadig](https://zadig.akeo.ie/)把蓝牙适配器的驱动改成 libusbK
   - Options -> List All Devices
   - Replace Driver
2. 打开一个游戏
3. Dolphin 模拟器 -> 控制器

<img src="/blog/images/wii-remote.webp">

4. 点击“同步”，同时按手柄的 1 和 2 键，这时手柄的四个灯会一起闪
5. 连上的标志是手柄变成只有一个灯亮，按连接的顺序，第一个连接的手柄是 1P，亮第一个灯

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
