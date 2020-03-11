import React from "react";
import axios from "axios";

const prefix = /github/.test(window.location.host) ? "/json-form/build" : "";

export default [
  {
    _show: values => values.frameworker === "react",
    _slot: "react-banner"
  },
  {
    _component: "FormInputField",
    _name: "name",
    label: "姓名",
    required: "请输入您的名字",
    placeholder: "请输入名字"
  },
  {
    _component: "FormSelectField",
    _name: "province",
    _fetch_data: () => axios(`${prefix}/province.json`).then(res => res.data),
    _format: $component => (
      <div className="tip_item">
        <div>{$component}</div>
        <div>省份数据取自ajax</div>
      </div>
    ),
    label: "省份",
    required: "请选择您所在省份",
    autoWidth: true,
    data: []
  },
  {
    _component: "FormSelectField",
    _name: "city",
    _show: values => !!values.province,
    _fetch_data: values =>
      axios(`${prefix}/${values.province}.json`).then(res => res.data),
    _format: $component => (
      <div className="tip_item">
        <div>{$component}</div>
        <div>城市数据取自ajax</div>
      </div>
    ),
    _subscribe: (prevValues, values, restart) => {
      if (values.province !== prevValues.province) {
        restart();
      }
    },
    label: "城市",
    required: "请选择您所在城市",
    autoWidth: true,
    data: []
  },
  {
    _component: "FormSelectField",
    _name: "profession",
    label: "职业",
    required: "请选择您的职业",
    autoWidth: true,
    data: [
      {
        text: "程序员",
        value: "programmer"
      },
      {
        text: "设计",
        value: "designer"
      },
      {
        text: "测试",
        value: "tester"
      }
    ]
  },
  {
    _component: "FormSelectField",
    _name: "language",
    _show: values => values.profession === "programmer",
    label: "语言",
    required: "请选择语言",
    data: [
      {
        text: "Javascript",
        value: "javascript"
      },
      {
        text: "Java",
        value: "java"
      }
    ]
  },
  {
    _component: "FormSelectField",
    _name: "frameworker",
    _show: values => values.language === "javascript",
    label: "开发框架",
    required: "请选择开发框架",
    data: [
      {
        text: "React",
        value: "react"
      },
      {
        text: "Vue",
        value: "vue"
      },
      {
        text: "Angular",
        value: "angular"
      }
    ]
  },
  {
    _component: "FormSelectField",
    _name: "frameworker",
    _show: values => values.language === "java",
    label: "开发框架",
    required: "请选择开发框架",
    data: [
      {
        text: "Spring",
        value: "spring"
      },
      {
        text: "Hibernate",
        value: "hibernate"
      },
      {
        text: "Struts2",
        value: "struts2"
      }
    ]
  },
  {
    _component: "FormSelectField",
    _name: "design_tool",
    _show: values => values.profession === "designer",
    label: "作图工具",
    required: "请选择作图工具",
    data: [
      {
        text: "PS",
        value: "ps"
      },
      {
        text: "Sketch",
        value: "sketch"
      }
    ]
  },
  {
    _component: "FormSelectField",
    _name: "test_tool",
    _show: values => values.profession === "tester",
    label: "测试工具",
    required: "请选择测试工具",
    data: [
      {
        text: "Selenium",
        value: "selenium"
      },
      {
        text: "AutoRunner",
        value: "autorunner"
      }
    ]
  }
];
