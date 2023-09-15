---
title: 算法-FF-用于测试算法的代码
date: 2023-09-15 14:15:00
categories: 算法
---

从文件读取数据集，输出运行时间和运行结果。

<!--more-->

## 排序算法的测试

### 数据集

`dataSet.json`

```json
[
  [],
  [-1],
  [3, 2, 2, 5, 2, 4, 1],
  [-3, 9999991247561, 3456, -111, 2, 7, 9, 23, 6, 0],
  [-1.23, 3.14, 3.14, 2.71, 0, 2, -4, -2]
]
```

### 测试代码

```js
function readDataSet() {
  const fs = require("fs");
  try {
    return JSON.parse(fs.readFileSync("dataSet.json"));
  } catch (error) {
    console.error("读取数据集时出错：", error);
    return [];
  }
}

function printResult(algorithmName, dataSet) {
  console.log(`${algorithmName} 后的结果：`);
  console.log(dataSet);
}

function testAlgorithm(algorithm, dataSet) {
  const dataSetCopy = dataSet.slice();
  console.time("executionTime");
  dataSetCopy.forEach((data) => {
    algorithm(data);
  });
  console.timeEnd("executionTime");
  printResult(algorithm.name, dataSetCopy);
}

function mySort(data) {}

const dataSet = readDataSet();
testAlgorithm(mySort, dataSet);
```
