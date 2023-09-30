---
title: JSON
date: 2023-05-26 18:21:43
categories: 无分类
permalink: UC/jn/
---

JSON（JavaScript Object Notation，JavaScript 对象表示法）是一种轻量级的数据交换格式，可以看成是字符串。

和 JavaScript 没什么关系，就像 JavaScript 和 Java 没什么关系一样。

<!--more-->

## JSON 字符串 与 JS 对象互转

```js
let jsonStr = "";
let jsObj = {
  a: 1,
  b: 2,
  c: 3,
};
// JS 对象转 JSON 字符串
jsonStr = JSON.stringify(jsObj);

// JSON 字符串转 JS 对象
jsObj = JSON.parse(jsonStr);
```

## JSON 字符串与 Python 字典互转

```python
import json

py_dic = {'a': 1, 'b': 2, 'c': 3}

# Python 字典转 JSON 字符串
json_str = json.dumps(py_dic)

# JSON 字符串转 Python 字典
py_dic = json.loads(json_str)
```
