---
title: MongoDB - 03 - 编写并运行脚本文件
date: 2023-09-22 12:41:00
categories: MongoDB
---

- 在 MongoDBCompass 里内嵌的 `_MONGOSH` 里不能运行 js 文件。
- 可使用 MongoDB for VS Code 扩展。[文档](https://www.mongodb.com/docs/mongodb-vscode/)

前者适合执行简短的命令，后者适合批处理。

<!--more-->

## 用 VSCode 连接数据库

1. VSCode 里安装 MongoDB for VS Code 扩展。在最左边活动栏会有一片 🍃。
2. [启动 mongod](/blog/2023/MongoDB-00-准备/#启动脚本)。
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
