---
title: HD11 - YARN 概述及案例
date: 2023-11-27 5:25:00
categories: Hadoop
permalink: HD/11/
---

Yet Another Resouce Negotiator

另一种资源调度器

为什么叫另一种：新的

<!--more-->

## 组件

<img src="https://hadoop.apache.org/docs/current/hadoop-yarn/hadoop-yarn-site/yarn_architecture.gif">

- 资源管理器 ResourceManager：集群老大
- 节点管理器 NodeManager：节点老大
- 容器 Container：每个节点里的多个小电脑
- ApplicatonMaster：用户提交的应用程序里的老大

## 工作机制

## 调度器

FIFO 调度器

容量调度器

公平调度器

## 需求

需求：从 1G 数据中，统计每个单词出现次数。

需求分析：
1G / 128m = 8 个 MapTask；1 个 ReduceTask；1 个 mrAppMaster
平均每个节点运行 10 个 / 3 台 ≈ 3 个任务（3 3 4）

修改 `yarn-site.xml`[（yarn-default.xml）](https://hadoop.apache.org/docs/current/hadoop-yarn/hadoop-yarn-common/yarn-default.xml) 后分发，停启 yarn。

## 生成 1 个 G 的文本文件

```java
import java.io.BufferedOutputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.Random;

public class Main {
    public static void main(String[] args) throws IOException {
        String filePath = "D:/1/1.txt";

        FileOutputStream fos = new FileOutputStream(filePath);
        BufferedOutputStream bos = new BufferedOutputStream(fos);
        int minAscii = 'a';
        int maxAscii = 'z';
        Random random = new Random();

        long s = 1 << 27;
        byte[] buffer = new byte[4096];

        for (int i = 0; i < s; i++) {
            for (int j = 0; j < 7; j++) {
                byte randomByte = (byte) (minAscii + random.nextInt(maxAscii - minAscii + 1));
                buffer[j] = randomByte;
            }
            buffer[7] = ' ';
            bos.write(buffer, 0, 8);
        }

        bos.flush();
        bos.close();
    }
}
```

在物理机上写文件，用 xftp 传到虚拟机上，上传到 HDFS

```sh
hadoop fs -mkdir /wcinput
hadoop fs -put ./1.txt /wcinput/1.txt
```

或者直接通过 Web UI 上传。

## 核心参数配置案例

内存不足，待处理……
