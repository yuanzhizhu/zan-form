# zForm 文档

## 简述

zForm 是一个通过“对象描述”生成“组件”的一个库。该库基于 `zent`。

[zent](https://github.com/youzan/zent) 是一个有赞开源的 UI 组件库，对标蚂蚁金服的 `Ant Design`。

## 在线示例

如果想了解更多，点击查看[在线示例](https://yuanzhizhu.github.io/json-form/build/index.html)

## 背景

业务中时常会存在复杂表单的场景，比如 “第一项的值” 决定 “第二项的显隐”，“第二项的值” 决定 “第三项的显隐” 这种情况。

这种场景一个普遍的处理方法是，针对每一个“动态的表单项”，单独设置一个 `state` 来控制显隐。这是一个最简单，最暴力的处理方法。

zForm 将提供一种更优雅的方案。

## 使用方式

目前 zent 中的大部分组件，皆支持通过 zForm 使用。

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

通过 `_format` 方法即实现

```js
// form.config.js
[
  {
    _component: "FormInputField",
    _name: "age",
    label: "年龄",
    _format: $component => (
      <div>
        {$component}
        <span>岁</span>
      </div>
    )
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

### 3、动态显隐表单

通过 `_show` 方法即可实现。返回 true 表示显示；返回 false 表示隐藏

```js
// form.config.js
[
  {
    _component: "FormSelectField",
    _name: "framework",
    label: "前端框架",
    _show: values => values.job === "前端",
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

### 4、自动获取数据

通过 `_fetch_data` 方法，该方法需要最终返回一个 Promise，并且 resolve 需要用到的数据

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

通过 `_subscribe` 可做订阅，当 values 改变时触发。同时第三个参数是 restart，可用来销毁并重启组件。每次重启后，组件将会是纯净的。

```js
// form.config.js
[
  {
    _component: "FormSelectField",
    _name: "city",
    _fetch_data: values => axios(`${values.city}.json`).then(res => res.data),
    _subscribe: (prevValues, values, restart) => {
      if (values.province !== prevValues.province) {
        // restart()用来重启组件
        // 组件重启后将触发_fetch_data()
        restart();
      }
    },
    label: "城市",
    data: []
  }
];
```

最终将生成如下的 jsx：

```jsx
class XyComponent {
  /* 此处逻辑，同上面提到的第4点 */
}

// @订阅函数
// 当values.province !== prevValues.province时，restart()：
// 卸载组件 => 重新装载组件 => 重新触发_fetch_data()
```

### 6、Slot 插槽

当特殊需求下，有时候需要用到插槽 Slot。通过 `_slot` 即可定义。若该项定义为插槽，则该项仅支持 `_show` 方法

```js
// form.config.js
[
  {
    _show: values => values.greet === "go_greet",
    _slot: "im_slot"
  }
];

// App.jsx
zform(formConfig, this)(
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

某些情况下可能会需要注册外部组件库，如自己部门的业务组件库。可用 `zForm.register` 注册。

```js
zForm.register("MyComponent", MyComponent);
```

## 设计心得

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

这个“聚合”操作，我们不希望是手写的，最好是一个 高阶组件 + 表单项组件规范 的方式，就能自动实现所有功能。业界有现成的方案，如 `rc-form`。当然使用 `zent` 也是满足的。

### 3、values + 对象描述 => 组件

“对象描述”的基本两要素是：组件名 和 表单项名。

“对象描述”的次要要素有：\_show，通过返回 boolean 表示当前表单项的显隐。

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
