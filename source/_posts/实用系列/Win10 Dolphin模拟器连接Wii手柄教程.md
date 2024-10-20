---
title: Win10 Dolphin模拟器连接Wii手柄教程
date: 2024-10-13 19:00:00
categories: 实用系列
permalink: win10-dolphin-wii.html
---

虽然各种原理都不知道，但是最后还是连上了。由于笔者不是第一次连，所以不确定这套操作适不适用第一次。

<!--more-->

## 环境

- Windows 10
- Dolphin 5.0-15099
- 使用 [Zadig](https://zadig.akeo.ie/) 查看 Options -> List All Devices
  - 蓝牙适配器为：英特尔(R)无线 Bluetooth(R)
  - 驱动为：BTHUSB(v22.0.0.2)

## 步骤

1. 打开任务栏右下角操作中心里的蓝牙开关
2. 右击“转到设置”。或者【设置-设备-蓝牙和其他设备】
3. 点击右边的相关设置-设备或打印机。或者【控制面板-硬件和声音-设备和打印机】
4. 点击“添加设备”，同时按手柄的 1 和 2 键，这时手柄的四个灯会一起闪
5. 扫描上的标志是“添加设备”对话框里出现 Nintendo RVL-CNT-01
6. 选择 Nintendo RVL-CNT-01 连接，弹出让你填写 PIN 的对话框，不用管直接下一步
7. 连上的标志是手柄会震动一下，之后变成只有第一个灯亮
8. Dolphin 模拟器-控制器

<img src="/blog/images/dolphin.png">
