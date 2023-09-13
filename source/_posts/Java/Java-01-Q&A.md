---
title: Java - 01 - Q&A
date: 2023-09-06 16:31:00
categories: Java
---

一些问题与回答

<!--more-->

## `main`函数不加`static`可以吗？

不行。程序启动时实例还没有被创建，需要通过类名调用静态方法。

## 当类名和文件名不一致时，代码检查器会提示修改。那么`.java`文件里只能写一个类吗？

只能写一个与文件名相同的公共类。其他的类不加`public`。

```java
class Test0 {
    public static void fun() {
        System.out.println("123");
    }
}

class Test1 {
    public void fun() {
        System.out.println("456");
    }
}

public class Test {
    public static void main(String[] args) {
        Test0.fun();
        Test1 test1 = new Test1();
        test1.fun();
    }
}
```

## 怎么获取键盘输入？

```java
import java.util.Scanner;//注意要加分号
public class Echo {
    public static void main(String[] args) {
        // 创建一个 String 对象
        String str;
        // 创建一个 Scanner 对象，传参是标准输入流对象
        Scanner scan = new Scanner(System.in);
        // 读取一行，返回String
        str = scan.nextLine();
        // println() 换行，print() 不换行
        System.out.print(str);
        System.out.println(str);
        System.out.print(str);
        System.out.println(str);
        // 别忘了关闭
        scan.close();
    }
}
```

## 怎么读写文本文件？

Java：

```java
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;

public class Test {
    public static void main(String[] args) throws IOException {
        String content = Files.readString(Path.of("input.txt"));
        System.out.println(content);
        Files.writeString(Path.of("output.txt"), "啊啊啊");
    }
}
```

对比 Python：

```py
input_file_name = "input.txt"
with open(input_file_name, "r", encoding="utf-8") as input_file:
    content = input_file.readlines()
    ...

output_file_name = "output.txt"
with open(output_file_name, "w", encoding="utf-8") as output_file:
    output_file.write("啊啊啊")
```

## 和 C/C++的运算符有什么不同？

先射箭后画靶：

- C/C++/Java 在对整型变量右移 `>>` 时：

  - 正整数前面全补 `0`
  - 负整数前面全补 `1`
  - 无符号整数前面全补 `0`（Java 没有无符号整数）
  - 作用相当于除以 2

- Java 多了一个无符号右移 `>>>`，不管你整型变量是正是负，前面都直接补零。

在 Java 中，没有`unsigned`关键字。

进一步：

## Java 中的基本数据类型？

### 布尔 `boolean`

值为 `true` 或者 `false`。可以直接用，占一个字节。

写 `if(3 == true)` 时会报错，数据类型不同，不能直接比较。

- 在 C 的 `<stdbool.h>` 中被 `#define` 了为 `1` 和 `0`。
  - 写 `if(3 == true)` 时会跳过分支。
- C++ 同 C，但是不用引头文件，可以直接用。
- 在 Python 中是首字母大写的，也相当于 `0` 和 `1`，但是数据类型不同。
  - 写 `if(3 == True)` 时会按 `1` 比较。
  - 写 `if(3 is True)` 时会报错。
- 在 JS 中也相当于 `0` 和 `1`，但是数据类型不同。
  - 写 `if(1 == true)` 时会执行分支。
  - 写 `if(1 === true)` 时会跳过分支。

### 字符 `char`

无符号的两个字节。在 C/C++ 里是一个字节。

### 整型（都是有符号的）

- `byte`：一个字节
- `short`：两个字节
- `int`：四个字节
- `long`：八个字节

### 浮点（都是有符号的）

和 C/C++ 一样。

- `float`：四个字节
- `double`：八个字节

## 茴字有几种写法？

Java 和 Python、JS 等一样，都可以在输出函数里直接写表达式（不用格式字符串的情况下）。以及 Java 也可以格式化输出。

```java
public class Test {
    public static void main(String[] args) {
        System.out.println('a' + 1);// 98
        System.out.println("a" + 1);// a1
        byte i = 3, j = 3;
        // 没人会这么写
        System.out.println(++i + i++);// 8
        System.out.println(j++ + ++j);// 8
        // Java 也有 printf()
        System.out.printf("%d, %d", i, j);// 5, 5
    }
}
```
