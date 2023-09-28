---
title: Hadoop - 01 - 编写Linux集群分发脚本
date: 2023-09-14 15:20:00
categories: Hadoop
---

改配置文件后，用 Xftp 一个一个传还是很麻烦的，于是写一个脚本用来同步文件。

不管那么多，先能跑起来就行。毕竟连前置课程《Linux 操作系统》都没上，因为教学计划改变了。

<!--more-->

## rsync

远程同步文件用的。[rsync 用法教程](https://www.ruanyifeng.com/blog/2020/08/rsync.html)

我使用的 Ubuntu 默认已经安装了 rsync。直接在根目录建一个文件夹`test`，里面再套几个文件夹和文件，然后执行：

```sh
sudo rsync -av /test worker1:/
```

把`/test`文件夹整个复制到 worker1 的根目录。

显示权限拒绝，说明我的 SSH 还没有配置好。[SSH 教程](https://wangdoc.com/ssh/key#ssh-copy-id-%E5%91%BD%E4%BB%A4%E8%87%AA%E5%8A%A8%E4%B8%8A%E4%BC%A0%E5%85%AC%E9%92%A5)

## 改 SSHD 配置文件

三台机器上都修改：

```sh
sudo vi /etc/ssh/sshd_config
```

在文件里加上 `PermitRootLogin yes`，然后重启服务：

```sh
sudo systemctl restart sshd
```

## 改三台机器的 root 用户密码

```sh
sudo passwd root
```

## 复制 master 的公钥给其他机器的 root 用户

```sh
ssh-copy-id -i ~/.ssh/id_rsa.pub root@worker1
ssh-copy-id -i ~/.ssh/id_rsa.pub root@worker2
```

然后再尝试用 rsync 同步，成功了。

## 写`/usr/bin/xsync.sh`

复制自老师给的配置文档，把主机名改了：

```sh
#!/bin/bash
#1.-------判断参数个数
#判断参数个数是否小于 1,如果小于 1 表示没有向脚本传递参数
if [ $# -lt 1 ]
then
    echo Not Enough Argument!
    exit;
fi
#2. 遍历集群所有机器
for host in master worker1 worker2
do
    echo ==================== $host ====================
    #3. 遍历所有目录,挨个发送
    #先遍历更新的文本文件
    for file in $@
    do
        #4. 判断文件是否存在
        if [ -e $file ]
        then
            #5. 获取父目录
            pdir=$(cd -P $(dirname $file); pwd)
            #6. 获取当期文件的名称
            fname=$(basename $file)
            ssh $host "mkdir -p $pdir"
            rsync -av $pdir/$fname $host:$pdir
        else
            echo $file does not exists!
        fi
    done
done
```

### 问题

由于我前面没有完全跟着老师的文档配置，导致：

- master 连不上。
- 连 worker1 和 worker2 总共要输入 4 次 root 密码。

还是 SSH 的问题，具体地说：

- rc@master 用 SSH 连接 root@master 时连不上。
- rc@master 在命令行用 SSH 连接 root@worker1 和 root@worker2 时都不用输密码，但是用 xsync 脚本就要输密码了。

### 解决方法

- 把脚本里的 master 主机名删了，只在 master 放一份脚本。弊端是后续只能从 master 同步到另外两台，修改配置时需要在 master 修改。

但是输 4 次密码暂时不知道解决方法。

## 运行分发脚本在 master：

```sh
sudo xsync.sh 指定路径
```

这会把 master 指定路径下的文件或文件夹同步到另两台机器相同的路径下。
