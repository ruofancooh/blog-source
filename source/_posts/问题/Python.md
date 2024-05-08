---
title: Python
date: 2024-04-23 20:24:00
categories: 问题
permalink: python.html
---

虽然 Python 基础也不牢，但这门语言相对于其他语言是写得最多的，其他语言基本没写过。

<!--more-->

## 输出函数名和本地时间

使用装饰器：

```py
import datetime


def log(func):
    def wrapper(*args, **kwargs):
        print(f"{func.__name__}，系统时间：{datetime.datetime.now()}")
        return func(*args, **kwargs)

    return wrapper


@log
def test(): ...

test()
```

上面是一种很笨的方法，我们可以用其自带的 logging 模块记录日志到文件：

```py
import datetime
import logging

logging.basicConfig(
    filename=f"{datetime.date.today()}.log",
    filemode="w",
    encoding="utf-8",
    level=logging.INFO,
    format="%(asctime)s - %(levelname)s - %(message)s",
)
logging.info(...)
logging.warning(...)
logging.error(...)
```

你只要写一个稍微像样的项目，都不可能不用模块/库，不拆分文件。这只能说明笔者代码写得实在太少了。

## 报菜名

Python 的标准库有上百个。https://docs.python.org/zh-cn/3/tutorial/whatnow.html

用 `import` 还是 `from ... import ...`，后面加不加 `as` ，以易读为主。因为代码是给人看的。

虽然 Python 的一个变量名可以赋多个类型，但在有必要的情况下，还是加上类型注解。这对 VSCode 的代码补全也有帮助：把鼠标移到一个变量名上边，如果你想要它是某一个类的对象，但是它显示为 `Any`，这时候你在它后面加 `.`，VSCode 没法给你列出它的方法。这时候你需要显式标注它的类型，比如 `foo: Bar`。或者 `assert isinstance(foo, Bar)`

不要使用 `from xxx import *`，可能会出现同名的东西。

`import` 语句的顺序是：标准库、第三方库、自定义库。可通过 VSCode 插件 isort 解决，按 Ctrl + Shift + O 排序。

在你的工程目录下面，使用 https://github.com/bndr/pipreqs 可以把你用到的所有第三方库写到依赖文件 `requirements.txt` 里：

```sh
pipreqs --encoding "utf-8" --force ./
```

如果你有多个环境，可能会出现写了两个版本不同的，需手动排除。

列出已安装包：

```sh
conda list
conda list numpy
pip list
pip show numpy
```

下面开始 python 报菜名时间，这是笔者尝试用过的标准库（只用过一次，什么东西都没写出来，也算用过）：

```
abc
base64
collections
datetime
enum
json
logging
math
os
queue
random
re
shutil
string
subprocess
threading
time
tkinter
unittest
```

尝试用过的第三方库：

```
cv2
geopandas
matplotlib
numpy
pandas
ppadb
pyautogui
requests
scipy
seaborn
shapely
sklearn
yaml
```
