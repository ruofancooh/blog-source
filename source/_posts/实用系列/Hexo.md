---
title: Hexo
date: 2023-08-27 20:38:00
categories: 实用系列
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
categories: 计算机网络
permalink: CN/02/
---

- OSI 七层协议：参考模型
- TCP/IP 四层协议：即 Internet protocol suite，实际用到的
- 五层协议：教学模型

<!--more-->

（正文）
```

`permalink:` 告诉框架就按这个链接渲染。没有这个字段时，就按站点配置文件里设置的渲染（年/月/日/文章名之类的）。

`categories:` 不会影响文章链接，只是在 `/blog/categories/` 里创了几个分类文件夹，每个分类文件夹里只有一个 `index.html` （这样可以达到链接不显示 `.html` 的效果）。

- 在 `/blog/categories/某分类/index.html` 里有一些属于此分类的文章链接。
- 而在 `/blog/categories/index.html` 里的链接都是指向 `/blog/categories/某分类/index.html` 的。

所以：

- 在每次渲染前，要设置文章的标题，分类和 `permalink`。
- 在每次渲染后：

  1. 把 `/blog/categories/` 里各个子文件夹里的文件复制到 `/blog/缩写分类名/`
  2. 删除 `/blog/categories/` 里各个子文件夹
  3. 用 `/blog/archives/index.html` 覆盖 `/blog/index.html`
  4. 删除 `/blog/archives/` 文件夹
  5. 修改**站点所有（可以跳转到 `/blog/categories/分类名/` 的）** `.html` 文件里的链接为 `/blog/缩写分类名/`

## bm.py

```py
import os
import shutil
from pathlib import Path
from urllib.parse import quote  # 转换汉字为 "%XX%YY%ZZ" 的 url 类型

from bs4 import BeautifulSoup

SITE_ROOT = Path(r"D:\repo\blog")
CATEGORIES_DIR = SITE_ROOT / "categories"
ARCHIVES_DIR = SITE_ROOT / "archives"
CATEGORY_MAP = {
    "牢骚系列": "m",
    "实用系列": "p",
    "永远不看系列": "u",
}
ABBREVIATED_MAP = {quote(full): abbrev for full, abbrev in CATEGORY_MAP.items()}
REPLACE_RULES = {
    f"/archives": "",
    **{
        f"categories/{full_name}": abbreviated
        for full_name, abbreviated in ABBREVIATED_MAP.items()
    },
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
    for full_name, abbrev in CATEGORY_MAP.items():
        src_folder = CATEGORIES_DIR / full_name
        dst_folder = SITE_ROOT / abbrev
        shutil.move(src_folder, dst_folder)
    shutil.move(ARCHIVES_DIR / "index.html", SITE_ROOT / "index.html")
    shutil.rmtree(ARCHIVES_DIR)
    for root, _, files in os.walk(SITE_ROOT):
        for filename in files:
            if filename.endswith(".html") and filename != "404.html":
                update_links_in_html(Path(root) / filename)
```

## bs.bat

```bat
cd /d d:\repo\blog-source
start http://localhost:54321/
call npx hexo s -p 54321
```

## bg.bat

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
