---
title: MongoDB
date: 2023-09-05 17:51:00
categories: 永远不看系列
permalink: mongodb.html
---

官方文档

- [总](https://www.mongodb.com/docs/manual/)
- [VSCode 插件](https://www.mongodb.com/docs/mongodb-vscode/)
- [在 Ubuntu 上安装](https://www.mongodb.com/docs/manual/tutorial/install-mongodb-on-ubuntu/)
- [部署副本集](https://www.mongodb.com/docs/manual/tutorial/deploy-replica-set/)
- [聚合管道操作符](https://www.mongodb.com/docs/v7.0/reference/operator/aggregation-pipeline/)

<!--more-->

## Windows 10 环境配置

1. [下载 MongoDB](https://www.mongodb.com/try/download/community)，笔者下载的是`7.0.0 (current)`的`zip`格式。
2. 解压，右键用 PowerShell 运行`Install-Compass.ps1`，安装 GUI。
   默认会安装到 C 盘，安装完后手动移到 D 盘。
3. 建数据库文件夹，建一个空日志`test.log`。
4. 启动 `mongod`
   ```sh
   mongod --dbpath [数据库文件夹路径] --logpath [日志文件路径] --logappend
   ```
5. 用 MongoDBCompass 连接。

## 启动脚本

`mo.bat`

```bat
set MONGODB_HOME=D:\ProgramData\mongodb-win32-x86_64-windows-7.0.0\
cd /d %MONGODB_HOME%\bin
call mongod --dbpath %MONGODB_HOME%\db^
           --logpath %MONGODB_HOME%\test.log --logappend
```

脚本会 `call mongod`，停止则断开连接。

## 基本操作

### 展示所有数据库名

```js
show dbs
```

### 创建/切换数据库

```js
use dbname
```

### 删除某个数据库

```js
use dbname
db.dropDatabase()
```

### 向数据库里加集合

```js
db.createCollection("c1");
db.createCollection("c2");
db.createCollection("c3");
```

### 删除数据库的某个集合

```js
db.c1.drop();
```

### 展示数据库里的所有集合名

```js
show collections
```

### 向集合里加文档

```js
db.c1.insertOne({ aaa: 123 });
db.c1.insertMany([
  { aaa: 123, bbb: 456 },
  { aaa: 123, ccc: 789 },
]);
```

### 查询集合里的所有文档

```js
db.c1.find();
```

## 查询

### 包含一个/多个键值对

```js
db.c1.find({ aaa: 123 });
db.c1.find({ aaa: 123, bbb: 456 });
```

应该大概也许和与操作符的效果一样：

- `$and: []`

```js
db.c1.find({
  $and: [{ aaa: 123 }, { bbb: 456 }],
});
```

### 包含键值对列表中的一个/多个

- `$or: []`

```js
db.c1.find({
  $or: [{ aaa: 123 }, { bbb: 456 }],
});
```

### 某个键的值大于/小于某个值

- `$gt:` 大于（greater than）
- `$lt:` 小于（less than）
- `$gte:` 大于等于（greater than or equal to）
- `$lte:` 小于等于（less than or equal to）
- `$ne:` 不等于（not equal to）

```js
db.c1.find({
  aaa: { $gt: 100 },
});
```

可以和前面的套娃：

```js
db.c1.find({
  $and: [{ aaa: { $gt: 100 } }, { bbb: { $lt: 500 } }],
});
```

### 某个键的值在/不在某个值列表内

- `$in: []` 在
- `$nin: []` 不在

```js
db.c1.find({
  aaa: { $in: [123, 456] },
});
```

### 正则匹配某个键的值

```js
db.c1.find({
  aaa: { $regex: /abc/ },
});
```

## 更新

### 按 `_id` 查找一个文档并更新某个字段

```js
db.goodsbaseinf.updateOne(
  { _id: 5 },
  {
    $set: {
      item: "编程语言与程序设计",
    },
  }
);
```

## 用 VSCode 连接数据库

1. VSCode 里安装 MongoDB for VS Code 扩展。在最左边活动栏会有一片 🍃。
2. [启动 mongod](/blog/MD/00/#启动脚本)。
3. 在扩展里连接。

## 扩展配置

- 把 `Mdb: Confirm Run All` 取消勾选，这样每次 ▶️ 时不用额外确认。

## 测试

1. 🍃 -> `Create New Playground`。
2. 右上角 ▶️，会出现一个 `Playground Result` 窗口。
3. 🍃 -> `CONNECTIONS` -> 主机名上右击 `REFRESH` 刷新。会多一个 `mongodbVSCodePlaygroundDB` 数据库。

   这是由刚才那个脚本 `playground-1.mongodb.js` 创建的。

4. 写一个后缀为 **`.mongodb.js`** 的文件。
5. 打开文件后即可 ▶️。

## 示例

**注意**：`Playground Result` 窗口只输出了最后一次操作的结果。

如果一次进行多个操作，可以把每个操作的结果分别输出到控制台：

```js
db.collection0.find().forEach((doc) => {
  console.log(JSON.stringify(doc, null, 2));
});

console.log("\n");

db.collection1
  .find({
    name: { $regex: /abc/ },
  })
  .forEach((doc) => {
    console.log(JSON.stringify(doc, null, 2));
  });
```

### 向集合里插入文档

```js
use("gooddb");

db.createCollection("goodsbaseinf");

const goodsbaseinf = db.getCollection("goodsbaseinf");

goodsbaseinf.insertOne({
  _id: 1,
  name: "<c语言>",
  bookprice: 33.2,
  adddate: 2006,
  allow: true,
  baseinf: { ISBN: 183838388, press: "清华大学出版社" },
  tags: ["good", "book", "it", "Program"],
});

goodsbaseinf.insertMany([
  { _id: 2, item: "小学生教材", name: "《小学一年级语文（上册）》", price: 12 },
  { _id: 3, item: "初中生教材", name: "《初中一年级语文（上册）》", price: 15 },
  { _id: 4, item: "高中生教材", name: "《高中一年级语文（上册）》", price: 20 },
  {
    _id: 5,
    item: "外语教材",
    name: "《英语全解\nABC（五年级上）》",
    price: 30,
  },
]);
```

### 查询集合里的文档

```js
use("gooddb");

const goodsbaseinf = db.getCollection("goodsbaseinf");

console.log("查看集合 goodsbaseinf 中的所有文档：");
goodsbaseinf.find().forEach((doc) => {
  console.log(JSON.stringify(doc, null, 2));
});
console.log("\n");

console.log("查看集合 goodsbaseinf 中 name 为小学一年级语文（上册）的文档：");
goodsbaseinf.find({ name: "《小学一年级语文（上册）》" }).forEach((doc) => {
  console.log(JSON.stringify(doc, null, 2));
});
console.log("\n");

console.log("查看集合 goodsbaseinf 中的中小学生教材：");
goodsbaseinf
  .find({
    name: { $regex: /年级/ },
  })
  .forEach((doc) => {
    console.log(JSON.stringify(doc, null, 2));
  });
console.log("\n");
```

## 聚合管道

### 按某个键的值排序输出

- `$sort:{}`

按 "\_id" 升序输出（-1 就是降序）：

```js
db.bookorder.aggregate([{ $sort: { _id: 1 } }]);
```

只是输出，并不会在原集合里排序。

对于汉字之类的大概是按 Unicode，而不是拼音。[这个网站](https://symbl.cc/cn/)可以查 Unicode。

### 输出文档个数限制

- `$limit:`

```js
db.bookorder.aggregate([{ $sort: { _id: 1 } }, { $limit: 2 }]);
```

### 跳过对前 x 个文档的操作

- `$skip:`

```js
db.bookorder.aggregate([{ $sort: { _id: 1 } }, { $skip: 3 }, { $limit: 2 }]);
```

### 按某个键分组，对各个分组的某一字段求和

```js
db.bookorder.aggregate([
  {
    $group: {
      _id: "$publishingtime",
      totalPrice: { $sum: "$price" },
    },
  },
]);
```

注意不要漏了 `$`

对非数值类的求和为 0。

### 分别进行两组操作

```js
db.goodsbaseinf.aggregate([
  {
    $facet: {
      group1: [
        { $match: { sales_vol: { $lt: 50 } } },
        { $sort: { sales_vol: -1 } },
      ],
      group2: [
        { $match: { sale_vol: { $lt: 50 } } },
        { $sort: { sale_vol: -1 } },
      ],
    },
  },
]);
```
