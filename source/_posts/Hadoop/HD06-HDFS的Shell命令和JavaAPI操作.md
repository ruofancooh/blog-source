---
title: HD06 - HDFS的Shell命令和JavaAPI操作
date: 2023-10-12 21:58:00
categories: Hadoop
permalink: HD/06/
---

r3.3.6

- [FileSystem Shell](https://hadoop.apache.org/docs/r3.3.6/hadoop-project-dist/hadoop-common/FileSystemShell.html)
- [FileSystem API](https://hadoop.apache.org/docs/r3.3.6/api/org/apache/hadoop/fs/FileSystem.html)
- [FileUtil API](https://hadoop.apache.org/docs/r3.3.6/api/org/apache/hadoop/fs/FileUtil.html)
- [FileStatus API](https://hadoop.apache.org/docs/r3.3.6/api/org/apache/hadoop/fs/FileStatus.html)

<!--more-->

## shell 命令

<iframe
  src="https://hadoop.apache.org/docs/r3.3.6/hadoop-project-dist/hadoop-common/FileSystemShell.html"
  width=100%
  height=500>
</iframe>

## JavaAPI 操作

注意分清三个文件系统：

- 虚拟机里的 HDFS
- 虚拟机操作系统的文件系统
- 物理机操作系统的文件系统

### 工程创建

1. VSCode -> 从 Maven 原型创建新项目 -> No Archetype
2. groupId 设为 `test.hrf.hd`，artifactId 设为 `hdtest`
3. pom.xml 里加：

   ```xml
    <dependencies>
        <dependency>
            <groupId>org.junit.jupiter</groupId>
            <artifactId>junit-jupiter</artifactId>
            <version>5.10.0</version>
            <scope>test</scope>
        </dependency>
        <dependency>
            <groupId>org.apache.logging.log4j</groupId>
            <artifactId>log4j-core</artifactId>
            <version>2.20.0</version>
        </dependency>
        <dependency>
            <groupId>org.apache.hadoop</groupId>
            <artifactId>hadoop-client</artifactId>
            <version>3.3.6</version>
        </dependency>
    </dependencies>
   ```

4. 适当修改 pom.xml 里的 `<maven.compiler.source>` 和 `<maven.compiler.target>` 的 JDK 版本。[Hadoop 支持的 Java 版本](https://cwiki.apache.org/confluence/display/HADOOP/Hadoop+Java+Versions)
5. `mvn install`
6. `src/main/resources` 里加 `log4j.properties` 配置文件：

   ```properties
   log4j.rootLogger=INFO, stdout
   log4j.appender.stdout=org.apache.log4j.ConsoleAppender
   log4j.appender.stdout.layout=org.apache.log4j.PatternLayout
   log4j.appender.stdout.layout.ConversionPattern=%d %p [%c] - %m%n
   log4j.appender.logfile=org.apache.log4j.FileAppender
   log4j.appender.logfile.File=target/spring.log
   log4j.appender.logfile.layout=org.apache.log4j.PatternLayout
   log4j.appender.logfile.layout.ConversionPattern=%d %p [%c] - %m%n
   ```

7. 在 `src/test/java` 下建 `HdfsClient.java`

### 在物理机上编程测试，连接虚拟机（Windows 文件系统 -> HDFS）

或许在物理机上测试需要 [winutils](https://github.com/cdarlint/winutils)，这个作者还没有编译 3.3.6 版本的。每一次测试，调试控制台都会报缺 winutils：

```txt
WARN [org.apache.hadoop.util.Shell] - Did not find winutils.exe: {}
java.io.FileNotFoundException: java.io.FileNotFoundException: HADOOP_HOME and hadoop.home.dir are unset. -see https://wiki.apache.org/hadoop/WindowsProblems
WARN [org.apache.hadoop.util.NativeCodeLoader] - Unable to load native-hadoop library for your platform... using builtin-java classes where applicable
```

关于下载文件：

- 用 `FileSystem.copyToLocalFile(Path src, Path dst)` 向物理机复制文件为空。（测试结果报错）
- 用 `FileUtil.copy(FileSystem srcFS, Path src, File dst, boolean deleteSource, Configuration conf)` 就可以向物理机复制文件。（测试结果不报错，调试控制台还是报缺的）

关于上传文件：

- 用 `FileUtil.copy(File src, FileSystem dstFS, Path dst, boolean deleteSource, Configuration conf)` 和 `FileSystem.copyFromLocalFile(boolean delSrc, boolean overwrite, Path src, Path dst)` 均可。

```java
import java.io.File;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.net.URI;
import java.net.URISyntaxException;

import org.apache.hadoop.conf.Configuration;
import org.apache.hadoop.fs.FSDataInputStream;
import org.apache.hadoop.fs.FSDataOutputStream;
import org.apache.hadoop.fs.FileStatus;
import org.apache.hadoop.fs.FileSystem;
import org.apache.hadoop.fs.FileUtil;
import org.apache.hadoop.fs.Path;
import org.apache.hadoop.io.IOUtils;
import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestInstance;
import org.junit.jupiter.api.TestInstance.Lifecycle;

@TestInstance(Lifecycle.PER_CLASS)
public class HdfsClient {

    Configuration conf = new Configuration();
    FileSystem fs = null;

    @BeforeAll
    public void connect() throws IOException, URISyntaxException, InterruptedException {
        fs = FileSystem.get(new URI("hdfs://ubuntu101:9820"), conf, "rc");
    }

    @AfterAll
    public void close() throws IOException {
        fs.close();
    }

    @Test
    public void testPrint() {
        System.out.println("1234567");
    }

    @Test
    public void testMkdir() throws IllegalArgumentException, IOException {
        fs.mkdirs(new Path("/test/path"));
    }

    @Test
    public void testMkfile() throws IllegalArgumentException, IOException {
        Path filePath = new Path("/test/1.txt");
        FSDataOutputStream outputStream = fs.create(filePath);
        outputStream.writeUTF("你好abc\n");
        outputStream.close();
    }

    @Test
    public void testReadFile() throws UnsupportedOperationException, IOException {
        Path filePath = new Path("/test/1.txt");
        FSDataInputStream inputStream = fs.open(filePath);
        IOUtils.copyBytes(inputStream, System.out, 4096, false);
        inputStream.close();
    }

    @Test
    public void testDeleteFile() throws IOException {
        Path filePath = new Path("/test");
        fs.delete(filePath, true);
    }

    @Test
    public void testUploadFile() throws IOException {
        Path src = new Path("D:\\school\\hadoop\\琵琶行.txt");
        Path dst = new Path("/test/");
        fs.copyFromLocalFile(false, true, src, dst);
    }

    @Test
    public void testUploadFile1() throws IOException {
        File src = new File("D:\\school\\hadoop\\琵琶不行.txt");
        Path dst = new Path("/test/");
        FileUtil.copy(src, fs, dst, false, conf);
    }

    // 这些方法中，只有它一个测试失败
    @Test
    public void testDownloadFile() throws IOException {
        Path src = new Path("/琵琶行.txt");
        Path dst = new Path("D:\\school\\hadoop\\琵琶行1.txt");
        fs.copyToLocalFile(src, dst);// 这里下载文件为空。且测试结果报错，不报缺 winutils，其他和调试控制台一样
    }

    @Test
    public void testDownloadFile1() throws IOException {
        Path src = new Path("/琵琶行.txt");
        File dst = new File("D:\\school\\hadoop\\琵琶行1.txt");
        FileUtil.copy(fs, src, dst, false, conf);// 这里可以下载文件
    }

    // 列出指定目录下的文件和子目录信息，不深入子目录
    @Test
    public void testListStatus() throws FileNotFoundException, IOException {
        Path path = new Path("/");
        FileStatus[] fileStatuses = fs.listStatus(path);
        for (FileStatus fileStatus : fileStatuses) {
            System.out.println(fileStatus);
        }
    }

    @Test
    public void testCopyFileBetweenHDFS() throws IOException {
        Path src = new Path("/琵琶行.txt");
        Path dst = new Path("/test/琵琶可行.txt");
        FileUtil.copy(fs, src, fs, dst, false, false, conf);
    }

    @Test
    public void testRename() throws IOException {
        Path src = new Path("/test/琵琶可行.txt");
        Path dst = new Path("/test/琵琶不可行.txt");
        fs.rename(src, dst);
    }
}
```

### 在物理机上编程打包，传到虚拟机上执行（ubuntu 文件系统 <-> HDFS）

都能执行成功。就是把上面的注解去了，文件路径改了，然后加了一个 Main.java。

`HdfsClient.java`：

```java
package test.hrf.hd;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.net.URI;
import java.net.URISyntaxException;

import org.apache.hadoop.conf.Configuration;
import org.apache.hadoop.fs.FSDataInputStream;
import org.apache.hadoop.fs.FSDataOutputStream;
import org.apache.hadoop.fs.FileStatus;
import org.apache.hadoop.fs.FileSystem;
import org.apache.hadoop.fs.FileUtil;
import org.apache.hadoop.fs.Path;
import org.apache.hadoop.io.IOUtils;

public class HdfsClient {

    Configuration conf = new Configuration();
    FileSystem fs = null;

    public void connect() throws IOException, URISyntaxException, InterruptedException {
        fs = FileSystem.get(new URI("hdfs://ubuntu101:9820"), conf, "rc");
    }

    public void close() throws IOException {
        fs.close();
    }

    public void testPrint() {
        System.out.println("1234567");
    }

    public void testMkdir() throws IllegalArgumentException, IOException {
        fs.mkdirs(new Path("/test/path"));
    }

    public void testMkfile() throws IllegalArgumentException, IOException {
        Path filePath = new Path("/test/1.txt");
        FSDataOutputStream outputStream = fs.create(filePath);
        outputStream.writeUTF("你好abc\n");
        outputStream.close();
    }

    public void testReadFile() throws UnsupportedOperationException, IOException {
        Path filePath = new Path("/test/1.txt");
        FSDataInputStream inputStream = fs.open(filePath);
        IOUtils.copyBytes(inputStream, System.out, 4096, false);
        inputStream.close();
    }

    public void testDeleteFile() throws IOException {
        Path filePath = new Path("/test");
        fs.delete(filePath, true);
    }

    public void testUploadFile() throws IOException {
        Path src = new Path("琵琶行.txt");
        Path dst = new Path("/test/琵琶行.txt");
        fs.copyFromLocalFile(false, true, src, dst);
    }

    public void testUploadFile1() throws IOException {
        File src = new File("琵琶不行.txt");
        Path dst = new Path("/test/琵琶不行.txt");
        FileUtil.copy(src, fs, dst, false, conf);
    }

    public void testDownloadFile() throws IOException {
        Path src = new Path("/test/琵琶行.txt");
        Path dst = new Path("琵琶行1.txt");
        fs.copyToLocalFile(src, dst);
    }

    public void testDownloadFile1() throws IOException {
        Path src = new Path("/test/琵琶行.txt");
        File dst = new File("琵琶行2.txt");
        FileUtil.copy(fs, src, dst, false, conf);
    }

    // 列出指定目录下的文件和子目录信息，不深入子目录
    public void testListStatus() throws FileNotFoundException, IOException {
        Path path = new Path("/");
        FileStatus[] fileStatuses = fs.listStatus(path);
        for (FileStatus fileStatus : fileStatuses) {
            System.out.println(fileStatus);
        }
    }

    public void testCopyFileBetweenHDFS() throws IOException {
        Path src = new Path("/test/琵琶行.txt");
        Path dst = new Path("/test/1/琵琶可行.txt");
        FileUtil.copy(fs, src, fs, dst, false, false, conf);
    }

    public void testRename() throws IOException {
        Path src = new Path("/test/1/琵琶可行.txt");
        Path dst = new Path("/test/1/琵琶不可行.txt");
        fs.rename(src, dst);
    }
}
```

`Main.java`：

测试用的先这么写。

```java
package test.hrf.hd;

import java.io.IOException;
import java.net.URISyntaxException;

public class Main {
    public static void main(String[] args) throws IOException, URISyntaxException, InterruptedException {
        HdfsClient client = new HdfsClient();
        client.connect();
        if (args[0].equals("t0")) {
            client.testPrint();
        } else if (args[0].equals("testMkdir")) {
            client.testMkdir();
        } else if (args[0].equals("testMkfile")) {
            client.testMkfile();
        } else if (args[0].equals("testReadFile")) {
            client.testReadFile();
        } else if (args[0].equals("testDeleteFile")) {
            client.testDeleteFile();
        } else if (args[0].equals("testUploadFile")) {
            client.testUploadFile();
        } else if (args[0].equals("testUploadFile1")) {
            client.testUploadFile1();
        } else if (args[0].equals("testDownloadFile")) {
            client.testDownloadFile();
        } else if (args[0].equals("testDownloadFile1")) {
            client.testDownloadFile1();
        } else if (args[0].equals("testListStatus")) {
            client.testListStatus();
        } else if (args[0].equals("testCopyFileBetweenHDFS")) {
            client.testCopyFileBetweenHDFS();
        } else if (args[0].equals("testRename")) {
            client.testRename();
        } else {
            System.out.println("456");
        }
        client.close();
    }
}
```

### 或许还可以用 VSCode 连接虚拟机，直接在虚拟机的文件系统上编程
