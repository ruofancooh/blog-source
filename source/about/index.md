---
title: 关于
date: 2023-05-27 14:48:35
---

<img src="/blog/images/edge.webp">

## 在手机端可能找不到入口的页面

- [分类页](/blog/categories)
- [归档页](/blog/archives)

## 怎么把这个网站搞出来的

Hexo 是一个博客框架，它把带 YAML Front matter 的 Markdown 文件通过 Node.js 和 Pandoc 渲染成静态的 html 文件。

Github Pages 用于托管静态网页，就是放在上面就不能动了，没有数据库，更新页面要重新上传。创建一个名为 `yourusername.github.io` 的仓库，分支为 `gh-pages`。然后可以访问 `yourusername.github.io`。之后再创建的名为 `sample` 且分支为 `gh-pages` 的仓库，为 `yourusername.github.io/sample`。

Dynadot 是一个域名提供商，买一个域名。设置 DNS 为 Dynadot DNS。域名记录，A 记录指向 `185.199.109.153`，AAAA 记录指向 `2606:50c0:8001::153`。这两个是 Github Pages 的公共 IP，可以通过 ping `yourusername.github.io`。

子域名 www 的 CNAME 记录指向 `yourusername.github.io`。对应仓库（根仓库）的根目录加一个 `CNAME` 文件，内容为购买的域名。仓库设置 -> pages -> Custom domain -> Enforce HTTPS。然后等 Github 检查 DNS，排队从 Let's Encrypt 获取 SSL 证书。

据说 `.me` 域名不能在国内备案，托管静态网页的 Github 服务器也在国外。但这些内容又不是什么重大机密，机密能让你查到吗？心理咨询师说：

> 都在关心自己，没人关心你。

笔者能明白为什么这样说。因为 **_所有社交恐惧者都在害怕别人关心自己_**。

- [Github Pages 使用入门](https://docs.github.com/zh/pages/getting-started-with-github-pages)
- [Hexo 文档](https://hexo.io/zh-cn/docs/)
- [Hexo-NexT 文档](https://hexo-next.readthedocs.io/zh_CN/latest/)
- [Hexo 博客 NexT 主题的安装使用](http://home.ustc.edu.cn/~liujunyan/blog/hexo-next-theme-config/)
- [笔记修改历史](https://github.com/ruofancooh/blog-source/commits/main)
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
