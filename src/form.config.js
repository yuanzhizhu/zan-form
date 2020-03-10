import React from "react";
import axios from "axios";

const prefix = /github/.test(window.location.host) ? "/json-form/build" : "";

export default [
  {
    $component: "FormInputField",
    $name: "name",
    label: "姓名",
    required: "请输入您的名字",
    placeholder: "请输入名字"
  },
  {
    $component: "FormSelectField",
    $name: "profession",
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
    $fetchData: () => axios(`${prefix}/province.json`).then(res => res.data),
    $format: $component => (
      <div className="tip_item">
        <div>{$component}</div>
        <div>省份数据取自ajax</div>
      </div>
    ),
    $component: "FormSelectField",
    $name: "province",
    label: "省份",
    required: "请选择您所在省份",
    autoWidth: true,
    data: []
  },
  {
    $show: ($values) => !!$values.province,
    $fetchData: (values) => axios(`${prefix}/${values.province}.json`).then(res => res.data),
    $format: $component => (
      <div className="tip_item">
        <div>{$component}</div>
        <div>城市数据取自ajax</div>
      </div>
    ),
    $component: "FormSelectField",
    $name: "city",
    label: "城市",
    required: "请选择您所在城市",
    autoWidth: true,
    data: []
  },
  {
    $show: values => values.profession === "programmer",
    $component: "FormSelectField",
    $name: "language",
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
    $show: values => values.language === "javascript",
    $name: "frameworker",
    $component: "FormSelectField",
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
    $show: values => values.language === "java",
    $component: "FormSelectField",
    $name: "frameworker",
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
    $show: values => values.profession === "designer",
    $component: "FormSelectField",
    $name: "design_tool",
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
    $show: values => values.profession === "tester",
    $component: "FormSelectField",
    $name: "test_tool",
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
