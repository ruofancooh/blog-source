---
title: Hexo
date: 2023-08-27 20:38:00
categories: 问题
permalink: hexo.html
---

<!--more-->

## md

```md
---
title: CN02 - 概述 - 体系结构
date: 2023-09-09 17:00:00
categories: 计算机网络
permalink: CN/02/
---

- OSI 七层协议：参考模型
- TCP/IP 四层协议：即 Internet protocol suite，实际用到的
- 五层协议：教学模型

<!--more-->

（正文）
```

`permalink:` 告诉框架就按这个链接渲染。没有这个字段时，就按站点配置文件里设置的渲染（年/月/日/文章名之类的）。

`categories:` 不会影响文章链接，只是在 `/blog/categories/` 里创了几个分类文件夹，每个分类文件夹里只有一个 `index.html` （这样可以达到链接不显示 `.html` 的效果）。

- 在 `/blog/categories/某分类/index.html` 里有一些属于此分类的文章链接。
- 而在 `/blog/categories/index.html` 里的链接都是指向 `/blog/categories/某分类/index.html` 的。

所以：

- 在每次渲染前，要设置文章的标题，分类和 `permalink`。
- 在每次渲染后：
  1. 把 `/blog/categories/` 里各个子文件夹里的文件复制到 `/blog/缩写分类名/`。
  2. 删除 `/blog/categories/` 里各个子文件夹。
  3. 删除 `/blog/archives/` 里的多余的年份文件夹。
  4. 修改**站点所有（可以跳转到 `/blog/categories/分类名/` 的）** `.html` 文件里的链接为 `/blog/缩写分类名/`。
- 在所有操作之前，且只用做一次的：
  - 修改所有已经写的 `.md` 文件里的站内链接
