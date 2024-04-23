---
title: Python
date: 2024-04-23 20:24:00
categories: 问题
permalink: python.html
---

虽然 Python 基础也不牢，但这门语言相对于其他语言是写得最多的，其他语言基本没写过。

<!--more-->

## 使用装饰器输出函数名和本地时间

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
