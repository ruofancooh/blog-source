---
title: Java
date: 2023-09-04 21:31:47
categories: 永远不看系列
permalink: java.html
---

Java 基础不牢。

[Maven 仓库](https://mvnrepository.com/)
| [阿里云 Maven 仓库](https://developer.aliyun.com/mvn/guide)
| [Spring Boot 文档](https://docs.spring.io/spring-boot/docs/)
| [Spring Boot 支持的 Java 版本](https://endoflife.date/spring-boot)

<!--more-->

## 关键字

没有 `unsigned` 关键字

## 运算符

无符号右移 `>>>`，前面直接补零。

- C/C++/Java 在对整型变量右移 `>>` 时：
  - 正整数前面全补 `0`
  - 负整数前面全补 `1`
  - 无符号整数前面全补 `0`
  - 作用相当于除以 2

## 数据类型

布尔 `boolean`，值为 `true` 或者 `false`。可以直接用，占一个字节。

- 写 `if(3 == true)` 时会报错，数据类型不同，不能直接比较。
- 在 C 的 `<stdbool.h>` 中被 `#define` 了为 `1` 和 `0`。
  - 写 `if(3 == true)` 时会跳过分支。
- C++ 同 C，但是不用引头文件，可以直接用。
- 在 Python 中是首字母大写的，也相当于 `0` 和 `1`，但是数据类型不同。
  - 写 `if(3 == True)` 时会按 `1` 比较。
  - 写 `if(3 is True)` 时会报错。
- 在 JS 中也相当于 `0` 和 `1`，但是数据类型不同。
  - 写 `if(1 == true)` 时会执行分支。
  - 写 `if(1 === true)` 时会跳过分支。

字符 `char`：无符号的两个字节。在 C/C++ 里是一个字节。

有符号整型

- `byte`：一个字节
- `short`：两个字节
- `int`：四个字节
- `long`：八个字节

## 语法

```java
Type[] arr = ...
for (Type element : arr) {
    System.out.print(element + ",");
}
Arrays.toString(arr);
System.arraycopy(...);
String.equals(string);
// == 运算符比较的是两对象的内存地址
// 该方法先用 == 判断，后一个一个字符地比较
// 可用 System.identityHashCode() 获取对象的标识哈希码，这是基于对象的内存地址计算的
int Arrays.binarySearch(arr, elm);
// 二分查找，返回的不一定是第一个。
```

## 接口

接口是一种特殊的类。写出来就是用来被继承的——不用 `extends`（扩展），用 `implements`（实现）。

```java
public interface USB {
    void start();
    void stop();
}
```

一个类只能 `extends` 自一个父类，但可以 `implements` 多个接口。

实现接口的子类必须得实现接口里声明的方法。
