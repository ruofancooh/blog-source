---
title: Hexo
date: 2023-08-27 20:38:00
permalink: hexo.html
---

[Hexo](https://hexo.io/zh-cn/docs/) 是一个博客框架，它把带 [YAML Front matter](https://jekyllrb.com/docs/front-matter/) 的 [Markdown](https://markdown.com.cn/) 文件通过 [Node.js](https://nodejs.org) 和 [Pandoc](https://pandoc.org/) 渲染成静态的 html 文件。[NexT](https://theme-next.js.org/)是针对 Hexo 的主题，可以理解为 CSS。

<!--more-->

[Github Pages](https://docs.github.com/zh/pages/getting-started-with-github-pages) 用于托管静态网页，就是放在上面就不能动了，没有数据库，更新页面要重新上传。创建一个名为 `yourusername.github.io` 的仓库，分支为 `gh-pages`。然后可以访问 `yourusername.github.io`。之后再创建的名为 `sample` 且分支为 `gh-pages` 的仓库，为 `yourusername.github.io/sample`。

[Dynadot](https://www.dynadot.com/) 是一个域名提供商，买一个域名。设置 DNS 为 Dynadot DNS。域名记录，A 记录指向 `185.199.109.153`，AAAA 记录指向 `2606:50c0:8001::153`。这两个是 Github Pages 的公共 IP，可以通过 ping `yourusername.github.io`。子域名 www 的 CNAME 记录指向 `yourusername.github.io`。对应仓库（根仓库）的根目录加一个 `CNAME` 文件，内容为购买的域名。仓库设置 -> pages -> Custom domain -> Enforce HTTPS。然后等 Github 检查 DNS，排队从 Let's Encrypt 获取 SSL 证书。

你可以使用[Whois](https://www.whois.com/whois)来查询这些一键生成的页面背后的操作者是谁。在 Github 查看[笔记修改历史](https://github.com/ruofancooh/blog-source/commits/main)。

1. 写笔记的源文件，md格式
2. 用npx hexo g生成文件到public目录
3. 用python敷写目录里的系列文件，并用rsync把目录移动到另一个仓库
4. 用git推送仓库到Github

## 概念

网页：网页文件的后缀一般是.html，超文本标记语言。它是一个文本文件，超的地方在于，比如在两个<p></p>标签之间表示一个段落，我们可以给这个标签单独设置样式如字体字号，并和其他段落标签排版。我们也可以点一个按钮后删除一个段落。HTML有两个兄弟，CSS管样式和排版，JavaScript管人机交互和计算。

代码和环境：写代码就是人指挥电脑该如何做事，编程语言介于人话和机器话之间，首先保证人能看懂，还要一个翻译官把它翻译成机器能听懂，这个翻译官称为环境。JavaScript就是一种编程语言，它的环境可以是浏览器内核，也可以是Node.js。

浏览器：用浏览器打开网页就像用播放器打开视频，得先把网页从别人的服务器上下载到本地。当然自己也可以当自己的服务器，客户端和服务端占localhost的不同端口号。

Markdown：用标记符号给通常的文本做了扩展，如用##表示二级标题，用一个空行表示换行，这样撰写者可以不管排版只写内容。它和html都是文本文件，且写它比写html文件容易。它还可以内嵌html标签。

Hexo：把Markdown文件转码成html文件，并生成有特定目录结构的文件夹，这个文件夹称为网站。它是Node.js环境下的一个软件。

npm：Node.js环境的包管理器，即应用商店。用它来下载安装Hexo

git：

签名与身份验证：git push给远程仓库时，github会根据发送者提前提交的公钥来生成一个挑战，发送者用私钥对挑战进行签名并发回github，github再用公钥验证签名，如果通过，说明确实是这个用户。

## 操作

除了 Hexo 官网文档之外的操作：

1. 设置 npm 镜像源

```sh
npm get registry
npm config set registry https://registry.npmmirror.com/
```

2. 安装 Hexo 并初始化之后，安装本地预览服务器，先跑

```sh
npm install hexo-server
hexo server
```

## 在新设备上推仓库

安装 nodejs，pandoc，python，bs4，ssh，git

克隆笔记源：

```sh
git clone https://github.com/ruofancooh/blog-source.git
cd blog-source
npm install
```

用ssh生成一个公钥

```sh
ssh-keygen -t ed25519 -C "your_email@example.com"
cat ~/.ssh/id_ed25519.pub
```

把公钥添加到 GitHub Settings → SSH and GPG keys

改push的链接：

```sh
git remote set-url origin git@github.com:ruofancooh/blog.git
git config --global user.email "you@example.com"
git config --global user.name "Your Name"
```

推：

```sh
git add .
git commit -m "text"
git push
```

## 公钥和私钥

张三想给李四邮寄一个机密文件，不希望文件的内容被第三者看到。假设他们是之前从来没有见过面的，且只有邮寄这一条路可用于传递信息。于是张三把文件装在了一个盒子里，并上了自己的锁，把上锁后的盒子邮寄给了李四。这就可以保证盒子被截获后，文件依然保密。

问题来了，李四是没有张三那把锁的钥匙的，这意味着如果李四想看文件，还需要把张三把钥匙也邮寄过去。比如我们在网上发送一个带密码的压缩包给对方，如果对方想解压，还需要我们把密码也发送过去。我们应该如何保证密码本身不被截获。

李四想：问题是我打不开你上的锁，那么你可以上我的锁啊。我先把我的锁邮寄给你，你用我的锁把文件加密后邮寄过来，我再用我的钥匙把它打开。这样就可以保证钥匙不会在邮寄过程中泄露。

李四的那把锁叫公钥，锁的钥匙叫私钥。所有人想给李四邮寄文件时，都可以用李四的公钥把文件加密，但加密后的文件只有有私钥的人才能打开。

## NexT 主题

[渲染数学公式](https://theme-next.js.org/docs/third-party-services/math-equations)
| [Mermaid](https://theme-next.js.org/docs/tag-plugins/mermaid)
| [随机背景](https://theme-next.js.org/docs/advanced-settings/custom-files)

```css
body {
    background-image: url("https://bing.img.run/rand.php");
    background-attachment: fixed;
    background-size: cover;
    background-position: center;
}
```

## md

```md
title: CN02 - 概述 - 体系结构
date: 2023-09-09 17:00:00
permalink: CN/02/
```

`permalink:` 告诉框架就按这个链接渲染。没有这个字段时，就按站点配置文件里设置的渲染（年/月/日/文章名之类的）。

- 在每次渲染前，要设置文章的标题和 `permalink`。
- 在每次渲染后：
  1. 用 `/blog/archives/index.html` 覆盖 `/blog/index.html`
  2. 删除 `/blog/archives/` 文件夹



