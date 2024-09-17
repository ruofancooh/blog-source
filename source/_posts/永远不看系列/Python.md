---
title: Python
date: 2024-04-23 20:24:00
categories: 永远不看系列
permalink: python.html
mathjax: true
---

Python 基础不牢。

<!--more-->

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

## matplotlib.pyplot 与 seaborn

条形图和柱形图的区别是：前者是横着的，后者是竖着的。前者用 `plt.barh`，后者用 `plt.bar`

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

### 鸢尾花数据集绘图示例

```py
from pprint import pprint

import matplotlib.pyplot as plt
import pandas as pd
import seaborn as sns
from pandas.plotting import parallel_coordinates
from sklearn.datasets import load_iris

plt.rcParams["font.family"] = "SimHei"

iris = load_iris()
iris_df = pd.DataFrame(iris.data, columns=iris.feature_names)
iris_df["species"] = iris.target_names[iris.target]
pprint(iris_df)

# 柱形图
# iris_df.hist(bins=10)
# iris_df.hist(bins=20)
# plt.show()


# 饼图
# v = iris_df["species"].value_counts()
# pprint(v)
# v.plot.pie(explode=[0.1, 0.1, 0.1], autopct="%1.1f", shadow=True, figsize=(10, 10))
# plt.show()


# 箱线图
# iris_df.boxplot(by="species", figsize=(12, 12))
# plt.show()


# 平行坐标系图
# eordered_df = iris_df[
#     [
#         "sepal width (cm)",  # 花萼
#         "sepal length (cm)",
#         "petal length (cm)",  # 花瓣
#         "petal width (cm)",
#         "species",
#     ]
# ]
# parallel_coordinates(eordered_df, "species", color=("red", "green", "blue"))
# plt.show()


# 散布图矩阵
# sns.pairplot(iris_df, kind="scatter", hue="species")
# plt.show()


# 箱线图
# setosa = iris_df[iris_df["species"] == "setosa"]
# virginica = iris_df[iris_df["species"] == "virginica"]
# versicolor = iris_df[iris_df["species"] == "versicolor"]
# fig, axes = plt.subplots(1, 3, figsize=(15, 5))
# x_labels = ["花萼长", "花萼宽", "花瓣长", "花瓣宽"]
# sns.boxplot(data=setosa, ax=axes[0])
# axes[0].set_title("Setosa")
# axes[0].set_ylabel("值（cm）")
# axes[0].set_xticklabels(x_labels)
# sns.boxplot(data=virginica, ax=axes[1])
# axes[1].set_title("Virginica")
# axes[1].set_ylabel("值（cm）")
# axes[1].set_xticklabels(x_labels)
# sns.boxplot(data=versicolor, ax=axes[2])
# axes[2].set_title("Versicolor")
# axes[2].set_ylabel("值（cm）")
# axes[2].set_xticklabels(x_labels)
# plt.tight_layout()
# plt.show()
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

## sklearn

### preprocessing.伸缩器

```py
from sklearn import preprocessing
import numpy as np

# 数据预处理-标准化

# train 待训练的
X_train = [[-3, 6, 7, 8], [11, 23, -9, 1], [0, 9, -77, 0]]

# 拟合（fit）
# 用 preprocessing.StandardScaler().fit(X) 拟合X每列的均值和标准差（数据集X的尺度）
# 返回一个伸缩器
scaler = preprocessing.StandardScaler().fit(X_train)
print(f"{X_train}的均值：{scaler.mean_}")
print(f"{X_train}的标准差：{scaler.scale_}")

X = [[1, 2, 3, 4]]
scaler = preprocessing.StandardScaler().fit(X)
print(f"{X}的均值：{scaler.mean_}")  # [1,2,3,4]
print(f"{X}的标准差：{scaler.scale_}")  # [1,1,1,1]

print("=====================")

