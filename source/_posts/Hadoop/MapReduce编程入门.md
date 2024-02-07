---
title: MapReduce编程入门
date: 2023-11-07 21:47:00
categories: Hadoop
permalink: hadoop-mapreduce.html
---

[官方教程](https://github.com/apache/hadoop/blob/branch-3.3.6/hadoop-mapreduce-project/hadoop-mapreduce-client/hadoop-mapreduce-client-core/src/site/markdown/MapReduceTutorial.md)

<img src="/blog/images/MapReduce.png">

<!--more-->

我们想统计一篇英文文章里的单词，每个都出现了多少次。假设这个文本文件只有英文单词、空格和换行符（LF 或者 CRLF）。

需要继承 Mapper 类，重写它的 map() 方法。这个方法里传了三个参数：该行的偏移量、该行的文本内容、环境上下文。在这个方法里，对每一行按空格进行分割，形成一个 String[]，遍历这个 String[]，把它写到上下文里，这样写的就是一系列 `<word,1>`。

继承 Reducer 类，重写 reduce() 方法。。写教程真的很难，笔者前面压根没认真看书，全忘了，只注重形式了，发出来=会了。向写教程的人致敬。

继承 Driver 类，进行一些配置。

官方示例分词用的是 StringTokenizer，其他原理和细节不知道，先跑。

### WordCountMapper.java

```java
import org.apache.hadoop.io.Text;

import java.io.IOException;

import org.apache.hadoop.io.IntWritable;
import org.apache.hadoop.io.LongWritable;
import org.apache.hadoop.mapreduce.Mapper;

public class WordCountMapper extends Mapper<LongWritable, Text, Text, IntWritable> {
    // KEYIN（偏移量），VALUEIN（每一行的文本），KEYOUT（单词），VALUEOUT（1）
    // 对每一行进行分割
    private Text wordText = new Text();// 向 context 里写的 KEYOUT。Text 相当于一个盒子

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
            context.write(wordText, new IntWritable(1));
            System.out.println(context.getCurrentKey() + " | " + context.getCurrentValue());
            // 这行语句每次输出的 key 和 value 和当前 map() 传的参相同
        }
    }
}
```

### WordCountReducer.java

```java
import java.io.IOException;

import org.apache.hadoop.io.IntWritable;
import org.apache.hadoop.io.Text;
import org.apache.hadoop.mapreduce.Reducer;

public class WordCountReducer extends Reducer<Text, IntWritable, Text, IntWritable> {
    // KEYIN 和 VALUEIN 来自 WordCountMapper.map() 里向 context 里写的
    // 每一个 reducer 处理的是 【相同的KEYIN】 的 【VALUEIN集合】
    IntWritable outV = new IntWritable();// VALUEOUT

    @Override
    protected void reduce(Text key, Iterable<IntWritable> values, Context context)
            throws IOException, InterruptedException {
        int sum = 0;// 单词计数

        for (IntWritable count : values) {
            sum += count.get();
            System.out.println(count.get());// values 的每一个 count 都是 1
        }

        outV.set(sum);
        context.write(key, outV);
    }
}
```

### WordCountDriver.java

```java
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

winutils 是个什么东西呢？把它放在 Windows 上，然后在 Windows 上运行的 Java 程序可以通过它操作虚拟机。

### 集群测试

改 `WordCountDriver.java` 的 IO 路径为传参：

```java
FileInputFormat.setInputPaths(job, new Path(args[0]));
FileOutputFormat.setOutputPath(job, new Path(args[1]));
```

---

笔者这里没有看到 `System.out.println()` 的内容。

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
