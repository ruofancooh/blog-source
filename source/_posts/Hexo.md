---
title: Hexo
date: 2023-08-27 20:38:00
permalink: hexo.html
---

## 建站

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

## 如何在新设备上推送

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
```

用三个脚本生成网页：

### bm.py

```py
import os
import shutil
from pathlib import Path

from bs4 import BeautifulSoup

SITE_ROOT = Path(r"blog")
ARCHIVES_DIR = SITE_ROOT / "archives"
REPLACE_RULES = {
    f"/archives": "",
}

def update_links_in_html(html_path: Path):
    with html_path.open("r+", encoding="utf-8") as file:
        content = file.read()
        soup = BeautifulSoup(content, "html.parser")
        for a_tag in soup.find_all("a"):
            href = a_tag.get("href")
            if href:
                for old, new in REPLACE_RULES.items():
                    if old in href:
                        href = href.replace(old, new)
                a_tag["href"] = href
        file.seek(0)
        file.write(str(soup))
        file.truncate()

if __name__ == "__main__":
    shutil.move(ARCHIVES_DIR / "index.html", SITE_ROOT / "index.html")
    shutil.rmtree(ARCHIVES_DIR)
    for root, _, files in os.walk(SITE_ROOT):
        for filename in files:
            if filename.endswith(".html") and filename != "404.html":
               update_links_in_html(Path(root) / filename)
```

### bs.bat

```bat
cd /d d:\repo\blog-source
start http://localhost:54321/
call npx hexo s -p 54321
```

### bg.bat

```bat
:: 删除旧文件
cd /d d:\repo\blog
git rm -r *
:: 渲染新文件
cd ..\blog-source
call npx hexo g
:: 转移新文件
xcopy public ..\blog /s /e
call npx hexo clean
:: 二次处理文件
cd /d d:\scripts
call D:/ProgramData/anaconda3/Scripts/activate
call python bm.py
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
---
title: CN02 - 概述 - 体系结构
date: 2023-09-09 17:00:00
permalink: CN/02/
---

- OSI 七层协议：参考模型
- TCP/IP 四层协议：即 Internet protocol suite，实际用到的
- 五层协议：教学模型

<!--more-->

（正文）
```

`permalink:` 告诉框架就按这个链接渲染。没有这个字段时，就按站点配置文件里设置的渲染（年/月/日/文章名之类的）。

- 在每次渲染前，要设置文章的标题和 `permalink`。
- 在每次渲染后：
  1. 用 `/blog/archives/index.html` 覆盖 `/blog/index.html`
  2. 删除 `/blog/archives/` 文件夹

