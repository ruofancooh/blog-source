---
title: Java - 04 - 字符串问答
date: 2023-09-20 22:22:00
categories: Java
---

一些问题与回答

<!--more-->

## 怎么判断两个字符串内容是否相等？

用 `String.equals()`。

`==` 运算符比较的是两对象的内存地址。

```java
public class Test {
    public static void main(String[] args) {
        String str0 = "123";
        String str1 = "123";
        String str2 = new String("123");
        System.out.println(str0 == str1);// true
        System.out.println(str1 == str2);// false
        System.out.println(str0.equals(str1) && str1.equals(str2));// true
    }
}
```
