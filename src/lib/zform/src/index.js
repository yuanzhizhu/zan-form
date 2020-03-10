// 暂不支持Radio和Checkbox

import React from "react";
import { Form } from "zent";
import wrap from "./wrap";

const componentLib = {};
for (let key in Form) {
  componentLib[key] = wrap(Form[key]);
}

const validComponentDesc = componentDesc => {
  const fields = ["$name", "$component"];

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
  const { $name } = componentDesc;
  const nameReferCount = (nameReferCountMap[$name] || 0) + 1;
  nameReferCountMap[$name] = nameReferCount;

  return `${$name}_${nameReferCount}`;
};

const zForm = (schema, formInstance) => {
  const values = formInstance.props.zentForm.getFormValues();
  const nameReferCountMap = {};

  const $formElement = schema.map(componentDesc => {
    validComponentDesc(componentDesc);

    const {
      $component,
      $name,
      $show,
      $format,
      $fetchData,
      ...props
    } = componentDesc;

    props.name = $name;

    addValidator(props);

    const Component = componentLib[$component];

    const showComponent = $show ? $show(values) : true;

    const key = genKey(componentDesc, nameReferCountMap);

    return (
      showComponent && (
        <Component
          key={key}
          $values={values}
          $format={$format}
          $fetch_data={$fetchData}
          {...props}
        />
      )
    );
  });

  return $formElement;
};

export default zForm;
