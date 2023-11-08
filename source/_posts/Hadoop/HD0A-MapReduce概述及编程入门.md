---
title: HD0A - MapReduce 概述及编程入门
date: 2023-11-07 21:47:00
categories: Hadoop
permalink: HD/0A/
---

MR 是一个分布式计算程序的编程框架，是用户开发基于 Hadoop 的数据分析应用程序的核心框架。

MR 的核心功能是将用户编写的业务逻辑代码和自带的默认组件整合成一个完整的分布式计算程序，并将其并发运行在一个 Hadoop 集群上。

<!--more-->

## MR 的优点

- 易于编写一个分布式计算程序【像“编写一个串行程序一样简单”，MR 的接口都写好了，相当于库函数，或者相当于 C 对汇编的封装】
- 良好的扩展性【硬件性能不够？直接加节点】
- 高容错性【节点挂了？甩给其他节点接盘】
- 适合 PB 级以上数据的离线处理【TB 的后一个数量级，一百万 GB，我是蜩】

## MR 的缺点

- 不擅长实时计算，返回结果的速度相对慢【高射炮打蚊子】
- 不擅长流式计算【不能在消化的同时吃东西】
- 不擅长有向无环图（DAG）计算【多个应用程序之间相联系，前一个程序的输出是后一个程序的输入，这时 MR 不是不能计算，而是会造成大量的磁盘 I/O。因为每个 MR 运行完之后都会写磁盘】

## MR 的核心思想

映射（map）和规约（reduce）。分而治之。

MR 编程模型包含且只包含一个 map 阶段和一个 reduce 阶段。

<img src="/blog/images/MapReduce.png">

还有一个 MRAppMaster 进程，负责 MR 的调度。

## 编程入门

可以参考：https://github.com/apache/hadoop/blob/branch-3.3.6/hadoop-mapreduce-project/hadoop-mapreduce-client/hadoop-mapreduce-client-core/src/site/markdown/MapReduceTutorial.md

这里主要参考尚硅谷教材，我英语不好，用翻译看不如看身边的纸质书。

### input.txt

```
a good beginning is half the battle
where there is a will there is a way
hello world
```

### WordCountMapper.java

```java
package test.hrf.hd;

import org.apache.hadoop.io.Text;

import java.io.IOException;

import org.apache.hadoop.io.IntWritable;
import org.apache.hadoop.io.LongWritable;
import org.apache.hadoop.mapreduce.Mapper;

public class WordCountMapper extends Mapper<LongWritable, Text, Text, IntWritable> {
    // KEYIN（偏移量），VALUEIN（每一行的文本），KEYOUT（单词），VALUEOUT（1）
    // 对每一行进行分割
    private Text wordText = new Text();// 向 context 里写的 KEYOUT。Text 相当于一个盒子
    private final static IntWritable one = new IntWritable(1);// 向 context 里写的 VALUEOUT

    @Override
    protected void map(LongWritable key, Text value, Context context) throws IOException, InterruptedException {
        String line = value.toString();
        String[] words = line.split(" ");

        int i = 1;
        System.out.println(i++ + " | " + key + " | " + value + " | " + line);
        // input 有三行文本
        // 输出了三次，每次为：1 | 偏移量 | 该行内容（不带换行符） | 该行内容（不带换行符）
        // 其中 1 没有变，说明是分布执行的
        // 第一次偏移量为 0，第一行有 35 个英文字母 + 空格，UTF-8 编码，加上 CRLF，第二次偏移量是 37

        for (String word : words) {
            wordText.set(word);
            context.write(wordText, one);
            // context：上下文
            // 这里的 context 是在调用 map() 时传的，是 Context 类的实例
            // Context 是 Mapper 的内部抽象类，实现了 MapContext 接口

            System.out.println(context.getCurrentKey() + " | " + context.getCurrentValue());
            // 这行语句每次输出的 key 和 value 和当前 map() 传的参相同
        }
    }
}
```

### WordCountReducer.java

