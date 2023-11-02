---
title: MD01 - CRUD
date: 2023-09-19 13:41:00
categories: MongoDB
permalink: MD/01/
---

对某数据库某集合中的文档操作。

我这里键加不加引号效果一样。

CRUD 就是增删改查 Create、Read、Update、Delete。

[官方文档](https://www.mongodb.com/docs/manual/crud/)

<!--more-->

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
