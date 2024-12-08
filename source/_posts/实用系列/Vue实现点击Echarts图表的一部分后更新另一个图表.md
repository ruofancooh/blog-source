---
title: Vue实现点击Echarts图表的一部分后更新另一个图表
date: 2024-12-8 15:00:00
categories: 实用系列
permalink: vue-echarts-update.html
---

## 环境

```json
{
  "echarts": "^5.5.1",
  "vue": "^3.5.12",
  "vue-echarts": "^7.0.3"
}
```

[import code generator](https://vue-echarts.dev/#codegen)

组合式 API。一个 View 的父组件里面有两个 Echarts 图表的子组件 A 和 B。

## 问题

图表的数据从何而来：

1. 准备图表的 JSON 格式为一个计算属性，把 data 字段设置为 Ref 对象
2. 给 v-chart 标签的 :option 绑定这个计算属性
3. 写一个更新图表的函数，fetch 一个文件，转换成图表需要的格式，赋值给那个 Ref.value
4. 在 onMounted() 里面调用更新图表的函数

点击子组件图表后的事件和参数如何传递给父组件：

1. 在子组件里定义一个发射源 const emit = defineEmits(["eventName"]);
2. 给子组件 v-chart 标签的 @click 绑定一个方法
3. 该方法带一个参数 param 为图表点击后的参数，在该方法里发射事件 emit("eventName", param);
4. 在父组件里引用子组件标签处的 @event-name 绑定一个带参数 param 的方法，用于接收子组件发射的事件和参数

父组件如何向子组件传消息：

1. 在子组件里定义它的属性

```js
const props = defineProps({
  propName: {
    type: String,
    default: "",
  },
});
```

2. 在父组件里引用子组件标签处的 :prop-name 绑定一个 Ref 对象，更新 Ref 对象

如何实现点击图表 A 的一部分后，更新图表 B：

1. 把点击图表 A 后的事件和参数 emit 给父组件
2. 父组件在 A 组件标签 @ 处绑定的方法处接收，并更新图表 B 标签的 :prop-name 的 Ref
3. 在 B 组件里监视它 props 的变化，调用更新图表的方法

```js
watch(
  () => props.propName,
  async (newVal) => {
    console.log("propName updated:", newVal);
    await updateChartData(newVal);
  },
  { immediate: true } //确保在组件初始化时也执行一次回调函数
);
```

5. 在更新图表的方法里，根据接收到的参数，fetch 不同的文件或者 filter 不同的数据，赋给 data 的 Ref.value
