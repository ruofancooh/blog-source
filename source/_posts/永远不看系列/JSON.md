---
title: JSON
date: 2023-05-26 18:21:43
categories: 永远不看系列
permalink: json.html
---

JSON（JavaScript Object Notation，JavaScript 对象表示法）是一种轻量级的数据交换格式，可以看成是字符串。和 JavaScript 没什么关系，就像 JavaScript 和 Java 没什么关系一样。从 Python 的角度来看，一个 JSON 文件是一系列列表和字典的嵌套。

<!--more-->

## JS

```js
jsonStr = JSON.stringify(jsObj);
jsObj = JSON.parse(jsonStr);
```

## Python

```python
import json
json_str = json.dumps(py_obj)
py_obj = json.loads(json_str)
```
