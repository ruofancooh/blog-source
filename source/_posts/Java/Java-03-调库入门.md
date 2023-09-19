---
title: Java - 03 - 调库入门
date: 2023-09-18 19:55:00
categories: Java
---

- 如何在 VSCode 里调 jar 包
- FASTJSON2 库的下载和使用

<!--more-->

## 如何在 VSCode 里调 jar 包

1. `Ctrl + Shift + P`
2. 进入 `java:Configure Classpath`
3. 找到 `Referenced Libraries`
4. 点击 `Add`
5. 选择下载的 jar 包

## FASTJSON2

> `FASTJSON 2` 是一个性能极致并且简单易用的 Java JSON 库。—— alibaba/fastjson2

[Github 仓库](https://github.com/alibaba/fastjson2) | [下载地址](https://repo1.maven.org/maven2/com/alibaba/fastjson2/fastjson2/)

```java
import com.alibaba.fastjson2.*;

public class Test {
    public static void main(String[] args) {
        String objText = "{'a':1,'b':2}";
        JSONObject data0 = JSON.parseObject(objText);
        String arrText = "[5,4,3,1,2]";
        JSONArray data1 = JSON.parseArray(arrText);
        System.out.println(data0);
        System.out.println(data1);
    }
}
```

[怎么读写文本文件？](/blog/2023/Java-01-Q&A/#怎么读写文本文件)