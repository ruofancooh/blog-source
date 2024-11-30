---
title: GBK与UTF-8与锟斤拷的成因
date: 2024-11-15 19:00:00
categories: 实用系列
permalink: gbk-utf8.html
---

一位十六进制数表示四位二进制数，两位十六进制数表示一个字节。

ASCII 有 128 个符号，使用一个字节表示，范围是 00000000-01111111 即 00-7F

参考：[字符编码/解码](https://www.toolhelper.cn/EncodeDecode/EncodeDecode) | [SYMBL](https://symbl.cc/) | [HexED.it](https://hexed.it/)

## GBK

是 GB2312 的超集，有 21886 个符号，使用两个字节表示一个符号。当文本中同时包含 GBK 与 ASCII 字符时，GBK 对 ASCII 字符仍用一个字节表示。

总体编码范围为 8140-FEFE 之间，首字节在 81-FE 之间，避开了 ASCII 的 00-7F，尾字节在 40-FE 之间。

## UTF-8

Unicode：为一个符号分配一个码，常用汉字的范围在 U+4E00 到 U+9FFF

UTF-8：使用 1 到 4 个字节表示一个 Unicode 码。其中用 1 个字节表示的与 ASCII 兼容。

用 n 个字节（n>1）表示的，头个字节以 n 个 1 带 1 个 0 开头，后面字节全以 10 开头（在 80-BF 的范围内）。

| Unicode                 | UTF-8                               | 第二列各个字节的十六进制范围 |
| ----------------------- | ----------------------------------- | ---------------------------- |
| 0000 0000-0000 007F     | 0xxxxxxx                            | 00-7F                        |
| 0000 0080-0000 07FF     | 110xxxxx 10xxxxxx                   | C0-DF 80-BF                  |
| **0000 0800-0000 FFFF** | **1110xxxx 10xxxxxx 10xxxxxx**      | E0-EF 80-BF 80-BF            |
| 0001 0000-0010 FFFF     | 11110xxx 10xxxxxx 10xxxxxx 10xxxxxx | F0-F7 80-BF 80-BF 80-BF      |

<style>
    .r{
        color:red
    }
    .o{
        color:orange
    }
    .g{
        color:green
    }
    .b{
        color:blue
    }
</style>

如【这】的 Unicode 是 **U+<span class="r">8</span><span class="o">F</span><span class="g">D</span><span class="b">9</span>** 等于**<span class="r">1000</span>
<span class="o">1111</span>
<span class="g">1101</span>
<span class="b">1001</span>**，把它补到空位 x 里：

**1110<span class="r">1000</span>
10<span class="o">1111</span><span class="g">11</span>
10<span class="g">01</span><span class="b">1001</span>**

= E8BF99

## 锟斤拷的成因

1. 有一个 GBK 编码的文本文件 A
2. 用 UTF-8 编码读 A，其中不符合 UTF-8 规范的十六进制值被解析为字符 �
3. 把 A 保存为 UTF-8 格式的新文件 B，则 � 被记录为 EFBFBD
4. 再用 GBK 编码读文件 B，如果有相邻的两个 �，即 EFBFBDEFBFBD，则读为 EFBF BDEF BFBD
5. 在 GBK 里，EFBF = 锟，BDEF = 斤，BFBD = 拷

- 汉字：这是一段测试文本
- GBK：D5E2 CAC7 D2BB B6CE B2E2 CAD4 CEC4 B1BE
- 用 UTF-8 编码读它：D5 E2 CA C7 D2BB B6 CEB2 E2 CA D4 CE C4B1 BE
  - D5 表示两字节字符的开始，以 110 开头，但它后面的 E2 并不在 80-BF 的范围之内，于是 D5 被解析为一个 �
  - E2 表示三字节字符的开始，但它后面的 CA 并不在 80-BF 的范围之内，于是 E2 被解析为一个 �
  - ……
  - D2 表示两字节字符的开始，它后面的 BB 在 80-BF 的范围之内
    - 于是：D2 BB = 110<span class="r">10010</span> 10<span class="b">111011</span>
    - 0<span class="r">100 10</span><span class="b">11 1011</span> = 4BB
    - U+04BB 为 һ（Cyrillic Small Letter Shha）
  - ……
  - CE 表示两字节字符的开始，它后面的 B2 在 80-BF 的范围之内
    - 于是：CE B2 = 110<span class="r">01110</span> 10<span class="b">110010</span>
    - 0<span class="r">011 10</span><span class="b">11 0010</span> = 3B2
    - U+03B2 为 β（Greek Small Letter Beta）
  - ……
  - 读的结果是：����һ�β����ı�
- 用 UTF-8 的格式保存时
  - � = U+FFFD = U+11111111 11111101
    - 补到 1110xxxx 10xxxxxx 10xxxxxx 里
    - 11101111 10111111 10111101 = EFBFBD
  - 保存的结果是：EFBFBD EFBFBD EFBFBD EFBFBD D2BB EFBFBD CEB2 EFBFBD EFBFBD EFBFBD EFBFBD C4B1 EFBFBD
- 再用 GBK 编码读
  - EFBF BDEF BFBD EFBF BDEF BFBD D2BB EFBF BDCE B2EF BFBD EFBF BDEF BFBD EFBF BDC4 B1EF BFBD
  - 结果是：锟斤拷锟斤拷一锟轿诧拷锟斤拷锟侥憋拷
