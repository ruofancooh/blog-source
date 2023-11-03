---
title: HD07 - Hadoop 生态圈
date: 2023-10-17 11:37:00
categories: Hadoop
permalink: HD/07/
---

Hadoop 生态圈

<!--more-->

## 字母顺序

- Alluxio：【不是 Apache 基金会的】
- Ambari：
- Flume：收集用户日志。
- HBase：分布式的，面向列的非关系型数据库，用于随机访问和实时读写数据。
- HDFS：分布式文件系统。
- Hive：用类似 SQL 的语言整理数据。
- Kafka：
- MapReduce：一种编程模型，用于海量数据的并行运算。类似分治。
- Pig：
- Spark：计算引擎。用内存代替磁盘，存储计算过程中的数据。
- Sqoop:
- Storm:
- YARN：资源管理和调度。
- Zookeeper：管动物园的。

## 层级顺序

| 用的东西              | 层级     |
| --------------------- | -------- |
|                       | 数据分析 |
| MapReduce Spark Storm | 数据模型 |
| HBase<br/>HDFS        | 数据存储 |
| Sqoop Flume Kafka     | 数据传输 |
|                       | 数据来源 |
