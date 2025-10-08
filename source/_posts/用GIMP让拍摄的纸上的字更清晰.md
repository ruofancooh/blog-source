---
title: 用 GIMP 让拍摄的纸上的字更清晰
date: 2023-09-14 14:30:00
permalink: gimp-make-words-on-the-photographed-paper-clearer.html
---

0. [GIMP](https://www.gimp.org/downloads/)
1. 拍摄
2. 裁剪
3. **彩色转黑白**
4. **白平衡**
5. 导出图片

<!--more-->

1. 首先要拍清晰，手不抖。
   <img src="/blog/images/hw-0.webp">
2. 在拍完之后适当裁剪。
3. - GIMP -> 文件 -> 打开 -> 选择图片
   - GIMP -> 颜色 -> 去色 -> 彩色到灰度
     <img src="/blog/images/hw-1.webp">

看起来雾蒙蒙的，而且太白了。

4. 白平衡

   - GIMP -> 颜色 -> 自动 -> 白平衡
     <img src="/blog/images/hw-2.webp">
     看起来好多了。

5. 导出图片

   - GIMP -> 文件 -> 导出为 -> 文件名.jpg -> 导出
   - 其中，【保存 Exif 数据】、【保存 XMP 数据】、【保存 IPTC 数据】、【保存缩略图】、【保存色彩配置文件】都不用选。【高级选项】调了没看出明显区别，所以不用调。
   - 导出质量设成 `10` 就行，质量越低文件越小，只要还能分辨出字就行。
   - 笔者用 `10` 导出看起来和导出前没啥区别，但是用 `0` 导出就：
     <img src="/blog/images/hw-3.webp">
     有点恐怖。~~但是更清楚了~~
