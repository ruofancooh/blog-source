---
title: Hexo
date: 2023-08-27 20:38:00
categories: 实用系列
permalink: hexo.html
---

<!--more-->

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
  1. 把 `/blog/categories/` 里各个子文件夹里的文件复制到 `/blog/缩写分类名/`。
  2. 删除 `/blog/categories/` 里各个子文件夹。
  3. 删除 `/blog/archives/` 里的多余的年份文件夹。
  4. 修改**站点所有（可以跳转到 `/blog/categories/分类名/` 的）** `.html` 文件里的链接为 `/blog/缩写分类名/`。
- 在所有操作之前，且只用做一次的：
  - 修改所有已经写的 `.md` 文件里的站内链接

## bm.py

```py
import os
from urllib.parse import quote  # 转换汉字为 "%XX%YY%ZZ" 的 url 类型

from bs4 import BeautifulSoup


ROOT = r"D:\repo\blog"  # 站点的本地根目录
CATEGORIES = rf"{ROOT}\categories"  # 分类的目录
YEARS = (2023, 2024)  # 所有文章的年份

# 分类的全名和缩写名
FULL_NAMES = ("牢骚系列", "实用系列", "永远不看系列")
ABBR_NAMES = ("m", "p", "u")
# 生成替换字典
ABBR_DICT = dict(zip(FULL_NAMES, ABBR_NAMES))
ABBR_DICT1 = {quote(full_name): abbr_name for full_name, abbr_name in ABBR_DICT.items()}


def replace_link(html_file_path: str) -> None:
    """
    把 <a> 标签里 href 的 "categories/分类全名" 替换成 "分类缩写名"
    """
    with open(html_file_path, "r+", encoding="utf-8") as file:
        html_doc = file.read()
        soup = BeautifulSoup(html_doc, "html.parser")

        jump_links = soup.find_all("a")
        for a in jump_links:
            for full_name, abbr_name in ABBR_DICT1.items():
                target = f"categories/{full_name}"
                try:
                    if target in a["href"]:
                        a["href"] = a["href"].replace(target, abbr_name)
                        print(a["href"])
                except KeyError:
                    pass

        file.seek(0)
        file.write(str(soup))
        file.truncate()


def replace_all_link() -> None:
    """
    替换 ROOT 及其子目录下所有 html 文件里的链接
    """
    for root, dirs, files in os.walk(ROOT):
        for file in files:
            if file.endswith(".html") and file != "404.html":
                file = rf"{root}\{file}"
                replace_link(file)


def move_categories() -> None:
    """
    把 CATEGORIES/分类全名/ 里的文件移动（先复制再删除）到 CATEGORIES/分类缩写名/
    """
    for full_name, abbr_name in ABBR_DICT.items():
        src_folder = rf"{CATEGORIES}\{full_name}"
        dst_folder = rf"{ROOT}\{abbr_name}"
        os.chdir(src_folder)
        os.system(f"xcopy . {dst_folder} /s")
        os.chdir("..")
        os.system(f"rmdir /s /q {full_name}")


def del_redundant_files() -> None:
    """
    删除 ROOT/archives/ 下的年份文件夹
    """
    os.chdir(rf"{ROOT}\archives")
    for year in YEARS:
        os.system(f"rmdir /s /q {year}")


if __name__ == "__main__":
    move_categories()
    del_redundant_files()
    replace_all_link()
```

## bs.bat

```bat
cd /d d:\repo\blog-source
start http://localhost:4000/
call npx hexo s
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