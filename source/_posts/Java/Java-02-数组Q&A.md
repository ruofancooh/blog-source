---
title: Java - 02 - 数组Q&A
date: 2023-09-13 19:55:00
categories: Java
---

一些问题与回答

<!--more-->

## Java 数组怎么定义？

```java
int arr1[];
int[] arr2;// 效果一样
```

注意在定义时，`[]`里不能加数字。

## 怎么向数组里加元素？

Array 不能动态加元素，ArrayList 可以。

对于 Array，可以先初始化，再赋值：

```java
int[] arr = new int[100];
int arrayLength = arr.length;
for (int i = 0; i < arrayLength; i++) {
    int randomNum = (int) (100 * Math.random());
    arr[i] = randomNum;
}
```

注意，如果用 `for-each` 循环是给数组元素赋不了值的。
