---
title: Java - 01 - 一些问题与回答
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

## 怎么获取文件输入？
