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

- 【超我】的想法：

  【本我】没有学习动力，【自我】用写文章的形式激励【本我】学习。

- 【本我】的想法：

  【超我】想要学习，【自我】用写文章的形式满足【本我】的成就感，迷惑【超我】，以达到学习的假象。

- 经过一番斗争后，【自我】的想法：

  1. 为了有趣/好玩/娱乐。为了满足表达欲。
  2. 为了验证、演绎和传递知识。
  3. <p id="deadline" style="color:rgba(85,85,85,1)">（右键检查元素）你所热爱的，就是你的生活。</p>

<script>
const pLabel_deadline = document.getElementById("deadline");
const school_year = 2;

function updateColor() {
  let percentage = (24 - getMyAge()) / school_year;
  pLabel_deadline.style=`color:rgba(85,85,85,${percentage*0.5});`;
}

updateColor();
</script>

## 博客内容及分类

暂定：

| 分类名 | 内容                       |
| ------ | -------------------------- |
| 1.概念 | 以“介绍”、“厘清关系”为主。 |
| 2.教程 | 以“实用”、“行动指导”为主。 |
| 3.共鸣 | 以“观点”、“思想”为主。     |
| 4.探索 | 对新知识盲人摸象的记录。   |

实际上由于我的局限性，第一分类和第四分类里的内容可以出现在任一分类里，第二分类也可能属于第四分类。

以下文字待取舍：

> “博客”是 blog 的音译。blog 全称 weblog，即“网络日志”。并不只能包含**知识**，也可以包含**观点**和**情绪**。
>
> 一般前两者同时出现，或者后两者同时出现。两者同时出现时，比例最好要大于$8:2$。
>
> 我认为，目前我很难用文字描述纯粹的“感性”，而是在尝试用一种理性的方式理解感性。
>
> 理由是：在我打这段文字时，我是“心如止水”的，并且比一天中的任何时间都平静、有活力。在想写的写完之后关掉手机，回想之前写的，心跳相比之前会越来越乱。
>
> *动机*是对某一件事情有兴趣，为了更清楚地弄明白这件事，不如把它写下来。这样不清楚的地方就要查资料，要不就是胡说了嘛。但由于是边学边写的，难免有不准确的地方，在意识到之后会改。
>
> 观点和情绪的部分没什么好说的。知识的部分都遵循[知识共享协议 署名-非商业性使用-相同方式共享 4.0 国际 (CC BY-NC-SA 4.0)](https://creativecommons.org/licenses/by-nc-sa/4.0/deed.zh)。

## 怎么建站的

[Hexo](https://hexo.io/zh-cn/) 是一个博客框架，可以把 Markdown 文档转换成静态网页。

[NexT](https://theme-next.js.org/) 是一套可以在 Hexo 框架里使用的主题配置，作用相当于 CSS。

[Github Pages](https://pages.github.com/) 是 Github 提供的、用于托管静态网页的服务。只需上传静态网页，就可以通过`username.github.io`访问。也可以绑定购买的域名。

参考：

- [Github Pages 使用入门](https://docs.github.com/zh/pages/getting-started-with-github-pages)

- [Hexo 文档](https://hexo.io/zh-cn/docs/)

- [Hexo-NexT 文档](https://hexo-next.readthedocs.io/zh_CN/latest/)

- [Hexo 博客 NexT 主题的安装使用](http://home.ustc.edu.cn/~liujunyan/blog/hexo-next-theme-config/)

可以[查看这个站点的 Github 仓库](https://github.com/ruofancooh/blog)。

## 网络一线牵

QQ 号：$863^3-88811$

这只是为了防机器人。你可能有在点开“新朋友”后发现是机器人加好友的经历。

## 真·网络一线牵

一些我觉得很有价值、并间接推动了此博客诞生的站点：

- [哔哩哔哩](https://www.bilibili.com/)：但是我没有耐心看视频，更喜欢从文字获取知识

- [知乎](https://www.zhihu.com/)：看不同人对同一问题的看法（如知）

- ⭐[阮一峰的博客](https://www.ruanyifeng.com/blog/)：科技爱好者周刊

- ⭐[老生常谈](https://laosheng.top/)：新时代的互联网知识图谱

- [Bing](https://cn.bing.com)/Github/Google/Stackoverflow/Wikipedia/~~ChatGPT 镜像网站、浏览器及翻译插件~~

- ......
