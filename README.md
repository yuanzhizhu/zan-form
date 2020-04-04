# zanForm 文档

## 简述

zanForm 是一个通过“对象描述”生成“组件”的一个库。该库基于 `zent`。

[zent](https://github.com/youzan/zent) 是一个有赞开源的 UI 组件库，对标蚂蚁金服的 `Ant Design`。

## 在线示例

如果想了解更多，点击查看[在线示例](https://yuanzhizhu.github.io/zan-form/build/index.html)

## 背景

业务中时常会存在复杂表单的场景，比如 “第一项的值” 决定 “第二项的显隐”，“第二项的值” 决定 “第三项的显隐” 这种情况。

这种场景一个普遍的处理方法是，针对每一个“动态的表单项”，单独设置一个 `state` 来控制显隐。这是一个最简单，最暴力的处理方法。

zanForm 将提供一种更优雅的方案。

## 初始化

```js
zanForm(formConfig, this)();
```

## 使用方式

目前 zent 中的大部分组件，皆支持通过 zanForm 使用。

### 1、基本用法如下：

```js
// form.config.js
[
  {
    _component: "FormInputField",
    _name: "name",
    label: "姓名",
    required: "请输入您的名字",
    placeholder: "请输入名字"
  }
];
```

最终将生成如下的 jsx：

```jsx
<FormInputField
  name="name"
  label="姓名"
  placeholder="请输入名字"
  validations={{ required: true }}
  validationErrors={{ required: "请输入您的名字" }}
  required
/>
```

### 2、格式化组件

通过 `_format($component)` 方法即实现

```js
// form.config.js
[
  {
    _component: "FormInputField",
    _name: "age",
    _format: $component => (
      <div>
        {$component}
        <span>岁</span>
      </div>
    ),
    label: "年龄"
  }
];
```

最终将生成如下的 jsx：

```jsx
<div>
  <FormInputField name="age" label="年龄" />
  <span>岁</span>
</div>
```

### 3、动态显隐组件

通过 `_show(values)` 方法即可实现。返回 true 表示显示；返回 false 表示隐藏

```js
// form.config.js
[
  {
    _component: "FormSelectField",
    _name: "framework",
    _show: values => values.job === "前端",
    label: "前端框架",
    data: [
      {
        text: "React",
        value: "react"
      },
      {
        text: "Vue",
        value: "vue"
      }
    ]
  }
];
```

最终将生成如下的 jsx：

```jsx
{
  values.job === "前端" && (
    <FormSelectField
      name="framework"
      label="前端框架"
      data={[
        {
          text: "React",
          value: "react"
        },
        {
          text: "Vue",
          value: "vue"
        }
      ]}
    />
  );
}
```

### 4、组件自动获取数据

通过 `_fetch_data()` 方法可以实现自动取数据，而无需在 componentDidMount 里面编写代码。

该方法约定需要最终返回一个 Promise，并且 resolve 需要用到的数据。

```js
// form.config.js
[
  {
    _component: "FormSelectField",
    _name: "province",
    _fetch_data: () => axios("/province.json").then(res => res.data),
    label: "省份",
    data: []
  }
];
```

最终将生成如下的 jsx：

```jsx
class XyComponent {
  state = {
    provinceData: []
  };

  render = () => {
    const { provinceData } = this.state;
    return <FormSelectField name="province" label="省份" data={provinceData} />;
  };

  componentDidMount = () => {
    axios("/province.json")
      .then(res => res.data)
      .then(provinceData => this.setState({ provinceData }));
  };
}
```

### 5、订阅模式，并提供“重启组件”的方法

通过 `_subscribe(prevValues, values, restart)` 可做订阅，当 values 改变时触发。

同时第三个参数是 restart，调用后来销毁并重启组件。

每次重启后，组件将会是纯净的。同时重启后，将自动触发 `_fetch_data` 函数。

```js
// form.config.js
// 这是一个根据“省份”去动态取“该省份下城市列表”的组件描述
[
  {
    _component: "FormSelectField",
    _name: "city",
    _fetch_data: values =>
      axios(`/get_city_by_province?province=${values.province}`).then(
        res => res.data
      ),
    _subscribe: (prevValues, values, restart) => {
      // 如果“省份”改变，则重启组件
      if (values.province !== prevValues.province) {
        restart();
      }
    },
    label: "城市",
    data: []
  }
];
```

### 6、Slot 插槽

当特殊需求下，有时候需要用到插槽 Slot。通过 `_slot` 即可定义。

若该项定义为插槽，则该项仅支持 `_show` 方法。

```js
// form.config.js
[
  {
    _show: values => values.greet === "go_greet",
    _slot: "im_slot"
  }
];

// App.jsx
zanForm(formConfig, this)(
  <React.Fragment>
    <Slot id="im_slot">
      <div>Hello,World</div>
    </Slot>
  </React.Fragment>
);
```

最终将生成如下的 jsx：

```jsx
{
  values.greet === "go_greet" && <div>Hello,World</div>;
}
```

### 7、注册外部组件

某些情况下可能会需要注册外部组件库，如自己部门的业务组件库。可用 `zanForm.register()` 注册。

```js
zanForm.register("MyComponent", MyComponent);
```

## 8、设置初始化值

```js
zanForm.setValues(initData, this);
```

initData为 `{ key1: value1, key2: value2 }` 的格式

## 设计理念

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

没必要为每个“动态的表单项”设置一个单独的 `state`，可以通过对整个表单数据做聚合，最终成为 values 对象，最终实现一样的功能：`values.item_a_value + values.item_b_value => 表单项C显隐`

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

对第一种进行聚合后：

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

这个“聚合”操作，我们不希望是手写的，最好是一个 高阶组件 + 表单项组件规范 的方式，就能自动实现所有功能。业界有现成的方案，如 `rc-form`。当然使用 `zent` 也是满足的。当然，这一步是不需要 zanForm 做的。此处提到，只是方便理解一些设计。

### 3、values + 对象描述 => 组件

“对象描述”的基本两要素是：组件名 和 表单项名。

```js
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

上面的“对象描述”的含义是生成如下：

```jsx
// jsx代码
{
  values.item_a_value === "hello" && values.item_b_value === "world" && (
    <InputItem _name="form_item_name" />
  );
}
```
