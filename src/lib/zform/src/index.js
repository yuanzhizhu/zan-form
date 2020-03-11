// 暂不支持Radio和Checkbox

import React from "react";
import { Form } from "zent";

import Slot from "./slot";
import componentDecorator from "./componentDecorator";

const componentLib = {};
for (let key in Form) {
  componentLib[key] = componentDecorator(Form[key]);
}

// 检验组件描述
const validComponentDesc = componentDesc => {
  const fields = ["_name", "_component"];

  return fields.every(field => {
    const fieldValue = componentDesc[field];
    if (!fieldValue) {
      throw new Error(`在${JSON.stringify(componentDesc)}中缺少${field}`);
    } else {
      return true;
    }
  });
};

// 为props增加validator
const addValidator = props => {
  props.validations = props.validations || {};
  props.validationErrors = props.validationErrors || {};

  if (props.required) {
    const requiredText = props.required;
    props.required = true;
    props.validations.required = true;
    props.validationErrors.required = requiredText;
  }
};

// 生成key的函数
const genKeyFn = (referCountMap = {}) => identifier => {
  const referCount = (referCountMap[identifier] || 0) + 1;
  referCountMap[identifier] = referCount;

  return `${identifier}_${referCount}`;
};

// 通过$slotsElementsFrag得到slotMap
const getSlotMap = $slotsElementsFrag => {
  const slotMap = {};

  if ($slotsElementsFrag) {
    let $slotElements = $slotsElementsFrag.props.children;
    if ($slotElements) {
      $slotElements = Array.isArray($slotElements)
        ? $slotElements
        : [$slotElements];
      for (let $slotElement of $slotElements) {
        const { id, children } = $slotElement.props;
        if (id === undefined) throw new Error("<Slot />中id为必传props");
        slotMap[id] = children;
      }
    }
  }

  return slotMap;
};

const zForm = (schema, formInstance) => $slotsElementsFrag => {
  const values = formInstance.props.zentForm.getFormValues();
  const slotMap = getSlotMap($slotsElementsFrag);
  const genKeyByIdentifier = genKeyFn();

  const formElement = schema.map(componentDesc => {
    const {
      _component,
      _name,
      _show,
      _format,
      _fetch_data,
      _subscribe,
      _slot,
      ...props
    } = componentDesc;

    let rcEle = null;

    if (!!_slot) {
      const key = genKeyByIdentifier(_slot);
      rcEle = <React.Fragment key={key}>{slotMap[_slot]}</React.Fragment>;
    } else {
      validComponentDesc(componentDesc);
      addValidator(props);

      const key = genKeyByIdentifier(_name);
      props.name = _name;

      const Component = componentLib[_component];

      rcEle = (
        <Component
          key={key}
          _format={_format}
          _values={values}
          _subscribe={_subscribe}
          _fetch_data={_fetch_data}
          {...props}
        />
      );
    }

    const showComponent = _show ? _show(values) : true;

    return showComponent ? rcEle : null;
  });

  return formElement;
};

zForm.Slot = Slot;

export default zForm;
