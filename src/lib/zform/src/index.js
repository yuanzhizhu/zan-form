// 暂不支持Radio和Checkbox

import React from "react";
import { Form } from "zent";
import zformComponent from "./zformComponent";

const componentLib = {};
for (let key in Form) {
  componentLib[key] = zformComponent(Form[key]);
}

const validComponentDesc = componentDesc => {
  const fields = ["_name", "_component"];

  return fields.every(field => {
    const fieldValue = componentDesc[field];
    if (!fieldValue) {
      throw new Error(`${field}为必传，请检查是否有遗漏`);
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

const genKey = (componentDesc, nameReferCountMap) => {
  const { _name } = componentDesc;
  const nameReferCount = (nameReferCountMap[_name] || 0) + 1;
  nameReferCountMap[_name] = nameReferCount;

  return `${_name}_${nameReferCount}`;
};

const zForm = (schema, formInstance) => {
  const values = formInstance.props.zentForm.getFormValues();
  const nameReferCountMap = {};

  const formElement = schema.map(componentDesc => {
    validComponentDesc(componentDesc);

    const {
      _component,
      _name,
      _show,
      _format,
      _fetchData,
      _subscribe,
      ...props
    } = componentDesc;

    props.name = _name;

    addValidator(props);

    const Component = componentLib[_component];

    const showComponent = _show ? _show(values) : true;

    const key = genKey(componentDesc, nameReferCountMap);

    return (
      showComponent && (
        <Component
          key={key}
          _values={values}
          _format={_format}
          _subscribe={_subscribe}
          _fetch_data={_fetchData}
          {...props}
        />
      )
    );
  });

  return formElement;
};

export default zForm;
