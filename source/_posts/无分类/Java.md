---
title: Java
date: 2023-09-04 21:31:47
categories: 无分类
permalink: java.html
---

- Windows 10 + VSCode 环境配置
- `Hello.java`

<!--more-->

## Windows 10 + VSCode 环境配置

1. VSCode 里安装 `Extension Pack for Java` 扩展。
   它会提示你下载安装 JDK。安。
2. 设置环境变量
   - `JAVA_HOME`：JDK 安装路径
   - `PATH`：`%JAVA_HOME%\bin`
3. 终端输入：
   ```sh
   java -version
   ```
   输出：
   ```txt
   openjdk version "17.0.8.1" 2023-08-24
   OpenJDK Runtime Environment Temurin-17.0.8.1+1 (build 17.0.8.1+1)
   OpenJDK 64-Bit Server VM Temurin-17.0.8.1+1 (build 17.0.8.1+1, mixed mode, sharing)
   ```
4. VSCode 设置搜`java.jdt.ls.java.home`，在`settings.json`里改成 JDK 安装路径。

安装的是 17，但是版本太高了（[Hadoop 支持的 Java 版本](https://cwiki.apache.org/confluence/display/HADOOP/Hadoop+Java+Versions)），Hadoop 跟不上。所以又安装了 8 的。

VSCode -> `Ctrl + Shift + P` -> Java: Install New JDK

```
openjdk version "1.8.0_382"
OpenJDK Runtime Environment (Temurin)(build 1.8.0_382-b05)
OpenJDK 64-Bit Server VM (Temurin)(build 25.382-b05, mixed mode)
```

然后改环境变量和配置文件。

## Hello.java

```java
public class Hello {
    public static void main(String[] args) {
        System.out.println("Hello");
    }
}
```

按钮运行，或者终端：

```sh
java Hello.java
```

或者终端：

```sh
javac Hello.java
java Hello
```

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
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;

public class Test {
    public static void main(String[] args) throws IOException {
        FileReader reader = new FileReader("text.txt");
        int ch;
        while ((ch = reader.read()) != -1){
            System.out.print((char) ch);
        }
        reader.close();
        FileWriter writer = new FileWriter("text.txt");
        writer.write("字符串");
        writer.close();
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

## 格式化输出

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

## Maven 配置

### 下载 Maven

[下载地址](https://dlcdn.apache.org/maven/)

我下载的是 `apache-maven-3.9.4-bin.zip`

### 配置环境变量

- `MAVEN_HOME`：解压后的目录
- `Path`：`%MAVEN_HOME%\bin`

### 配置 `%MAVEN_HOME%\conf\settings.xml`

- 本地仓库路径，存放下载的 jar 包：

  ```xml
  <localRepository>D:\ProgramData\maven-local-repo</localRepository>
  ```

- 镜像仓库源（[阿里云](https://developer.aliyun.com/mvn/guide)），从这里下载到本地：

  ```xml
  <mirror>
    <id>aliyunmaven</id>
    <mirrorOf>*</mirrorOf>
    <name>阿里云公共仓库</name>
    <url>https://maven.aliyun.com/repository/public</url>
  </mirror>
  ```

### 配置 VSCode 扩展

`@ext:vscjava.vscode-maven`：

```json
"maven.settingsFile": "D:\\ProgramData\\apache-maven-3.9.4\\conf\\settings.xml",
"maven.executable.path": "D:\\ProgramData\\apache-maven-3.9.4\\bin\\mvn.cmd",
"maven.executable.preferMavenWrapper": false,
"java.configuration.maven.globalSettings": "D:\\ProgramData\\apache-maven-3.9.4\\conf\\settings.xml"
```

MavenWrapper 先不用。

### 尝试创建一个项目

1. 在 VSCode 的资源管理器空白处右键 -> 从 Maven 原型创建新项目。

2. 选择 `maven-archetype-quickstart`。（archetype：原型）

3. 选择示例项目版本（当前最新是 1.4）。

4. 输入项目的 `groupId`，类似包名。比如 `com.example`。

5. 输入项目的 `artfactId`（artfact：人工制品），就是项目名。比如 `demo`。

6. 选择项目的父文件夹，Maven 会在这个文件夹里建一个与 `artfactId` 同名的文件夹，用于保存工程文件。

7. ▶️

VSCode 会开始执行命令：

```bat
"%MAVEN_HOME%\bin\mvn.cmd"^
    org.apache.maven.plugins:maven-archetype-plugin:3.1.2:generate^
        -DarchetypeArtifactId="maven-archetype-quickstart"^
        -DarchetypeGroupId="org.apache.maven.archetypes"^
        -DarchetypeVersion="1.4"^
        -DgroupId="com.example"^
        -DartifactId="demo"^
        -s "%MAVEN_HOME%\conf\settings.xml"
```

Maven 会开始下载一些文件，保存到 `localRepository`。

下载完之后：

```txt
[INFO] Using property: groupId = com.example
[INFO] Using property: artifactId = demo
Define value for property 'version' 1.0-SNAPSHOT: :
```

让你输入一个版本号。直接回车：

```txt
[INFO] Using property: package = com.example
Confirm properties configuration:
groupId: com.example
artifactId: demo
version: 1.0-SNAPSHOT
package: com.example
 Y: :
```

让你确认。回车。会输出 `BUILD SUCCESS` 和所用时间。

### demo 目录的结构

- src
  - main\\java\\com\\example\\App.java
  - test\\java\\com\\example\\AppTest.java
- target
  - classes\\com\\example\\App.class
  - test-classes\\com\\example\\AppTest.class
- pom.xml

在 `AppTest.java` 里导入了 `junit`：

```java
package com.example;

import static org.junit.Assert.assertTrue;

import org.junit.Test;

//...
```

查看 `pom.xml`：

```xml
<!-- ... -->
<dependencies>
  <dependency>
    <groupId>junit</groupId>
    <artifactId>junit</artifactId>
    <version>4.11</version>
    <scope>test</scope>
  </dependency>
</dependencies>
<!-- ... -->
```

### 测试运行

VSCode 会执行命令：

```bat
d: && cd d:\school\demo && cmd /C "命令字符串"
```

```bat
D:\ProgramData\Java\jdk-17.0.8.101-hotspot\bin\java.exe^
    -XX:+ShowCodeDetailsInExceptionMessages^
    -cp D:\school\demo\target\classes com.example.App
```

### 测试调第三方库

[fastjson2](https://github.com/alibaba/fastjson2)

1. 在 `pom.xml` 里的一对 `<dependencies>` 标签之间增加：

   ```xml
   <dependency>
     <groupId>com.alibaba.fastjson2</groupId>
     <artifactId>fastjson2</artifactId>
     <version>2.0.40</version>
   </dependency>
   ```

   然后：

   ```bat
   mvn install
   ```

   Maven 会下载依赖到本地。

2. 修改 `App.java`：

   ```java
   package com.example;

   import com.alibaba.fastjson2.*;

   public class App {
       public static void main(String[] args) {
           JSONArray a = JSON.parseArray("[1,2,3]");
           System.out.println(a);
       }
   }
   ```

3. 适当修改`pom.xml`里的 JDK 版本。

4. ▶️

### pom.xml 示例

主要保证汉字编码是 UTF-8，还有把依赖和自己写的打包成了同一个 jar。

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <groupId>task.hrf</groupId>
    <artifactId>javatask</artifactId>
    <version>1.0-SNAPSHOT</version>

    <properties>
        <maven.compiler.source>1.8</maven.compiler.source>
        <maven.compiler.target>1.8</maven.compiler.target>
        <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
        <project.reporting.outputEncoding>UTF-8</project.reporting.outputEncoding>
    </properties>

    <dependencies>
        <dependency>
            <groupId>com.alibaba.fastjson2</groupId>
            <artifactId>fastjson2</artifactId>
            <version>2.0.40</version>
        </dependency>
        <dependency>
            <groupId>org.junit.jupiter</groupId>
            <artifactId>junit-jupiter</artifactId>
            <version>5.10.0</version>
            <scope>test</scope>
        </dependency>
    </dependencies>

    <build>
        <plugins>
            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-compiler-plugin</artifactId>
                <version>3.11.0</version>
                <configuration>
                    <source>1.8</source>
                    <target>1.8</target>
                    <encoding>UTF-8</encoding>
                </configuration>
            </plugin>
            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-jar-plugin</artifactId>
                <version>3.3.0</version>
                <configuration>
                    <archive>
                        <manifest>
                            <addClasspath>true</addClasspath>
                            <classpathPrefix>lib/</classpathPrefix>
                            <mainClass>task.hrf.Main</mainClass>
                        </manifest>
                    </archive>
                </configuration>
            </plugin>

            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-assembly-plugin</artifactId>
                <version>3.3.0</version>
                <configuration>
                    <descriptorRefs>
                        <descriptorRef>jar-with-dependencies</descriptorRef>
                    </descriptorRefs>
                    <archive>
                        <manifest>
                            <mainClass>task.hrf.Main</mainClass>
                        </manifest>
                    </archive>
                </configuration>
                <executions>
                    <execution>
                        <id>make-assembly</id>
                        <phase>package</phase>
                        <goals>
                            <goal>single</goal>
                        </goals>
                    </execution>
                </executions>
            </plugin>
        </plugins>
    </build>
</project>
```

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
