---
title: Java
date: 2023-09-04 21:31:47
categories: 实用系列
permalink: java.html
---

笔者已经被知识诅咒，所以删了很多没有用的话。

<!--more-->

## 开始

1. https://dlcdn.apache.org/maven/
2. https://developer.aliyun.com/mvn/guide
3. 配置 Maven
4. VSCode `Extension Pack for Java` 扩展，设置 JDK 路径，Maven 路径。
5. 类名要与文件名相同
6. https://code.visualstudio.com/docs/java/java-debugging
7. https://mvnrepository.com/

```sh
java -jar myapp.jar
```

```xml
  <properties>
      <maven.compiler.source>1.8</maven.compiler.source>
      <maven.compiler.target>1.8</maven.compiler.target>
      <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
  </properties>


  <build>
    <plugins>

      <plugin>
        <groupId>org.apache.maven.plugins</groupId>
        <artifactId>maven-jar-plugin</artifactId>
        <version>3.2.0</version>
        <configuration>
          <archive>
            <manifest>
              <mainClass>com.example.App</mainClass>
            </manifest>
          </archive>
        </configuration>
      </plugin>

      <plugin>
        <groupId>org.apache.maven.plugins</groupId>
        <artifactId>maven-compiler-plugin</artifactId>
        <version>3.8.1</version>
        <configuration>
          <source>1.8</source>
          <target>1.8</target>
        </configuration>
      </plugin>

      <plugin>
        <groupId>org.apache.maven.plugins</groupId>
        <artifactId>maven-assembly-plugin</artifactId>
        <version>3.3.0</version>
        <configuration>
          <archive>
            <manifest>
              <mainClass>com.example.MainClass</mainClass>
            </manifest>
          </archive>
          <descriptorRefs>
            <descriptorRef>jar-with-dependencies</descriptorRef>
          </descriptorRefs>
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
```

## VSCode 扩展

`@ext:vscjava.vscode-maven`：

```json
"maven.settingsFile": "D:\\ProgramData\\apache-maven-3.9.4\\conf\\settings.xml",
"maven.executable.path": "D:\\ProgramData\\apache-maven-3.9.4\\bin\\mvn.cmd",
"maven.executable.preferMavenWrapper": false,
"java.configuration.maven.globalSettings": "D:\\ProgramData\\apache-maven-3.9.4\\conf\\settings.xml"
```

## 特色

### 关键字

没有 `unsigned` 关键字

### 运算符

无符号右移 `>>>`，前面直接补零。

- C/C++/Java 在对整型变量右移 `>>` 时：
  - 正整数前面全补 `0`
  - 负整数前面全补 `1`
  - 无符号整数前面全补 `0`
  - 作用相当于除以 2

### 数据类型

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

### 语法

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

### 接口

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
