---
title: Python
date: 2024-04-23 20:24:00
categories: 实用系列
permalink: python.html
mathjax: true
---

Python 基础不牢。

[本体](https://docs.python.org/zh-cn/3/tutorial/whatnow.html)
| [Anaconda](https://mirrors.tuna.tsinghua.edu.cn/help/anaconda/)
| [PyPI](https://pypi.org/)
| [pipreqs](https://github.com/bndr/pipreqs)

<!--more-->

## Anaconda

不要把包都安到 base 环境里。

```sh
conda env export > environment.yml # 导出当前环境依赖
conda env create -f environment.yml # 重建环境
conda create -n xxx
conda env remove -n xxx
conda activate xxx
conda deactivate
conda list
conda list numpy
pip list
pip show numpy
```

## 报菜名

Python 的标准库有上百个。用 `import` 还是 `from ... import ...`，后面加不加 `as` ，以易读为主。因为代码是给人看的。

使用 `from xxx import *` 类似于：你在搭积木的时候，闭着眼睛把一整个塑料袋的积木全倒出来，然后闭着眼睛摸一个、闭着眼睛摸一个。

`import` 语句的顺序是：标准库、第三方库、自定义库。可通过 VSCode 插件 isort 解决，按 Ctrl + Shift + O 排序。

在你的工程目录下面，使用 https://github.com/bndr/pipreqs 可以把你用到的所有第三方库写到依赖文件 `requirements.txt` 里。

虽然 Python 的一个变量名可以赋多个类型，但在有必要的情况下，还是加上类型注解。这对 VSCode 的代码补全也有帮助：把鼠标移到一个变量名上边，如果你想要它是某一个类的对象，但是它显示为 `Any`，这时候你在它后面加 `.`，VSCode 没法给你列出它的方法。这时候你需要显式标注它的类型，比如 `foo: Bar`。或者 `assert isinstance(foo, Bar)`

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

日志有五个等级：DEBUG 调试诊断用的；INFO 确认正常运行；WARNING 是不影响正常运行的错误，如向数据库里插入一条已经存在的记录，然后忽略它；ERROR 是影响正常运行的错误，如数据库连接失败（但是你系统的其他功能可用）；CRITICAL 是你的系统的关键功能不可用（如果你的系统必须要用数据库）。

## plt

条形图和柱形图的区别是：前者是横着的，后者是竖着的。前者用 `plt.barh`，后者用 `plt.bar`

### 中文字体

```py
plt.rcParams["font.family"] = "SimHei"
```

### 最小二乘法多项式拟合

```py
import numpy as np
import matplotlib.pyplot as plt

x = np.array([48, 47, 54, 50, 73, 72, 62, 52, 47, 83, 70, 65, 48])
y = np.array([0.42, 0.38, 0.66, 0.5, 0.99, 0.98, 0.89,
             0.58, 0.38, 0.99, 0.98, 0.93, 0.42])

# polynomial 多项式 fit 拟合
# 第三个参数是多项式的次数，为大于等于零的整数
z = np.polyfit(x, y, 2)

# 这样一转换，可以以人可读的方式打印，可以在下面 call 它，把传参给 p 的数组转换为另一个数组
p = np.poly1d(z)

print(p)

# 左闭右开的等差数列
x2 = np.linspace(40, 100, 100)

# 画散点图
plt.scatter(x, y, color='red', label='Data Points')
# 画曲线
plt.plot(x2, p(x2), color='blue', label='Quadratic Curve')

# xy轴标签、图题
plt.xlabel('x')
plt.ylabel('y')
plt.title('Scatter plot with Quadratic Curve')
# 图例
plt.legend()
plt.show()
```

## scipy.stats.某种分布.

$$
\begin{aligned}
\mathrm{rvs(分布参数,size = 实验次数)} & = X\\
离散型 \mathrm{pmf}(分布参数,k = [x_1,x_2, ...]) &  = \mathrm{P}(X = x) \\
连续型 \mathrm{pdf}(分布参数,x = [x_1,x_2, ...]) & = f_{X}(x) \\
离散型 \mathrm{cdf}(分布参数,k = [x_1,x_2, ...]) & = F_{X}(x) = \mathrm{P}(X \le x) \\
连续型 \mathrm{cdf}(分布参数,x = [x_1,x_2, ...]) & = F_{X}(x) = \mathrm{P}(X \le x) \\
返回 \mathrm{numpy.ndarray}
\end{aligned}
$$

## selenium

```py
import json

from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.support.ui import WebDriverWait


class SeleniumSpider:

    def __init__(self):
        # 使用本地的火狐浏览器
        options = webdriver.FirefoxOptions()
        options.binary_location = (
            r"D:\Program Files\Firefox Developer Edition\firefox.exe"
        )
        self.driver = webdriver.Firefox(options)
        self.data: list[dict] = []  # 暂存爬取的数据

    def wait_and_click(self, xpath: str):
        """
        保证元素可以被点击，并点击
        """
        WebDriverWait(self.driver, 20).until(
            EC.all_of(
                EC.element_to_be_clickable((By.XPATH, xpath)),
                EC.visibility_of_element_located((By.XPATH, xpath)),
            )
        )
        el = self.driver.find_element(By.XPATH, xpath)
        print(xpath, el)
        try:
            el.click()
        except:
            webdriver.ActionChains(self.driver).move_to_element(el).click(el).perform()
        return el

    def save_to(self, file_name: str):
        """
        写一个json文件
        """
        try:
            with open(file_name, mode="w+", encoding="utf-8") as f:
                f.write(json.dumps(self.data, ensure_ascii=False, indent=2))
        except Exception as e:
            print(e)
```
