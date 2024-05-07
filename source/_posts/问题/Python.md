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

下面开始 python 报菜名时间，这是笔者尝试用过的库（只用过一次，什么东西都没写出来，也算用过）：

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

尝试用过的自带模块：

```
base64
datetime
enum
json
logging
queue
subprocess
threading
time
tkinter
unittest
```
