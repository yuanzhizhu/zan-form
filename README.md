# zForm 文档

## 简述

zForm 是一个通过“对象描述”生成“组件”的一个库。该库基于 `zent`。

[zent](https://github.com/youzan/zent) 是一个有赞开源的 UI 组件库，对标蚂蚁金服的 `Ant Design`。

## 在线示例

点击查看[在线示例](https://yuanzhizhu.github.io/json-form/build/index.html)

## 背景

业务中时常会存在复杂表单的场景，比如 “第一项的值” 决定 “第二项的显隐”，“第二项的值” 决定 “第三项的显隐” 这种情况。

这种场景一个普遍的处理方法是，针对每一个“动态的表单项”，单独设置一个 `state` 来控制显隐。这是一个最简单，最暴力的处理方法。

zForm 将提供一种更优雅的方案。

## 演化思路

### 1、是否有必要针对每一个“动态的表单项”，单独设置一个 `state` 来控制显隐？

在回答这个问题之前，先举例子，如下：

`表单项A` 和 `表单项B` 这两项，同时决定了 `表单项C` 的显隐性。

用 `item_c_visible_state` 表示 `表单项C` 显隐性的 state。

用 `item_a_value` 表示 `表单项A` 的值。

用 `item_b_value` 表示 `表单项B` 的值。

`item_a_value` + `item_b_value` => `item_c_visible_state` => 真实的 `表单项C` 显隐

从这里可以看出来，`item_c_visible_state` 只是一个“中间值“。事实上可以一步到位：

`item_a_value` + `item_b_value` => 真实的 `表单项C` 显隐。

通过以上的分析，可以得出一个结论：

没必要为每个“动态的表单项”设置一个单独的 `state`，可以通过整个表单数据做为 values，加逻辑判断，最终实现一样的功能：`values.item_a_value + values.item_b_value => 表单项C显隐`

### 2、如何用一个优雅的方式，聚合表单数据？

```jsx
// 第一种
state = {
  item_a_value: "a",
  item_b_value: "b",
  item_c_value: "c",
  item_x_value: "x",
  loading: false
};
```

上面的表单数据，更加优雅的方式是：

```jsx
// 第二种
state = {
  values: {
    item_a_value: "a",
    item_b_value: "b",
    item_c_value: "c",
    item_x_value: "x"
  },
  loading: false
};
```

这个“聚合”操作，我们不希望是手写的，最好是一个 高阶组件 + 表单项组件规范 的方式，就能自动实现所有功能。业界有现成的方案，如 `rc-form`。当然使用 `zent` 也是满足的。

### 3、values + 对象描述 => 组件

“对象描述”的基本两要素是：组件名 和 表单项名。

“对象描述”的次要要素有：\_show，通过返回 boolean 表示当前表单项的显隐。

```jsx
// 对象描述
[
  {
    _component: "InputItem",
    _name: "form_item_name",
    _show: values =>
      values.item_a_value === "hello" && values.item_b_value === "world"
  }
];
```
