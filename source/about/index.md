---
title: 关于
date: 2023-05-27 14:48:35
mathjax: true
---

## 博主

<p id="myAge"></p>

<script>
  const pLabel = document.getElementById("myAge");
  const ms_astronomy_julian_year = 31557600000;
  const timestamp_my_birth = 990773520000;
  const decimal_places = 3;

  function updateAge() {
    let timestamp_UTC = new Date().getTime();
    let age = (timestamp_UTC - timestamp_my_birth) / ms_astronomy_julian_year
    pLabel.innerText = `24 - ${(24 - age).toFixed(decimal_places)} 岁，是学生。`;
  }

  updateAge();
  const ms_interval = ms_astronomy_julian_year / 10 ** (decimal_places + 1);
  setInterval(updateAge, ms_interval);
</script>

## 为什么写博客

- 【超我】的想法：

  【本我】没有学习动力，【自我】用写文章的形式激励【本我】学习。

- 【本我】的想法：

  【超我】想要学习，【自我】用写文章的形式满足【本我】的成就感，迷惑【超我】，以达到学习的假象。

- 经过一番斗争后，【自我】的想法：

  你所热爱的，就是你的生活。

## 博客内容

“博客”是 blog 的音译。blog 全称 weblog，即“网络日志”。并不只包含**知识**，也可以包含**观点**和**情绪**。

一般前两者同时出现，或者后两者同时出现。两者同时出现时，比例最好要大于$8:2$。

动机是对某一件事情有兴趣，为了更清楚地弄明白这件事，不如把它写下来。这样不清楚的地方就要查资料，要不就是胡说了嘛。但由于是边学边写的，难免有不准确的地方。

观点和情绪的部分没什么好说的。知识的部分都遵循[知识共享协议 署名-非商业性使用-相同方式共享 4.0 国际 (CC BY-NC-SA 4.0)](https://creativecommons.org/licenses/by-nc-sa/4.0/deed.zh)。

## 怎么建站的

[Hexo](https://hexo.io/zh-cn/) 是一个博客框架，可以把 Markdown 文档转换成静态的网页。

[NexT](https://theme-next.js.org/) 是一套可以在 Hexo 框架里使用的主题配置，作用相当于CSS。

[Github Pages](https://pages.github.com/) 是 Github 提供的、用于托管静态网页的服务。只需上传静态网页，就可以通过`username.github.io`访问。也可以绑定购买的域名。

参考：

- [Github Pages 使用入门](https://docs.github.com/zh/pages/getting-started-with-github-pages)

- [Hexo 文档](https://hexo.io/zh-cn/docs/)

- [Hexo-NexT 文档](https://hexo-next.readthedocs.io/zh_CN/latest/)

- [Hexo 博客 NexT 主题的安装使用](http://home.ustc.edu.cn/~liujunyan/blog/hexo-next-theme-config/)

可以[查看这个站点的 Github 仓库](https://github.com/ruofancooh/blog)。
