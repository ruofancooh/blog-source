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

## 问答

> jsp 指令与 jsp 动作？

前者是静态的，后者是动态的（感性认识）

前者类似

```jsp
<%@ include file = "sub.jsp" %>
```

后者类似

```jsp
<jsp:include page = "sub.jsp"/>
```

> 在一个 jsp 页里，如何把表单传递给另一个 jsp 页？另一个 jsp 页如何接收？

传递的两种方式：

（使用 get 方法会在 url 里看到请求参数，post 不会）

1.  `jsp:include` 配合 `jsp:param`。这是把另一个 jsp 页包含进来。

```jsp
	<form method="get">
		请输入圆的半径：
		<input type="text" name="radius" />
		<input type="submit" value="提交" />
	</form>
	<jsp:include page="computeAreaOfCircle.jsp">
		<jsp:param value="${param.radius}" name="radius" />
	</jsp:include>
```

2. `jsp:forward` 配合 `jsp:param`。这时处理表单的是本页面。这种把 JSP 标签和 Java 代码混在一起的写法很反人类：

```jsp
	<form method="post" action="">
		请选择一个图形：<br />
		<input type="radio" name="shape" id="circle" value="circle" />圆形<br />
		<input type="radio" name="shape" id="rectangle" value="rectangle" />矩形<br />
		<input type="submit" value="提交" />
	</form>
	<%
		Random random = new Random();
	String shape = request.getParameter("shape");
	if (shape != null) {
		if (shape.equals("circle")) {
			double radius = 100 * random.nextDouble();
	%>
	<jsp:forward page="process.jsp">
		<jsp:param value="<%=shape%>" name="shape" />
		<jsp:param value="<%=radius%>" name="radius" />
	</jsp:forward>
	<%
		} else if (shape.equals("rectangle")) {
		double width = 100 * random.nextDouble();
		double height = 100 * random.nextDouble();
	%>
	<jsp:forward page="process.jsp">
		<jsp:param value="<%=shape%>" name="shape" />
		<jsp:param value="<%=width%>" name="width" />
		<jsp:param value="<%=height%>" name="height" />
	</jsp:forward>
	<%
		}
	}
	%>
```

接收方用 `request.getParameter("name")` 接收

> eclipse 如何导入外部 jar 包？

比如我们用 JDBC 连接 MySQL 时，需要 `com.mysql.cj.jdbc.Driver`，

1. 先搞到这个 jar 包
2. 打开 eclipse 的首选项，在 File -> Properties（属性）

不止 eclipse，大部分的软件都有类似“首选项”的东西，相当于一个统一的设置。

3.  Java Build Path -> Libraries -> Add External Jars