---
title: 关于
date: 2023-05-27 14:48:35
mathjax: true
---

## 软件

[右键菜单管理](https://github.com/BluePointLilac/ContextMenuManager)
| [沉浸式翻译](https://immersivetranslate.com/docs/)
| [Pot](https://github.com/pot-app/pot-desktop)

RELEASE / GA > RC > M > SNAPSHOT，正式版 / 通用可用版 > 发布候选版 > 里程碑版 > 快照版

x64 == x86_64 == AMD64 != ARM64 == AARCH64

## 怎么把这个网站搞出来的

[Hexo](https://hexo.io/zh-cn/docs/) 是一个博客框架，它把带 [YAML Front matter](https://jekyllrb.com/docs/front-matter/) 的 [Markdown](https://markdown.com.cn/) 文件通过 [Node.js](https://nodejs.org) 和 [Pandoc](https://pandoc.org/) 渲染成静态的 html 文件。[NexT](https://theme-next.js.org/)是针对 Hexo 的主题，可以理解为 CSS。

[Github Pages](https://docs.github.com/zh/pages/getting-started-with-github-pages) 用于托管静态网页，就是放在上面就不能动了，没有数据库，更新页面要重新上传。创建一个名为 `yourusername.github.io` 的仓库，分支为 `gh-pages`。然后可以访问 `yourusername.github.io`。之后再创建的名为 `sample` 且分支为 `gh-pages` 的仓库，为 `yourusername.github.io/sample`。

[Dynadot](https://www.dynadot.com/) 是一个域名提供商，买一个域名。设置 DNS 为 Dynadot DNS。域名记录，A 记录指向 `185.199.109.153`，AAAA 记录指向 `2606:50c0:8001::153`。这两个是 Github Pages 的公共 IP，可以通过 ping `yourusername.github.io`。子域名 www 的 CNAME 记录指向 `yourusername.github.io`。对应仓库（根仓库）的根目录加一个 `CNAME` 文件，内容为购买的域名。仓库设置 -> pages -> Custom domain -> Enforce HTTPS。然后等 Github 检查 DNS，排队从 Let's Encrypt 获取 SSL 证书。

你可以使用[Whois](https://www.whois.com/whois)来查询这些一键生成的页面背后的操作者是谁。在 Github 查看[笔记修改历史](https://github.com/ruofancooh/blog-source/commits/main)。

## 电磁波

$$
\lambda = \frac{3 \times 10^8 \mathrm{m/s}}{f}
$$

| 名字/描述               | 频率约（Hz）   |
| ----------------------- | -------------- |
| AM 广播                 | 535K ~ 1606K   |
| FM 广播                 | 87M ~ 108M     |
| 手机移动数据和通话      | 700M ~ 4900M   |
| 卫星定位（GPS L1 频段） | 1575.42M       |
| 蓝牙、Wi-Fi             | 2.4G ~ 2.4835G |
| 微波炉                  | 2.45G          |
| Wi-Fi （5GHz 频段）     | 5.15G ~ 5.825G |
| 红外线                  | 300G ~ 400T    |
| 可见光                  | 390T ~ 750T    |
| 紫外线                  | 750T ~ 30P     |
| X 射线                  | 30P ~ 30E      |
| γ 射线                  | 30E 以上       |

## 他山

[蓝或者绿](https://ismy.blue)
| [老生常谈](https://Laosheng.top/)
| [素问](https://sooon.ai/)
| [WHO](https://www.who.int/zh/news-room/fact-sheets/detail/mental-disorders)
| [SYMBL](https://symbl.cc/cn/)
| [主义主义](https://www.processon.com/view/link/6081a821e401fd45d70436af)
| [涟波词集](https://kevinz.cn/lyricbook/?a=Kevinz)]
| [老男人游戏网](https://www.oldmantvg.net/)
