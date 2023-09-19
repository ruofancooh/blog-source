---
title: MongoDB - 02 - 按条件查询文档
date: 2023-09-19 13:41:00
categories: MongoDB
---

查询某数据库某集合中的文档。

我这里键加不加引号效果一样。

<!--more-->

## 查询包含一个/多个键值对的文档

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

## 查询包含键值对列表中的一个的文档

- `$or: []`

```js
db.c1.find({
  $or: [{ aaa: 123 }, { bbb: 456 }],
});
```

## 查询某个键的值大于/小于某个值的文档

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

## 查询某个键的值在/不在某个值列表内的文档

- `$in: []` 在
- `$nin: []` 不在

```js
db.c1.find({
  aaa: { $in: [123, 456] },
});
```
