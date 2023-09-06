---
title: JSON
date: 2023-05-26 18:21:43
---

JSON(JavaScript Object Notation，JavaScript 对象表示法)是一种轻量级的数据交换格式。

<!--more-->

## json 与 js 对象互转

```js
var json = "";
var obj = {
  a: 1,
  b: 2,
  c: 3,
};
// js对象转json字符串
json = JSON.stringify(obj);

// json字符串转js对象
obj = JSON.parse(json);
```

## 使用 Python 编解码 json

```python
import json

dic = {'a': 1, 'b': 2, 'c': 3}

# 编码
string = json.dumps(dic)

# 解码
dic = json.loads(string)
```