# 用 preprocessing.StandardScaler().fit(X).transform(Y) 把数据集Y 按列axis=0 按 X 拟合出的均值和标准差标准化
# scaler.transform(X) 把数据集X 按列axis=0 按 scaler 所指定的均值和标准差标准化
# 这里用 X_train 所拟合出的 scaler 作用到自身
X_train = [[-3, 6, 7, 8], [11, 23, -9, 1], [0, 9, -77, 0]]
scaler = preprocessing.StandardScaler().fit(X_train)
X_scaled = scaler.transform(X_train)
print("用sclaer标准化之后的数据集", X_scaled)
print(f"每列的均值：{X_scaled.mean(axis=0)}")
print(f"每列的标准差：{X_scaled.std(axis=0)}")
# 该语句对每个同一列的元素 y 执行其对应位置的 scaler 所对应的 (y - mu)/sigma
Y = scaler.transform([[1, 1, 1, 1], [2, 2, 2, 2]])
print(Y)
a = (1 - scaler.mean_) / scaler.scale_
b = (2 - scaler.mean_) / scaler.scale_
c = np.array([a, b])
print(a)
print(b)
print(c == Y)

print("=====================")

# preprocessing.scale(X_train, axis=0)直接按列标准化到均值为零，标准差为一
# 等价于 preprocessing.StandardScaler().fit(X_train).transform(X_train)
X_train = [[-3, 6, 7, 8], [11, 23, -9, 1], [0, 9, -77, 0]]
X_scaled = preprocessing.scale(X_train, axis=0)
print("标准化之后的", X_scaled)
print(f"每列的均值：{X_scaled.mean(axis=0)}")
print(f"每列的标准差：{X_scaled.std(axis=0)}")

print("=====================")

# 最大最小缩放，把每一列按比例缩放到0和1之间，且必有0和1
X = np.array([[1, 6, 7, 4], [5, 2, 3, 8], [7, 7, 7, 7], [8, 8, 8, 8]])
min_max_scaler = preprocessing.MinMaxScaler()
X_scaled = min_max_scaler.fit_transform(X)
print(f"{X}\n缩放后\n{X_scaled}")

# 如果只有一行,全为0
# print(preprocessing.MinMaxScaler().fit_transform([[4, 2, 3, 4]]))

# 没有明白
# print(min_max_scaler.transform([[1, 1, 1, 1]]))

print("=====================")

# 归一化，把每行向量缩放到长度（L2范数）为1
X = [[1, 2, 3, 4], [5, 6, 7, 8]]
normalizer = preprocessing.Normalizer()
X_scaled = normalizer.fit_transform(X)
# 计算向量长度
norm = np.linalg.norm(X_scaled[0].T)
print(np.isclose(norm, 1))
norm = np.linalg.norm(X_scaled[1].T)
print(np.isclose(norm, 1))
```

### preprocessing.OneHotEncoder

```py
# 数据预处理-标称特征编码（one-hot编码）
from sklearn.preprocessing import OneHotEncoder
import numpy as np

X = [["a", "b", "c", "d"], ["a", "b", "e", "f"], ["h", "j", "k", "l"]]
# 每列一个属性，每个属性一种编码
encoder = OneHotEncoder()
encoder.fit(X)

print(encoder.categories_)

# X 每列相同的元素个数
each_col_count = []
for i in range(len(encoder.categories_)):
    count = len(encoder.categories_[i])
    each_col_count.append(count)
    print(f"属性{i}的取值范围整数个数:{count}")

Y = [["a", "j", "k", "f"]]
e = encoder.transform(Y).toarray()
print(f"编码后的{Y}：")
# 按 each_col_count 分隔列表
a = np.cumsum(each_col_count)[:-1]
new_lists = np.array_split(e[0], a)
for l in new_lists:
    l = l.astype(int).astype(str)
    print("".join(l))
a = np.insert(a, 0, 0)
print(f"特征开始位置的索引：{a}")
```

### impute.SimpleImputer

```py
# 缺失值插补
from sklearn.impute import SimpleImputer
import numpy as np

imputer = SimpleImputer(missing_values=-999, strategy="mean")
# 计算每列非空值的均值，指定-999为空值
X = np.array([[1, 2], [np.nan, 3], [7, 6]])
X[np.isnan(X)] = -999
imputer.fit(X)

# 把X每列非空值的均值填到Y对应列的空值上
Y = np.array([[np.nan, np.nan], [6, np.nan]])
Y[np.isnan(Y)] = -999
print(f"缺失值插值后：\n{imputer.transform(Y)}")
```

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