```java
package test.hrf.hd;

import java.io.IOException;

import org.apache.hadoop.io.IntWritable;
import org.apache.hadoop.io.Text;
import org.apache.hadoop.mapreduce.Reducer;

public class WordCountReducer extends Reducer<Text, IntWritable, Text, IntWritable> {
    // KEYIN 和 VALUEIN 来自 WordCountMapper.map() 里向 context 里写的
    // 这些代码暂时不明白
    int sum;
    IntWritable v = new IntWritable();// VALUEOUT

    @Override
    protected void reduce(Text key, Iterable<IntWritable> values, Context context)
            throws IOException, InterruptedException {
        sum = 0;

        for (IntWritable count : values) {
            sum += count.get();
        }

        v.set(sum);
        context.write(key, v);
    }
}
```

### WordCountDriver.java

```java
package test.hrf.hd;

import java.io.IOException;

import org.apache.hadoop.conf.Configuration;
import org.apache.hadoop.fs.Path;
import org.apache.hadoop.io.IntWritable;
import org.apache.hadoop.io.Text;
import org.apache.hadoop.mapreduce.lib.input.FileInputFormat;
import org.apache.hadoop.mapreduce.lib.output.FileOutputFormat;
import org.apache.hadoop.mapreduce.Job;

public class WordCountDriver {
    public static void main(String[] args) throws IOException, ClassNotFoundException, InterruptedException {
        Configuration conf = new Configuration();
        Job job = Job.getInstance(conf);

        job.setJarByClass(WordCountDriver.class);

        job.setMapperClass(WordCountMapper.class);
        job.setReducerClass(WordCountReducer.class);

        job.setMapOutputKeyClass(Text.class);
        job.setMapOutputValueClass(IntWritable.class);

        job.setOutputKeyClass(Text.class);
        job.setOutputValueClass(IntWritable.class);

        FileInputFormat.setInputPaths(job, new Path("input.txt"));
        FileOutputFormat.setOutputPath(job, new Path("output"));

        boolean result = job.waitForCompletion(true);
        System.exit(result ? 0 : 1);
    }
}
```

### 本地测试

[winutils](https://github.com/cdarlint/winutils)，可以先用 3.3.5 的。

### 集群测试

改 `WordCountDriver.java` 的 IO 路径为传参：

```java
FileInputFormat.setInputPaths(job, new Path(args[0]));
FileOutputFormat.setOutputPath(job, new Path(args[1]));
```

---

我这里没有看到 `System.out.println()` 的内容。

---

pom.xml（这里不把依赖打成一个 jar 包也可以在虚拟机上执行）:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <groupId>test.hrf.hd</groupId>
    <artifactId>hdtest</artifactId>
    <version>1.0-SNAPSHOT</version>

    <properties>
        <maven.compiler.source>1.8</maven.compiler.source>
        <maven.compiler.target>1.8</maven.compiler.target>
        <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
        <project.reporting.outputEncoding>UTF-8</project.reporting.outputEncoding>
    </properties>

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
                            <mainClass>test.hrf.hd.WordCountDriver</mainClass>
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
                            <mainClass>test.hrf.hd.WordCountDriver</mainClass>
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

### 遇到的错误及解决方法

`FileAlreadyExistsException`：不要提前建好输出文件夹

---

```
2023-11-08 16:01:47,622 INFO client.DefaultNoHARMFailoverProxyProvider: Connecting to ResourceManager at ubuntu102/192.168.78.102:8032
2023-11-08 16:01:48,945 INFO ipc.Client: Retrying connect to server: ubuntu102/192.168.78.102:8032. Already tried 0 time(s); retry policy is RetryUpToMaximumCountWithFixedSleep(maxRetries=10, sleepTime=1000 MILLISECONDS)
```

YARN 没完全启动。用 jps 看 ubuntu102 只看到 NodeManager 进程，没有看到 ResourceManager 进程。

解决方法： `start-yarn.sh`，需要在 `yarn.resourcemanager.hostname` 所配置的主机上（这里是 ubuntu102）执行。
