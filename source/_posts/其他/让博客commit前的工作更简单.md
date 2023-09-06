---
title: 让博客commit前的工作更简单
date: 2023-08-27 20:38:00
---

起因是，我是把博客代码分两个仓库存的。需要做很多重复的工作。

于是我写了两个 bat 文件。

<!--more-->

起因是，我是把博客代码分两个仓库存的：

- `blog-source`存 Hexo 框架源码，NexT 主题源码和自己的部分（更改后的配置文件、md 文档、图片等）

- `blog`存渲染之后的网页，分支是`gh-pages`

这就造成在 commit 前，我需要做以下工作：

1. 在`blog-source`文件夹里先打开本地预览服务器。

2. 点击链接，在浏览器里打开。

3. 预览没问题，渲染网页。

4. 删除`blog`文件夹里除了`.git`外的所有文件和文件夹。

5. 把渲染的网页从`blog-source/public/`转移到`blog`文件夹里。

6. 清除`blog-source`文件夹里渲染的网页。

手动操作了十几天后很烦，于是我写了两个 bat 文件：

`bs.bat` 做第 1-2 步

```bat
cd /d d:\repo\blog-source
start http://localhost:4000/blog/
call npx hexo s
```

`bg.bat` 做第 3-6 步

```bat
:: 删除旧文件
cd /d d:\repo\blog
git rm -r *
:: 渲染新文件
cd ..\blog-source
call npx hexo g
:: 转移新文件
xcopy public ..\blog /s /e
call npx hexo clean
```

再建一个专门存 bat 的文件夹，把它添加到环境变量 PATH。这样在任一文件夹下都可以做第 1-6 步了。

commit 我用的是 GitHub Desktop，暂时没有换的必要。
