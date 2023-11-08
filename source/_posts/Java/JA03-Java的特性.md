---
title: JA03 - Java 的特性
date: 2023-11-8 19:10:00
categories: Java
permalink: JA/03/
---

接口、泛型

<!--more-->

## 接口

接口是一种特殊的类。

```java
public interface USB {
    void start();
    void stop();
}
```

写出来就是用来被继承的——不用 `extends`（扩展），用 `implements`（实现）。

一个类只能 `extends` 自一个父类，但可以 `implements` 多个接口。

实现接口的子类必须得实现接口里声明的方法。
