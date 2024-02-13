---
title: 关于
date: 2023-05-27 14:48:35
---

## 不要相信笔者说的话

这相当于一条免责声明，跟“仅供学习交流使用，下载后请于 24 小时之内删除”差不多。加上一般没人会找到这里来，能找到是一种缘分。所以笔者大部分时间在自责。

关于[正经人写不写日记](https://movie.douban.com/subject/26366496/)这件事，心理咨询师告诉笔者：ta 是每天都写的，但是不会发出来；ta 上大学时也在空间里发说说，后来一条一条地删。同理，这个网站可能有一天会没得。

笔者写出来的东西都是笔者不会的——那为什么要写？因为写出来之后，会营造出一种笔者已经会了的错觉。没写的时候是又焦虑又不会，写出来之后还是不会——但是焦虑没了。所以还是写出来比较划算。

## 在手机端可能找不到入口的页面

- [分类页](/blog/categories)

- [归档页](/blog/archives)

## 友情链接

> 《怎样查字典》

- [JavaScript 艺术之旅](https://github.com/tanpero/JavaScript-Art-Tour)

- [网道](https://wangdoc.com/)

- [MDN Web 文档](https://developer.mozilla.org/zh-CN/docs/MDN)

- [阮一峰的博客](https://www.ruanyifeng.com/blog/)

- [老生常谈](https://Laosheng.top/)

- [小时百科](https://wuli.wiki/online/index.html)

- [涟波词集](https://kevinz.cn/lyricbook/?a=Kevinz)

- [永远森林](https://永远森林.com/)

- [主义主义](https://www.processon.com/view/link/6081a821e401fd45d70436af)

- [语文](http://www.dzkbw.com/books/rjb/yuwen/xs1s_2016/)

- [汉典](https://www.zdic.net/)

- [SYMBL](https://symbl.cc/cn/)

- [写作只能塑造真实的自己](https://github.com/Macin20/why-we-write)

把【真实的】三个字去掉。理由见标题 1。

## 怎么把这个网站搞出来的

Hexo 是一个博客框架，它把 markdown 文件渲染成静态的 html 文件。

Github Pages 用于托管静态网页，就是放在上面就不能动了，没有数据库，更新页面要重新上传。创建一个名为 `yourusername.github.io` 的仓库，分支为 `gh-pages`。然后可以访问 `yourusername.github.io`。之后再创建的名为 `sample` 且分支为 `gh-pages` 的仓库，为 `yourusername.github.io/sample`。

Dynadot 是一个域名提供商，买一个域名。设置 DNS 为 Dynadot DNS。域名记录，A 记录指向 `185.199.109.153`，AAAA 记录指向 `2606:50c0:8001::153`。这两个是 Github Pages 的公共 IP，可以通过 ping `yourusername.github.io`。

子域名 www 的 CNAME 记录指向 `yourusername.github.io`。对应仓库（根仓库）的根目录加一个 `CNAME` 文件，内容为购买的域名。仓库设置 -> pages -> Custom domain -> Enforce HTTPS。然后等 Github 检查 DNS，颁发 Let's Encrypt 证书。

据说 `.me` 域名不能在国内备案，托管静态网页的 Github 服务器也在国外。但这些内容又不是什么重大机密，机密能让你查到吗？心理咨询师说：

> 都在关心自己，没人关心你。

- [Github Pages 使用入门](https://docs.github.com/zh/pages/getting-started-with-github-pages)

- [Hexo 文档](https://hexo.io/zh-cn/docs/)

- [Hexo-NexT 文档](https://hexo-next.readthedocs.io/zh_CN/latest/)

- [Hexo 博客 NexT 主题的安装使用](http://home.ustc.edu.cn/~liujunyan/blog/hexo-next-theme-config/)

- [笔记修改历史](https://github.com/ruofancooh/blog-source/commits/main)

## 如何看待互联网

互联网是一个超大的图书馆，这些书在原来都有。

语言模型是一位渊博的学者，这些学问在原来都有。

互联网上有趣的人遍布五湖四海，统统囿于昼夜厨房与爱。

语言模型没法在你面前造一台光刻机出来，没法把刚生出来的鸡蛋孵出小鸡，没法建一个电站，没法种板栗树。就算你家有矿、你是母鸡本鸡、你是刘慈欣、你面前有一本[《如何种板栗树》](https://music.163.com/song?id=1895562245)，你也做不到。还没法[把姜昆和郭德纲拉到一起谈话](https://www.zhihu.com/question/303893367/answer/541776596)。

也没法带大熊猫吃火锅：

<img src="/blog/images/panda.webp">
