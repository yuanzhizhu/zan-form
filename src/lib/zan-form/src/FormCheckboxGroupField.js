import React from "react";
import { Form, Checkbox } from "zent";

const { FormCheckboxGroupField: OldFormCheckboxGroupField } = Form;

class FormCheckboxGroupField extends React.Component {
  render = () => {
    let { data = [], ...restProps } = this.props;

    return (
      <OldFormCheckboxGroupField value={[]} {...restProps}>
        {data.map((item, index) => {
          const { value, text, ...restProps } = item;

          return (
            <Checkbox {...restProps} key={index} value={value}>
              {text}
            </Checkbox>
          );
        })}
      </OldFormCheckboxGroupField>
    );
  };
}

export default FormCheckboxGroupField;
