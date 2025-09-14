---
title: 在 Termux 上使用 Flask
date: 2023-7-19 13:45:00
permalink: termux-flask-ngrok.html
---

好奇心旺盛。

<!--more-->

使用的主要工具：

- Termux——模拟 Linux 环境
- Flask——作为后端框架
- Ngrok——内网穿透

你需要：

- 能够正常运行以上软件的安卓手机
- 最好有一台电脑

在模拟的 Linux 环境下运行 Ngrok **需要手机有 root 权限，仅用于解决[这个问题](#在开始之前解决-dns-问题)**。如果没有更好的，不使用 root 权限的方法的话，可以尝试[在 Termux 上安装 Linux 发行版](#另外)。

[用 Magisk 获取 Android 手机的 root 权限](/blog/magisk.html)

## Termux——模拟 Linux 环境

[Termux](https://termux.dev/cn/index.html) 是一个在安卓手机上模拟 Linux 环境的 app。

适用于 Android >= 7，无需手机 root。可以在 github 上[下载](https://github.com/termux/termux-app/releases/)。

Termux 模拟 Linux 环境的根目录在手机的`/data/data/com.termux/files/`。

### 如果手机没有 root：

- 在 termux 内，最多访问到上一级目录 `com.termux/`，无法访问`/data/`。
- 在 termux 外，使用文件管理器无法访问`/data/`。
- 在 termux 内访问手机 SD 卡，需使用命令

  ```sh
  termux-setup-storage
  ```

  这会把 SD 卡目录`/storage/emulated/0/`链接到
  `/data/data/com.termux/files/home/storage/shared/`。

### 如果手机已 root：

可以直接使用[MT 管理器](https://mt2.cn/)访问各个目录。这样转移文件比较方便。

### 另外

上面针对的是 Termux 模拟的 Linux 环境。**你可以使用 [PRoot](https://wiki.termux.com/wiki/PRoot) 或者 [TMOE](https://github.com/2moe/tmoe) 安装 Linux 发行版。**

## Flask——后端框架

Flask 是一个用 Python 编写的 Web 框架。[官网](https://flask.palletsprojects.com/) | [中文文档](https://dormousehole.readthedocs.io/)

### 安装 Flask

首先在 Termux 上安装 Python：

```sh
pkg install python
```

然后用 Python 的包管理工具 pip 安装 Flask：

```sh
pip install flask
```

### 在本地使用 Flask

1. 在家目录下新建一个文件夹。名字随便取，用于存放代码：

```sh
mkdir ~/flask-app
```

2. 在文件夹里新建`app.py`文件——你可以在电脑上写好了传到手机，也可以用 MT 管理器写，还可以用 Vim 写。

3. 编写代码：

```py
from flask import Flask, make_response

app = Flask(__name__)

@app.route('/')
#处理根路由的视图函数
def index():

    #创建 html 字符串
    html_content = "<h1>Hello, Flask!</h1>"

    #创建响应对象
    response = make_response(html_content)
    response.headers['Content-Type'] = 'text/html'

    #返回响应
    return response


if __name__ == '__main__':
    app.run()
```

4. 在`flask-app`目录下运行：

```sh
python app.py &
```

`&`表示把程序放在后台运行。

你会看到：

```txt
 * Serving Flask app 'app'
 * Debug mode: off
WARNING: This is a development server. Do not use it in a production deployment. Use a production WSGI server instead.
 * Running on http://127.0.0.1:5000
Press CTRL+C to quit
```

用浏览器访问`http://127.0.0.1:5000`，看到`Hello, Flask!`即为成功。

### 在局域网内使用 Flask

指定`app.run()`里面的`host`和`port`参数，即可在 Wi-Fi 局域网内访问手机。

1. 在手机设置里搜索（或者使用`ifconfig`命令），找到你手机的 ip 地址。比如是`192.168.1.2`。

2. 把代码里的`app.run()`改为

   ```py
   app.run(host='192.168.1.2', port=5000)
   ```

   端口号任意填不冲突就行，默认是`5000`。

3. 如上文，运行。

你可以在本机，或在局域网内任意设备的浏览器上访问`http://192.168.1.2:5000`。

## Ngrok——内网穿透

我们搭建了“服务器”。但是没有公网 ip，无法接受来自局域网外的访问。

Ngrok 是一个用于创建安全隧道的工具，它可以将本地的服务器或应用程序暴露到公共互联网。

### 安装 Ngrok

1. 查看 Termux 模拟 Linux 环境的 CPU 架构（跟随你手机的架构）

   ```sh
   uname -m
   #或者
   getprop ro.product.cpu.abi
   ```

2. [下载](https://ngrok.com/download)对应架构的 Ngrok 到手机。（最新版 Ngrok 没有开源，使用`pkg install ngrok`找不到包，因此在官网上下载）

3. 解压文件，并移动到`~/../usr/bin`目录。

   ```sh
   tar xvzf ~/storage/shared/[你下载的.tgz文件路径] -C ~/../usr/bin
   ```

   这里用家目录的上一级`~/../`表示 linux 环境根目录，也可以使用`$PREFIX`。如果直接使用`/`，Termux 会认为是手机的根目录。

### 在开始之前，解决 DNS 问题

官网上的包，没有适配[^1] Termux。因此笔者在首次连接时，发生了连接错误。

[^1]: [Termux 与 Linux 的区别：https://wiki.termux.com/wiki/Differences_from_Linux](https://wiki.termux.com/wiki/Differences_from_Linux)

在运行的同时打印日志：

```sh
ngrok http 5000 --log-level debug --log stdout
```

大部分内容略。关键在这里：

```log
read udp [::1]:43938->[::1]:53: read: connection refused
```

在本地主机`[::1]`的`43938`端口和`53`端口之间，建立连接失败。`53`是 DNS 服务的端口，说明 DNS 查询出了问题。

Ngrok 是用 Go 语言写的，

> 根据 src/net/dnsclient_unix.go，如果 /etc/resolv.conf 不存在，则选择 localhost:53 作为名称服务器。[^2]

[^2]: [woohaha 的回答：https://stackoverflow.com/a/49315513](https://stackoverflow.com/a/49315513)

它想找`/etc/resolv.conf`查询 DNS，而在手机里找不到这个文件。进而向`localhost:53`发送 udp 数据包。手机的`53`端口没有开放，开启`1024`以下的端口需要 root 权限。

在 Termux 里有`resolv.conf`文件，在`$PREFIX/usr/etc/resolv.conf`。但是官方的包没有改路径，源码也没有开放。

笔者尝试修改 Ngrok 配置文件里的 `dns_resolver_ips`，但是没有用。

#### 解决方法：

把 Termux 的`resolv.conf`文件复制到手机`/etc/`目录下就行了。

- 这需要 root 权限。
- **这会修改`system`分区**。如果手机升级，卸载面具前还要刷回原来的`system`；如果空间不够，可以删一些没用的系统预装软件数据，通常在`/system/app/`。
- 如果没有 root 权限，可以尝试[在 Termux 上安装 Linux 发行版](#另外)。

### 使用 Ngrok

先[注册账号](https://dashboard.ngrok.com/signup)，然后[进入仪表板](https://dashboard.ngrok.com)。

#### 添加 Authtoken 到配置文件

在本地服务器连接 Ngrok 服务器时，Authtoken 用于认证你的身份。

点击 _Your Authtoken_，你会看到你的 Authtoken。使用命令：

```sh
ngrok config add-authtoken [你的authtoken]
```

这会向配置文件`~/.config/ngrok/ngrok.yml`里写入：

```yml
authtoken: [你的authtoken]
```

#### 添加 Domain 和 Edge

点击 _Domains_。Ngrok 应该会提醒你领取一个域名，像`[几个英文单词].ngrok-free.app`。这是在前端发送请求时的目标域名。

点击 _Edges_。点击 _+ New Edge_ 按钮创建一个 Edge。

点击新建的 Edge，找到`edge=edghts_[一串字符]`，复制到手机备用。

#### 允许跨域请求

Flask 可以根据用户的请求，动态生成前端代码。而如果前端代码单独放在另一台服务器上，比如 Github Pages——

从`github.io`向`ngrok-free.app`发送 HTTP 请求。由于两者不在同一域名下，浏览器为了用户安全，会拦截跨源请求。

解决方法是，在后端的响应里加上[跨域资源共享（CORS）](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/CORS)头。

flask-cors 库可以给 Flask 的响应自动加上 CORS 头。[flask-cors 文档](https://flask-cors.readthedocs.io/)

安装 flask-cors：

```sh
pip install flask-cors
```

然后在`app.py`里加两行：

```py
from flask import Flask, make_response
from flask_cors import CORS    #<----------

app = Flask(__name__)

CORS(app)                      #<----------

@app.route('/')
#处理根路由的视图函数
def index():

    #创建 html 字符串
    html_content = "<h1>Hello, Flask!</h1>"

    #创建响应对象
    response = make_response(html_content)
    response.headers['Content-Type'] = 'text/html'

    #返回响应
    return response


if __name__ == '__main__':
    app.run()
```

#### 运行 Ngrok

找到前面复制到手机上的`edge=edghts_[一串字符]`。

先启动 Flask 到后台，再运行：

```sh
ngrok tunnel --label edge=[一串字符] http://localhost:5000
```

#### 测试发送 HTTP 请求

- 用 [curl](https://www.ruanyifeng.com/blog/2019/09/curl-reference.html) 发送`GET`请求

  ```sh
  curl -v [你的Ngrok域名]
  ```

- 在本地`file://`协议或其他域名下，用 [axios](https://www.axios-http.cn/) 发送跨域请求

  ```html
  <!DOCTYPE html>
  <html>
    <head>
      <meta charset="utf-8" />
      <script src="https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js"></script>
    </head>

    <body>
      <script>
        axios
          .get("https://你的Ngrok域名")
          .then((response) => {
            console.log(response);
          })
          .catch((error) => {
            console.log(error);
          });
      </script>
    </body>
  </html>
  ```

## 后续处理

### 保活

如果你想让服务器一直运行，在保持手机开机之外，还要：

- 始终把 Termux 挂在后台，锁定，并忽略电池优化

- 使用`nohup`命令让程序不挂起（往下看）↓

### 启动服务器

先启动 Termux，再依次启动 Flask 和 Ngrok。

可以向`$PREFIX/usr/etc/profile`文件中添加以下几行命令， 让 Termux 启动的同时自执行：

```sh
cd ~/flask-app
nohup python app.py &
nohup ngrok tunnel --label edge=[一串字符] http://localhost:5000 &
```

### 关闭服务器

使用`jobs`查看进程列表，`kill %[进程序号]`杀死进程。

当然，你也可以直接杀掉 Termux 的后台。
