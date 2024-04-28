---
title: 用 browser-sync 实现在文件内容改变后立即刷新页面
date: 2023-8-23 16:31:00
categories: 无分类
permalink: browser-sync.html
---

起因是：

不管是直接打开 html 文件，还是用`python -m http.server 8000 --bind 127.0.0.1`，在修改保存 html 文件后浏览器都不能立马刷新。

<!--more-->

```sh
npm install browser-sync
```

```sh
npx browser-sync start --server --files "."
```

`--files` 后指定要监视的文件。

`.` 表示监视当前目录以及子目录下的所有文件。

可以改成 `*.html`，`public/*.*` 等。

html 文件里至少得有一对`<body>`标签，要么没法自动刷新。
