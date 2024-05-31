---
title: 关于
date: 2023-05-27 14:48:35
---

## 软件

[右键菜单管理](https://github.com/BluePointLilac/ContextMenuManager)

## Python

[本体](https://docs.python.org/zh-cn/3/tutorial/whatnow.html)
| [Anaconda](https://mirrors.tuna.tsinghua.edu.cn/help/anaconda/)
| [PyPI](https://pypi.org/)
| [pipreqs](https://github.com/bndr/pipreqs)


```sh
conda list
conda list numpy
pip list
pip show numpy
pipreqs --encoding "utf-8" --force ./
```

[flask](https://flask.palletsprojects.com)
| [geopandas](https://geopandas.org/en/stable/getting_started/introduction.html)
| [matplotlib](https://matplotlib.org/stable/users/index.html)
| [numpy](https://numpy.org/doc/stable/user/index.html)
| [opencv](https://docs.opencv.org/4.9.0/d6/d00/tutorial_py_root.html)
| [pandas](https://pandas.pydata.org/docs/user_guide/index.html)
| [ppadb](https://pypi.org/project/pure-python-adb/)
| [pyautogui](https://pyautogui.readthedocs.io)
| [pyecharts](https://05x-docs.pyecharts.org/#/zh-cn/prepare)
| [requests](https://requests.readthedocs.io/projects/cn/zh-cn/latest/)
| [scipy](https://docs.scipy.org/doc/scipy/tutorial/index.html#user-guide)
| [scrapy](https://docs.scrapy.org)
| [seaborn](https://seaborn.pydata.org/api.html)
| [selenium](https://www.selenium.dev/selenium/docs/api/py/api.html)
| [shapely](https://shapely.readthedocs.io/en/stable/manual.html)
| [sklearn](https://scikit-learn.org/stable/user_guide.html)

## 怎么把这个网站搞出来的

[Hexo](https://hexo.io/zh-cn/docs/) 是一个博客框架，它把带 [YAML Front matter](https://jekyllrb.com/docs/front-matter/) 的 [Markdown](https://markdown.com.cn/) 文件通过 [Node.js](https://nodejs.org) 和 [Pandoc](https://pandoc.org/) 渲染成静态的 html 文件。[NexT](https://theme-next.js.org/)是针对 Hexo 的主题，可以理解为 CSS。

[Github Pages](https://docs.github.com/zh/pages/getting-started-with-github-pages) 用于托管静态网页，就是放在上面就不能动了，没有数据库，更新页面要重新上传。创建一个名为 `yourusername.github.io` 的仓库，分支为 `gh-pages`。然后可以访问 `yourusername.github.io`。之后再创建的名为 `sample` 且分支为 `gh-pages` 的仓库，为 `yourusername.github.io/sample`。

[Dynadot](https://www.dynadot.com/) 是一个域名提供商，买一个域名。设置 DNS 为 Dynadot DNS。域名记录，A 记录指向 `185.199.109.153`，AAAA 记录指向 `2606:50c0:8001::153`。这两个是 Github Pages 的公共 IP，可以通过 ping `yourusername.github.io`。子域名 www 的 CNAME 记录指向 `yourusername.github.io`。对应仓库（根仓库）的根目录加一个 `CNAME` 文件，内容为购买的域名。仓库设置 -> pages -> Custom domain -> Enforce HTTPS。然后等 Github 检查 DNS，排队从 Let's Encrypt 获取 SSL 证书。

## 收藏了等于我会了

[分类页](/blog/categories)
| [归档页](/blog/archives)
| [笔记修改历史](https://github.com/ruofancooh/blog-source/commits/main)
| [汉典](https://www.zdic.net/)
| [JavaScript 艺术之旅](https://github.com/tanpero/JavaScript-Art-Tour)
| [老生常谈](https://Laosheng.top/)
| [涟波词集](https://kevinz.cn/lyricbook/?a=Kevinz)
| [Hexo-NexT 文档](https://hexo-next.readthedocs.io/zh_CN/latest/)
| [Hexo 博客 NexT 主题的安装使用](http://home.ustc.edu.cn/~liujunyan/blog/hexo-next-theme-config/)
| [MDN Web 文档](https://developer.mozilla.org/zh-CN/docs/MDN)
| [OI-Wiki](https://oi-wiki.org/)
| [阮一峰的博客](https://www.ruanyifeng.com/blog/)
| [SYMBL](https://symbl.cc/cn/)
| [VisuAlgo](https://visualgo.net/zh/)
| [小时百科](https://wuli.wiki/online/index.html)
| [写作只能塑造真实的自己](https://github.com/Macin20/why-we-write)
| [网道](https://wangdoc.com/)
| [永远森林](https://永远森林.com/)
| [语文](http://www.dzkbw.com/books/rjb/yuwen/xs1s_2016/)
| [主义主义](https://www.processon.com/view/link/6081a821e401fd45d70436af)
