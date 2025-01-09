---
title: Win10 Dolphin模拟器连接Wii手柄教程
date: 2024-10-13 19:00:00
categories: 实用系列
permalink: win10-dolphin-wii.html
---

## 环境

- Windows 10
- Dolphin 5.0-15099

## 步骤

1. 打开任务栏右下角操作中心里的蓝牙开关
2. 右击“转到设置”。或者【设置-设备-蓝牙和其他设备】
3. 点击右边的相关设置-设备或打印机。或者【控制面板-硬件和声音-设备和打印机】
4. 点击“添加设备”，同时按手柄的 1 和 2 键，这时手柄的四个灯会一起闪
5. 扫描上的标志是“添加设备”对话框里出现 Nintendo RVL-CNT-01
6. 选择 Nintendo RVL-CNT-01 连接，弹出让你填写 PIN 的对话框，不用管直接下一步
7. Dolphin 模拟器-控制器

<img src="/blog/images/dolphin.png">

8. 连上的标志是手柄会震动一下，之后变成只有第一个灯亮

## 手柄离灯条的距离

据笔者并不怎么精确的测量，手柄前端相对于灯条的水平方向向前 80cm 处，竖直方向向下 30cm 处为宜，手柄从下往上对着灯条照。

<img src="/blog/images/wii-remote.webp">

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
