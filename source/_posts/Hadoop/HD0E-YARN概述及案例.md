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

容量调度器：按设置的比例

公平调度器：公平

## 需求

需求：从 1G 数据中，统计每个单词出现次数。

需求分析：
1G / 128m = 8 个 MapTask；1 个 ReduceTask；1 个 mrAppMaster
平均每个节点运行 10 个 / 3 台 ≈ 3 个任务（3 3 4）

修改 `yarn-site.xml`[（yarn-default.xml）](https://hadoop.apache.org/docs/current/hadoop-yarn/hadoop-yarn-common/yarn-default.xml) 后分发，停启 yarn。

## 生成 1 个 G 的文本文件

三个小写字母 + 一个 LF

注意要分行……之前就一行，用空格分隔的，读文件的时候堆溢出了，搁那改配置文件去了。

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

        long s = 1 << 28;
        byte[] buffer = new byte[4096];

        for (int i = 0; i < s; i++) {
            for (int j = 0; j < 3; j++) {
                byte randomByte = (byte) (minAscii + random.nextInt(maxAscii - minAscii + 1));
                buffer[j] = randomByte;
            }
            buffer[3] = '\n';
            bos.write(buffer, 0, 4);
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

```sh
hadoop jar $HADOOP_HOME/share/hadoop/mapreduce/hadoop-mapreduce-examples-3.3.6.jar wordcount /wcinput /wcoutput
```

```xml
<!-- 选择调度器，默认容量 -->
	<property>
		<description>The class to use as the resource scheduler.</description>
		<name>yarn.resourcemanager.scheduler.class</name>
		<value>org.apache.hadoop.yarn.server.resourcemanager.scheduler.capacity.CapacityScheduler</value>
	</property>

	<!-- ResourceManager处理调度器请求的线程数量,默认50；如果提交的任务数大于50，可以增加该值，但是不能超过3台 * 4线程 = 12线程（去除其他应用程序实际不能超过8） -->
	<property>
		<description>Number of threads to handle scheduler interface.</description>
		<name>yarn.resourcemanager.scheduler.client.thread-count</name>
		<value>8</value>
	</property>

	<!-- 是否让yarn自动检测硬件进行配置，默认是false，如果该节点有很多其他应用程序，建议手动配置。如果该节点没有其他应用程序，可以采用自动 -->
	<property>
		<description>Enable auto-detection of node capabilities such as
			memory and CPU.
		</description>
		<name>yarn.nodemanager.resource.detect-hardware-capabilities</name>
		<value>false</value>
	</property>

	<!-- 是否将虚拟核数当作CPU核数，默认是false，采用物理CPU核数 -->
	<property>
		<description>Flag to determine if logical processors(such as
			hyperthreads) should be counted as cores. Only applicable on Linux
			when yarn.nodemanager.resource.cpu-vcores is set to -1 and
			yarn.nodemanager.resource.detect-hardware-capabilities is true.
		</description>
		<name>yarn.nodemanager.resource.count-logical-processors-as-cores</name>
		<value>false</value>
	</property>

	<!-- 虚拟核数和物理核数乘数，默认是1.0 -->
	<property>
		<description>Multiplier to determine how to convert phyiscal cores to
			vcores. This value is used if yarn.nodemanager.resource.cpu-vcores
			is set to -1(which implies auto-calculate vcores) and
			yarn.nodemanager.resource.detect-hardware-capabilities is set to true. The number of
			vcores will be calculated as number of CPUs * multiplier.
		</description>
		<name>yarn.nodemanager.resource.pcores-vcores-multiplier</name>
		<value>1.0</value>
	</property>

	<!-- NodeManager使用内存数，默认8G，修改为4G内存 -->
	<property>
		<description>Amount of physical memory, in MB, that can be allocated
			for containers. If set to -1 and
			yarn.nodemanager.resource.detect-hardware-capabilities is true, it is
			automatically calculated(in case of Windows and Linux).
			In other cases, the default is 8192MB.
		</description>
		<name>yarn.nodemanager.resource.memory-mb</name>
		<value>4096</value>
	</property>

	<!-- nodemanager的CPU核数，不按照硬件环境自动设定时默认是8个，修改为4个 -->
	<property>
		<description>Number of vcores that can be allocated
			for containers. This is used by the RM scheduler when allocating
			resources for containers. This is not used to limit the number of
			CPUs used by YARN containers. If it is set to -1 and
			yarn.nodemanager.resource.detect-hardware-capabilities is true, it is
			automatically determined from the hardware in case of Windows and Linux.
			In other cases, number of vcores is 8 by default.</description>
		<name>yarn.nodemanager.resource.cpu-vcores</name>
		<value>4</value>
	</property>

	<!-- 容器最小内存，默认1G -->
	<property>
		<description>The minimum allocation for every container request at the RM in MBs. Memory
			requests lower than this will be set to the value of this property. Additionally, a node
			manager that is configured to have less memory than this value will be shut down by the
			resource manager.
		</description>
		<name>yarn.scheduler.minimum-allocation-mb</name>
		<value>1024</value>
	</property>

	<!-- 容器最大内存，默认8G，修改为2G -->
	<property>
		<description>The maximum allocation for every container request at the RM in MBs. Memory
			requests higher than this will throw an InvalidResourceRequestException.
		</description>
		<name>yarn.scheduler.maximum-allocation-mb</name>
		<value>2048</value>
	</property>

	<!-- 容器最小CPU核数，默认1个 -->
	<property>
		<description>The minimum allocation for every container request at the RM in terms of
			virtual CPU cores. Requests lower than this will be set to the value of this property.
			Additionally, a node manager that is configured to have fewer virtual cores than this
			value will be shut down by the resource manager.
		</description>
		<name>yarn.scheduler.minimum-allocation-vcores</name>
		<value>1</value>
	</property>

	<!-- 容器最大CPU核数，默认4个，修改为2个 -->
	<property>
		<description>The maximum allocation for every container request at the RM in terms of
			virtual CPU cores. Requests higher than this will throw an
			InvalidResourceRequestException.</description>
		<name>yarn.scheduler.maximum-allocation-vcores</name>
		<value>2</value>
	</property>

	<!-- 虚拟内存检查，默认打开，修改为关闭 -->
	<property>
		<description>Whether virtual memory limits will be enforced for
			containers.</description>
		<name>yarn.nodemanager.vmem-check-enabled</name>
		<value>false</value>
	</property>

	<!-- 虚拟内存和物理内存设置比例,默认2.1 -->
	<property>
		<description>Ratio between virtual memory to physical memory when setting memory limits for
			containers. Container allocations are expressed in terms of physical memory, and virtual
			memory usage is allowed to exceed this allocation by this ratio.
		</description>
		<name>yarn.nodemanager.vmem-pmem-ratio</name>
		<value>2.1</value>
	</property>
```

## 容量调度器多队列提交案例

### 配置多个队列及容量

改 capacity-scheduler.xml:

- `yarn.scheduler.capacity.root.queues`: default,队列名
- `yarn.scheduler.capacity.root.default.capacity`
- `yarn.scheduler.capacity.root.default.maximum-capacity`

新增：

- `yarn.scheduler.capacity.root.队列名.`
  - capacity：容量
  - maximum-capacity
  - user-limit-factor：用户可使用的队列资源极限系数
  - state：RUNNING
  - acl_administer_queue：\* 哪些用户有权操作队列，管理员权限（查看/杀死）
  - acl_application_max_priority：\* 哪些用户有权配置提交任务优先级
  - maximum-application-lifetime：-1 如果 application 指定了超时时间，则提交到该队列的 application 能够指定的最大超时时间不能超过该值
  - default-application-lifetime：-1 如果 application 没指定超时时间，则用 default-application-lifetime 作为默认值

### 选择要提交到的队列

默认是 default

shell：

```sh
hadoop jar $HADOOP_HOME/share/hadoop/mapreduce/hadoop-mapreduce-examples-3.3.6.jar wordcount -D mapreduce.job.queuename=队列名 /wcinput /wcoutput
```

或者 Driver 类里 `conf.set()`

### 配置最大任务优先级

yarn-site.xml:

```xml
	<property>
		<!-- 最大任务优先级 -->
		<name>yarn.cluster.max-application-priority</name>
		<value>5</value>
	</property>
```

### 模拟资源紧张环境

```sh
nohup hadoop jar $HADOOP_HOME/share/hadoop/mapreduce/hadoop-mapreduce-examples-3.3.6.jar pi 5 2000000 &
```

```sh
nohup hadoop jar $HADOOP_HOME/share/hadoop/mapreduce/hadoop-mapreduce-examples-3.3.6.jar pi -D mapreduce.job.priority=5 5 2000000 &
```

### 执行过程中修改优先级

```sh
yarn application -appID <ApplicationID> -updatePriority 优先级
```

## 公平调度器案例
