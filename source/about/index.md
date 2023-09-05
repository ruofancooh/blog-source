---
title: 关于
date: 2023-05-27 14:48:35
mathjax: true
---

## 博主

<p id="myAge"></p>

<script>
  const pLabel_myAge = document.getElementById("myAge");
  const ms_astronomy_julian_year = 31557600000;
  const timestamp_my_birth = 990773520000;
  const decimal_places = 3;

  function getMyAge() {
    let timestamp_UTC = new Date().getTime();
    let age = (timestamp_UTC - timestamp_my_birth) / ms_astronomy_julian_year;
    return age;
  }

  function updateMyAge() {
    let age = getMyAge();
    pLabel_myAge.innerText = `24 - ${(24 - age).toFixed(decimal_places)} 岁，是学生。`;
  }

  updateMyAge();
</script>

## 为什么写博客

<span id="deadline" style="color:rgba(85,85,85,1)">因为现实的引力。</span>（牛顿直呼内行）

因为我没有学习动力。

<script>
const pLabel_deadline = document.getElementById("deadline");
const school_year = 2;

function updateColor() {
  let percentage = (24 - getMyAge()) / school_year;
  pLabel_deadline.style=`color:rgba(85,85,85,${percentage*0.5});`;
}

updateColor();
</script>

## 为什么转移阵地

<img src="/blog/images/about-1.webp">

## 博客内容及分类

暂定：

| 分类名 | 内容                       |
| ------ | -------------------------- |
| 1.概念 | 以“介绍”、“厘清关系”为主。 |
| 2.教程 | 以“实用”、“行动指导”为主。 |
| 3.共鸣 | 以“观点”、“思想”为主。     |
| 4.探索 | 对新知识盲人摸象的记录。   |

动机是对某一件事情有兴趣，为了更清楚地弄明白这件事，不如把它写下来。这样不清楚的地方就要查资料，要不就是胡说了嘛。但由于是边学边写的，难免有不准确的地方，在意识到之后会改。

可以查看博客的[历史修改记录](https://github.com/ruofancooh/blog-source/commits/main)。

实际上由于我认知的局限性，分类之间的界限会非常模糊。第一分类和第四分类里的内容可以出现在任一分类里，第二分类也可能属于第四分类，而第四分类里的内容还可能比第二分类更实用，第三个分类是自我批评用的。

## 怎么建站的

[Hexo](https://hexo.io/zh-cn/) 是一个博客框架，可以把 Markdown 文档转换成静态网页。是**自行车**。

[NexT](https://theme-next.js.org/) 是一套可以在 Hexo 框架里使用的主题配置，作用相当于 CSS。是**喷漆**。

[Github Pages](https://pages.github.com/) 是 Github 提供的、用于托管静态网页的服务。只需上传静态网页，就可以通过`username.github.io`访问。也可以绑定购买的域名。是**马路**。

参考：

- [Github Pages 使用入门](https://docs.github.com/zh/pages/getting-started-with-github-pages)

- [Hexo 文档](https://hexo.io/zh-cn/docs/)

- [Hexo-NexT 文档](https://hexo-next.readthedocs.io/zh_CN/latest/)

- [Hexo 博客 NexT 主题的安装使用](http://home.ustc.edu.cn/~liujunyan/blog/hexo-next-theme-config/)

## 网络一线牵

如果你发现博客内容有误，或者想和我成为朋友：

QQ 号：$863^3-88811$

86 上山，见三爸而邀。

## 真·网络一线牵

可以说是单向友情链接：

- [阮一峰的博客](https://www.ruanyifeng.com/blog/)

- [老生常谈](https://laosheng.top/)

- [涟波词集](https://kevinz.cn/lyricbook/?a=Kevinz)
