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
- 适合 PB 级以上数据的离线处理【TB 的后一个数量级，一百万 GB】【这个站点的资源文件，加上 md 文件、Hexo 框架的源码和 Git 历史记录才刚过 60MB，我是蜩】

## MR 的缺点

- 不擅长实时计算，返回结果的速度相对慢【高射炮打蚊子】
- 不擅长流式计算【不能在消化的同时吃东西】
- 不擅长有向无环图（DAG）计算【多个应用程序之间相联系，前一个程序的输出是后一个程序的输入，这时 MR 不是不能计算，而是会造成大量的磁盘 I/O。因为每个 MR 运行完之后都会写磁盘】

## MR 的核心思想

映射（map）和规约（reduce）。分而治之。

MR 编程模型包含且只包含一个 map 阶段和一个 reduce 阶段。

```
 /------[]------\
<-------[]------->
 \------[]------/
```

还有一个 MRAppMaster 进程，负责 MR 的调度。

## 编程入门

可以参考：https://github.com/apache/hadoop/blob/branch-3.3.6/hadoop-mapreduce-project/hadoop-mapreduce-client/hadoop-mapreduce-client-core/src/site/markdown/MapReduceTutorial.md

这里主要参考尚硅谷教材。

### input.txt

```
a good beginning is half the battle
where there is a will there is a way
```

### WordCountMapper.java

```java

```

### WordCountReducer.java

```java

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

### 集群测试
