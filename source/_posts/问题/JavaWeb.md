---
title: JavaWeb
date: 2024-04-15 16:32:00
categories: 问题
permalink: java-web.html
---

> Web 是一种分布式的应用框架。基于 Web 的应用是典型的浏览器/服务器（B/S）架构。

——ISBN 9787302438090

> JSP 技术是以 Java 语言作为脚本语言的，JSP 网页为整个服务器端的 Java 库单元提供了一个接口来服务于 HTTP 的应用程序。

——菜鸟教程

<!--more-->

## 新建工程

据笔者测试，用 VSCode 和最新的 IDEA 社区版都没办法格式化 JSP 代码，或者是暂时没找到解决方法。

### 用 VSCode 或 IDEA

```bat
mvn archetype:generate "-DgroupId=com.example" "-DartifactId=demo" "-DarchetypeArtifactId=maven-archetype-webapp" "-DinteractiveMode=true"
```

VSCode 使用 Community Server Connectors 插件

IDEA 使用 Smart Tomcat 插件

### 用 Eclipse 2020-03 (4.15.0)

在首选项里设置 JDK 和 Tomcat 的路径。

New -> Dynamic Web Project

按 Ctrl + Shift + F 格式化代码——這個快捷鍵會和 Win10 的微軟拼音輸入法簡繁體切換功能衝突。解决方法除了再按一次，还可以右击你任务栏上的[中]，进输入法设置，把热键关了。

## 一个 JSP 文件的示例

```jsp
<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8" import="java.util.Date"%>
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title></title>
</head>
<body>
	<%
		Date now = new Date();
	%>
	<%=now%>
</body>
</html>
```

它在 html 的基础上扩展了一些标签。可以使用 Java 库。

## JSP 运行的原理

1. 客户向 Tomcat 服务器发送 HTTP 请求

你可以使用 Fiddler 来抓包。在 Eclipse 里按“播放键”之后，Eclipse 向 `localhost:8080` 发送了一个 GET 请求。

使用

```bat
netstat -ano | grep 8080
```

查与 8080 端口有关的进程号。再打开任务管理器的详细信息，查到进程为 `javaw.exe`。右击打开文件所在位置，在你 Eclipse 首选项里设置的 JDK 目录的 bin 目录里面。

使用

```bat
jcmd
```

查看 java 进程，为 `org.apache.catalina.startup.Bootstrap start`

2. Tomcat 启动一个线程，把 jsp 文件转换成 java 文件（Servlet）
3. 把 java 文件编译成 class 文件（字节码）
4. 客户
