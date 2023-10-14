---
title: JA02 - Maven环境配置
date: 2023-09-27 19:10:00
categories: Java
permalink: JA/02/
---

Maven（行家）是一个工具，用于构建和管理 Java 工程。

- 构建，就是把生菜做成熟菜。
- 管理，就是指出使用了哪些别人种的菜。

Windows 10 + VSCode 环境配置。

<!--more-->

## 下载 Maven

[下载地址](https://dlcdn.apache.org/maven/)

我下载的是 `apache-maven-3.9.4-bin.zip`

## 配置环境变量

- `MAVEN_HOME`：解压后的目录
- `Path`：`%MAVEN_HOME%\bin`

## 配置 `%MAVEN_HOME%\conf\settings.xml`

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

## 配置 VSCode 扩展

`@ext:vscjava.vscode-maven`：

```json
"maven.settingsFile": "D:\\ProgramData\\apache-maven-3.9.4\\conf\\settings.xml",
"maven.executable.path": "D:\\ProgramData\\apache-maven-3.9.4\\bin\\mvn.cmd",
"maven.executable.preferMavenWrapper": false,
"java.configuration.maven.globalSettings": "D:\\ProgramData\\apache-maven-3.9.4\\conf\\settings.xml"
```

MavenWrapper 先不用。

## 尝试创建一个项目

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

## demo 目录的结构

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

## 测试运行

VSCode 会执行命令：

```bat
d: && cd d:\school\demo && cmd /C "命令字符串"
```

```bat
D:\ProgramData\Java\jdk-17.0.8.101-hotspot\bin\java.exe^
    -XX:+ShowCodeDetailsInExceptionMessages^
    -cp D:\school\demo\target\classes com.example.App
```

## 测试调第三方库

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
