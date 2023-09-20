---
title: Java - 02 - 数组问答
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

注意在定义时，`[]` 里不能加数字。

使用 `new` 时则必须加。

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

## 怎么打印数组？

除了 `for` 循环之外：

### `for-each` 循环

```java
for (int element : arr) {
    System.out.print(element + ",");
}
```

### Arrays.toString()

需要 `import java.util.Arrays;`

```java
System.out.println(Arrays.toString(arr));
```

## 怎么复制数组？

```java
int[] arr1 = { 1, 2, 3 };
int[] arr2 = new int[3];
System.arraycopy(arr1, 0, arr2, 0, arr1.length);
```

`System.arraycopy()` 五个参数分别为：源数组、源数组的起始位置、目标数组、目标数组的起始位置、要复制的元素数量。

## 怎么根据值查找数组中某元素的索引？

二分查找（返回的不一定是第一个）：

```java
int[] arr = { 1, 3, 2, 1, 2, 3 };
int index = Arrays.binarySearch(arr, 3);
System.out.println(index);// 5
```

如果用于 String 数组，是有风险的。因为

```java
int java.util.Arrays.binarySearch(Object[] a, Object key)
```

这个方法调用了

```java
int java.util.Arrays.binarySearch0(Object[] a, int fromIndex, int toIndex, Object key)
```

这个方法中使用的不是 `java.lang.String.equals()`，而是 `java.util.Calendar.compareTo()`。后者不能用于判断字符串的内容是否相等。
