---
title: 关于
date: 2023-05-27 14:48:35
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

## 博文

我没有学习动力，所以用写文章的形式激励自己。

由于是边学边写的，难免有不准确的地方。

## 博客

Powered by [Hexo](https://hexo.io/zh-cn/) & [NexT.Gemini](https://theme-next.js.org/).

参考[Hexo 文档](https://hexo.io/zh-cn/docs/)、[Hexo-NexT 文档](https://hexo-next.readthedocs.io/zh_CN/latest/)和[这篇文章](http://home.ustc.edu.cn/~liujunyan/blog/hexo-next-theme-config/)。

在 [Github](https://github.com/ruofancooh/blog) 上查看这个站点。
