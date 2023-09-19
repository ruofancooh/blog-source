---
title: MongoDB - 01 - 基本操作
date: 2023-09-19 13:40:00
categories: MongoDB
---

装好软件后的基本操作。

<!--more-->

## 展示所有数据库名

```js
show dbs
```

## 创建/切换数据库

```js
use dbname
```

## 删除某个数据库

```js
use dbname
db.dropDatabase()
```

## 向数据库里加集合

```js
db.createCollection("c1");
db.createCollection("c2");
db.createCollection("c3");
```

## 删除数据库的某个集合

```js
db.c1.drop();
```

## 展示数据库里的所有集合名

```js
show collections
```

## 向集合里加文档

```js
db.c1.insertOne({ aaa: 123 });
db.c1.insertMany([
  { aaa: 123, bbb: 456 },
  { aaa: 123, ccc: 789 },
]);
```

## 查询集合里的所有文档

```js
db.c1.find();
```
