---
title: Java - 04 - 类与对象问答
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
        String str1 = "123";// str1 和 str2 共用一个内存地址，在字符串常量池内是同一个对象
        String str2 = new String("123");
        System.out.println(str0 == str1);// true
        System.out.println(str1 == str2);// false
        System.out.println(str0.equals(str1) && str1.equals(str2));// true
    }
}
```

可用 `System.identityHashCode()` 获取对象的标识哈希码，这是基于对象的内存地址计算的。

`boolean java.lang.String.equals(Object anObject)`的源码：

```java
@Stable
// String 类的成员，用于存放字符串的各个字符
private final byte[] value;

//...

public boolean equals(Object anObject) {
    if (this == anObject) {
        return true;// 可以看到这个方法也是先直接用 `==` 判断的
    }
    return (anObject instanceof String aString)
            && (!COMPACT_STRINGS || this.coder == aString.coder)
            && StringLatin1.equals(value, aString.value);// 这里调用了另一个类的 equals() 方法
}
```

`boolean java.lang.StringLatin1.equals(byte[] value, byte[] other)` 的源码：

```java
// 内联候选方法
@IntrinsicCandidate
public static boolean equals(byte[] value, byte[] other) {
    if (value.length == other.length) {
        // 就是一个一个字符的比较
        for (int i = 0; i < value.length; i++) {
            if (value[i] != other[i]) {
                return false;
            }
        }
        return true;
    }
    return false;
}
```
