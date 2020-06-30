import zanFormCore from "zan-form-core";
import { Form } from "zent";
import FormCheckboxGroupField from "./FormCheckboxGroupField";
import FormRadioGroupField from "./FormRadioGroupField";

for (let key in Form) {
  zanFormCore.register(key, Form[key]);
}

zanFormCore.register("FormCheckboxGroupField", FormCheckboxGroupField);
zanFormCore.register("FormRadioGroupField", FormRadioGroupField);

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

const setValues = (data, formInstance, callback) => {
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
        } else {
          callback && callback();
        }
      }, 0);

    setValuesAsync();
  }
};

zanFormCore.setValues = setValues;
zanFormCore.onProps = addValidator;

export default zanFormCore;
