import React from "react";
import { Form } from "zent";

import Slot from "./slot";
import componentDecorator from "./componentDecorator";
import FormCheckboxGroupField from "./FormCheckboxGroupField";
import FormRadioGroupField from "./FormRadioGroupField";

const componentLib = {};
for (let key in Form) {
  componentLib[key] = componentDecorator(Form[key]);
}

const register = (name, component) => {
  componentLib[name] = componentDecorator(component);
};

register("FormCheckboxGroupField", FormCheckboxGroupField);
register("FormRadioGroupField", FormRadioGroupField);

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

  if (typeof props.required === "string") {
    const requiredText = props.required;
    props.required = true;
    props.validations.required = true;
    props.validationErrors.required = requiredText;
  } else if (props.required === true) {
    props.required = true;
  } else if (props.required === false) {
    props.required = false;
  }
};

// 生成key的函数
const genKeyFn = (referCountMap = {}) => identifier => {
  const referCount = (referCountMap[identifier] || 0) + 1;
  referCountMap[identifier] = referCount;

  return `${identifier}_${referCount}`;
};

const setValues = (data, formInstance) => {
  if (data) {
    const { zentForm } = formInstance.props;
    let prevValues = null;

    const setValuesAsync = () =>
      setTimeout(() => {
        const values = zentForm.getFormValues();
        if (JSON.stringify(prevValues) !== JSON.stringify(values)) {
          prevValues = values;
          zentForm.setFieldsValue(data);
          setValuesAsync();
        }
      }, 0);

    setValuesAsync();
  }
};

// 通过$slotsElementsFrag得到slotMap
const getSlotMap = $root => {
  const slotMap = {};

  const travel = $root => {
    if (!$root) return;

    if ($root.type === Slot) {
      const { id, children } = $root.props;
      if (id === undefined) throw new Error("<Slot></Slot>必传props.id");
      slotMap[id] = children;
    } else {
      if ($root.props.children) {
        const children = Array.isArray($root.props.children)
          ? $root.props.children
          : [$root.props.children];
        for (let child of children) {
          const $root = child;
          travel($root);
        }
      }
    }
  };

  travel($root);

  return slotMap;
};

const zanForm = (schema, formInstance) => $slotsElementsFrag => {
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

zanForm.Slot = Slot;
zanForm.register = register;
zanForm.setValues = setValues;

export default zanForm;
