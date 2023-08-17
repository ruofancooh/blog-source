---
title: 关于
date: 2023-05-27 14:48:35
mathjax: true
---

[查看修改历史](https://github.com/ruofancooh/blog-source/commits/main)

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

- 【超我】的想法：【本我】没有学习动力，【自我】用写文章的形式激励【本我】学习。

- 【本我】的想法：【超我】想要学习，【自我】用写文章的形式满足【本我】的表达欲，把【满足表达欲所带来的成就感】映射成了【学习所带来的成就感】，实际上根本没学新知识。

- 现实的引力：

  - <p id="deadline" style="color:rgba(85,85,85,1)">你所热爱的，就是你的生活。</p>

<script>
const pLabel_deadline = document.getElementById("deadline");
const school_year = 2;

function updateColor() {
  let percentage = (24 - getMyAge()) / school_year;
  pLabel_deadline.style=`color:rgba(85,85,85,${percentage*0.5});`;
}

updateColor();
</script>

## 为什么“转移阵地”

如果你是从 B 站过来的话：

简单地说，我会经常陷入“社恐”和“自负”的两个极端之中。而在打出这些文字时，我又陷入了“置身事外的理性”之中。

**为了克服社恐的一面，我会变得自负，并很难用温和的语气与你对话。而为了收敛自负的一面，我又会变回社恐。只有当我一个人在写字/打字时才能陷入理性之中。**

- 【自我】不擅长调节【本我】与【超我】之间的关系。

  - 在社交平台上：

    - 表面上有几千个粉丝，这对【本我】来说已经非常多了。
    - 但是有相当多的粉丝关注了 1000 个以上的 UP 主，这让【超我】开始怀疑【自我】的存在感和价值。
    - 我基本不发动态，无法通过别人来认知【自我】的存在感和价值。
    - 这仍然加强了【本我】自负的一面。

  - 在现实中：

    - 不敢去上体育课，然后挂科了。
    - 在有些时候，【本我】可以把自负的一面传递给【自我】，以克服“社恐”。但常常会控制不住，变成一个纯自负的人。
    - 体育课踢毽球，一学期过去后看不到进展的苗头。这打击了【超我】的自信。
    - 在三番五次没有进展之后，【本我】便开始偷懒，并把“社恐”的一面传递给【自我】，最后造成没去上课的事实。

- 我粉丝来源最大的一个视频是“游戏+其他 UP 主”的二创。我无法分辨观众对于

  $$\{视频本身,素材来源的\mathrm{UP}主,游戏,我本人的创意,我本人\}$$

  认同的比例。而且我已经不玩任何游戏，也没有关注那个 UP 主了。

- 我在现实中“开口说话”这个行为的经历和经验很少，但是还是想表达。

- **不能在获得认同感的同时满足表达欲**，反之亦然。

  我只有在转换到“置身事外的理性”时才能打出这些文字。**如果你在现实中面对面问我的感受，在“社恐”的情况下我甚至不敢看你的眼睛，而在自负的情况下我会非常暴躁。**

  在公众场合发出这些文字，看起来就和祥林嫂一样。

  但是我认为现在的这里不属于公众场合，既然你愿意进来，就说明你不是外人。我只在 B 站的关注自动回复里留下了通往这个页面的直达链接，在一篇专栏的末尾留下了间接链接，而且**不显示浏览量和没有评论区，没有在这个页面上互动的可能**。通过 Github 或搜索引擎来的概率更是微乎其微。

## 博客内容及分类

暂定：

| 分类名 | 内容                       |
| ------ | -------------------------- |
| 1.概念 | 以“介绍”、“厘清关系”为主。 |
| 2.教程 | 以“实用”、“行动指导”为主。 |
| 3.共鸣 | 以“观点”、“思想”为主。     |
| 4.探索 | 对新知识盲人摸象的记录。   |

实际上由于我认知的局限性，分类之间的界限会非常模糊。第一分类和第四分类里的内容可以出现在任一分类里，第二分类也可能属于第四分类。

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

如果你发现博客内容有误，或者想和我成为朋友：

QQ 号：$863^3-88811$

这只是为了防机器人，你可能有在点开“新朋友”后发现是机器人加好友的经历。

## 真·网络一线牵

一些我觉得很有价值、并间接推动了此博客诞生的站点：

- [哔哩哔哩](https://www.bilibili.com/)：但是我没有耐心看知识类视频（自负的一面不愿意看，社恐的一面不敢看），更喜欢从文字获取知识

- [知乎](https://www.zhihu.com/)：看不同人对同一问题的看法（如知）

- [阮一峰的博客](https://www.ruanyifeng.com/blog/)：科技爱好者周刊

- [老生常谈](https://laosheng.top/)：新时代的互联网知识图谱

- ~~[Bing](https://cn.bing.com)/Google/Wikipedia/ChatGPT 镜像网站、浏览器及翻译插件~~

- ......
