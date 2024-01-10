---
title: 用 browser-sync 实现在文件内容改变后立即刷新页面
date: 2023-8-23 16:31:00
categories: 无分类
permalink: UC/bs/
---

起因是：

不管是直接打开 html 文件，还是用`python -m http.server 8000 --bind 127.0.0.1`，在修改保存 html 文件后浏览器都不能立马刷新。

结果是：

用 Vue 就没这么多事了。

<!--more-->

1. 安装

   ```sh
   npm install browser-sync
   ```

   安装到想作为服务器根目录的文件夹。以前觉得全局安装好，现在暂时觉得本地安装好。（据说用 Flask 也能实现立即刷新，用搜到的方法结果版本不匹配）

2. 运行

   ```sh
   npx browser-sync start --server --files "."
   ```

   `--files` 后指定要监视的文件。

   `.` 表示监视当前目录以及子目录下的所有文件。

   可以改成 `*.html`，`public/*.*` 等。

html 文件里至少得有一对`<body>`标签，要么没法自动刷新。

在没有修改文件内容，只 `Ctrl + S` 保存时也会刷新，在命令行会输出 `File event [change]`，只不过看不出来。

好像和直接通过浏览器来刷新不一样，因为我在选项卡上没看到加载动画。
