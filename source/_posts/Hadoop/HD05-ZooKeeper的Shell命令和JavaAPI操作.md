---
title: HD05 - ZooKeeper的Shell命令和JavaAPI操作
date: 2023-10-11 19:45:00
categories: Hadoop
permalink: HD/05/
---

r3.8.2

- [zookeeper CLI](https://zookeeper.apache.org/doc/r3.8.2/zookeeperCLI.html)
- [zookeeper Server API](https://zookeeper.apache.org/doc/r3.8.2/apidocs/zookeeper-server/index.html)

<!--more-->

## shell 命令

前提是服务端正常（半数以上节点存活），在启动了某一台存活机器上的客户端后的操作：

见 `$ZK_HOME/docs/zookeeperCLI.html`

<iframe
  src="https://zookeeper.apache.org/doc/r3.8.2/zookeeperCLI.html"
  width=100%
  height=500>
</iframe>

- 创建节点：`create [-s] [-e] /path/to/node "content"`
  - `-s`：带序号，就是在节点名后面加上数字
  - `-e`：临时节点，在【创建此节点的那一方客户端退出】后会被删除
- 查看节点详细信息：`get -s /path/to/node`（不 `-s` 时只查看值）（与 `stat /path/to/node` 效果一样）
- 修改节点数据值：`set /path/to/node "content"`
- 删除与递归删除节点：`delete /path/to/node` `deleteall /path/to/node`
- 节点的值变化监听： `get -w /path/to/node` （节点被删除时也会被捕获）
- 节点的子节点（路径）变化监听： `ls -w /path/to/node` （节点值变化时不会被捕获）
- 列出路径下的所有子节点：`ls -R /path`

## JavaAPI 操作

使用了 [JUnit5](https://junit.org/junit5/docs/current/user-guide/) 测试框架，在 `工程目录/src/test/java` 下创建 java 源文件进行测试。

### 工程创建

1. VSCode -> 从 Maven 原型创建新项目 -> No Archetype
2. groupId 设为 `test.hrf.zk`，artifactId 设为 `zktest`
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
           <groupId>org.apache.zookeeper</groupId>
           <artifactId>zookeeper</artifactId>
           <version>3.8.2</version>
       </dependency>
   </dependencies>
   ```

4. 适当修改 pom.xml 里的 `<maven.compiler.source>` 和 `<maven.compiler.target>` 的 JDK 版本。
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

7. 在 `src/test/java` 下建 `zkClient.java`

### 创建 Znode

```java
import java.io.IOException;

import org.apache.zookeeper.CreateMode;
import org.apache.zookeeper.KeeperException;
import org.apache.zookeeper.WatchedEvent;
import org.apache.zookeeper.Watcher;
import org.apache.zookeeper.ZooDefs;
import org.apache.zookeeper.ZooKeeper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

public class zkClient {
    private static String connectString = "ubuntu101:2181";
    private static int sessionTimeout = 100000;
    private ZooKeeper zkClient = null;

    @BeforeEach
    public void init() throws IOException {
        zkClient = new ZooKeeper(connectString, sessionTimeout, new Watcher() {
            @Override
            public void process(WatchedEvent watchedEvent) {
            }
        });
    }

    // 该方法在测试时只会被调用一次
    @Test
    public void test() throws KeeperException, InterruptedException {
        // 创建一个所有客户端都可读写、持久的节点
        zkClient.create("/fruit1", "apple".getBytes(),
                ZooDefs.Ids.OPEN_ACL_UNSAFE, CreateMode.PERSISTENT);
        System.out.println("节点创建成功");
    }
}
```

### 获取子节点并监听节点变化

```java
import java.io.IOException;
import java.util.List;

import org.apache.zookeeper.KeeperException;
import org.apache.zookeeper.WatchedEvent;
import org.apache.zookeeper.Watcher;
import org.apache.zookeeper.ZooKeeper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

public class zkClient {
    private static String connectString = "ubuntu101:2181";
    private static int sessionTimeout = 100000;
    private ZooKeeper zkClient = null;

    @BeforeEach
    public void init() throws IOException {
        zkClient = new ZooKeeper(connectString, sessionTimeout,
                new Watcher() {
                    @Override
                    public void process(WatchedEvent watchedEvent) {
                        System.out.println("---start-------------------------------------");
                        List<String> children = null;
                        try {
                            children = zkClient.getChildren("/", true);
                        } catch (KeeperException | InterruptedException e) {
                            e.printStackTrace();
                        }
                        children.forEach(System.out::println);
                        System.out.println("---end--------------------------------------");
                    }
                });
    }

    // 该方法在测试时只会被调用一次
    @Test
    public void test() throws InterruptedException {
        Thread.sleep(Long.MAX_VALUE);
    }
}
```

### 判断节点是否存在

```java
import java.io.IOException;

import org.apache.zookeeper.KeeperException;
import org.apache.zookeeper.WatchedEvent;
import org.apache.zookeeper.Watcher;
import org.apache.zookeeper.ZooKeeper;
import org.apache.zookeeper.data.Stat;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

public class zkClient {
    private static String connectString = "ubuntu101:2181";
    private static int sessionTimeout = 100000;
    private ZooKeeper zkClient = null;

    @BeforeEach
    public void init() throws IOException {
        zkClient = new ZooKeeper(connectString, sessionTimeout,
                new Watcher() {
                    @Override
                    public void process(WatchedEvent watchedEvent) {
                    }
                });
    }

    // 该方法在测试时只会被调用一次
    @Test
    public void test() throws KeeperException, InterruptedException {
        Stat sta = zkClient.exists("/fruit", false);
        System.out.println(null == sta ? "不存在" : "存在");
    }
}
```

### 服务器动态上下线案例

模拟服务器动态上下线：

1. 提前创建 `/servers` 节点
2. - DistributeClient 监听服务器上下线（监听`/servers`下子路径的变化）
   - DistributeServer 模拟服务器上下线（创建/删除`/servers/hostname`）
3. 上/下线后的业务逻辑

`DistributeClient.java`：

```java
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import org.apache.zookeeper.KeeperException;
import org.apache.zookeeper.WatchedEvent;
import org.apache.zookeeper.Watcher;
import org.apache.zookeeper.ZooKeeper;

public class DistributeClient {

    private String connectString = "ubuntu101:2181,ubuntu102:2181,ubuntu103:2181";
    private int sessionTimeout = 100000;
    private ZooKeeper zk;

    public static void main(String[] args) throws IOException, KeeperException, InterruptedException {
        DistributeClient client = new DistributeClient();

        // 1 获取ZK连接
        client.getConnect();
        // 2 监听服务器下/servers下面子节点的增加和删除
        client.getServerList();

        // 3 相关业务逻辑（主要是添加延迟函数）
        client.buisiness();
    }

    private void buisiness() throws InterruptedException {
        Thread.sleep(Long.MAX_VALUE);
    }

    private void getServerList() throws KeeperException, InterruptedException {
        // 第二个参数设置为true,监听走的是getConnect下的process方法。
        List<String> children = zk.getChildren("/servers", true);
        // 循环取出每一个节点对应的主机名称
        ArrayList<Object> servers = new ArrayList<>();// 存储servers下的所有节点名称
        for (String child : children) {
            byte[] data = zk.getData("/servers/" + child, false, null);
            servers.add(new String(data));
        }
        // 打印
        System.out.println(servers);
    }

    private void getConnect() throws IOException {
        zk = new ZooKeeper(connectString, sessionTimeout, new Watcher() {
            @Override
            public void process(WatchedEvent watchedEvent) {
                // 因为注册一次，只能监听一次，所以需要在监听方法里面再注册一下
                try {
                    getServerList();
                } catch (KeeperException e) {
                    e.printStackTrace();
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
            }
        });
    }
}
```

`DistributeServer.java`：

```java
import java.io.IOException;

import org.apache.zookeeper.CreateMode;
import org.apache.zookeeper.KeeperException;
import org.apache.zookeeper.WatchedEvent;
import org.apache.zookeeper.Watcher;
import org.apache.zookeeper.ZooDefs;
import org.apache.zookeeper.ZooKeeper;

public class DistributeServer {

    private String connectString = "ubuntu101:2181,ubuntu102:2181,ubuntu103:2181";
    private int sessionTimeout = 2000;
    private ZooKeeper zk;

    public static void main(String[] args) throws IOException, KeeperException, InterruptedException {

        DistributeServer server = new DistributeServer();
        // 1. 连接zookeeper集群
        server.getConnect();

        // 2. 向集群进行注册（也就是创建服务器的路径）
        server.regist(args[0]);

        // 3. 业务逻辑的代码
        // 添加延迟函数，防止程序结束了，看不到节点的相关变化
        server.business();
    }

    private void business() throws InterruptedException {
        Thread.sleep(Long.MAX_VALUE);
    }

    private void regist(String hostname) throws KeeperException, InterruptedException {
        // znode 将在客户端断开连接时被删除，并且其名称将附加单调递增的数字
        String create = zk.create("/servers/" + hostname, hostname.getBytes(), ZooDefs.Ids.OPEN_ACL_UNSAFE,
                CreateMode.EPHEMERAL_SEQUENTIAL);
        System.out.println(hostname + " is online");
    }

    private void getConnect() throws IOException {
        zk = new ZooKeeper(connectString, sessionTimeout, new Watcher() {
            @Override
            public void process(WatchedEvent watchedEvent) {

            }
        });
    }
}
```
