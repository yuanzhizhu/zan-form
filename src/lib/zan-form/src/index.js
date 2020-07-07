import zanFormCore from "zan-form-core";
import { Form } from "zent";
import FormCheckboxGroupField from "./FormCheckboxGroupField";
import FormRadioGroupField from "./FormRadioGroupField";

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

zanFormCore.onProps = addValidator;
zanFormCore.howToGetFormValues = formInstance => {
  return formInstance.props.zentForm.getFormValues();
};
zanFormCore.howToSetFormValues = (formInstance, data) => {
  formInstance.props.zentForm.setFieldsValue(data);
};
zanFormCore.howToRemoveFormItem = () => {
  return null;
};
zanFormCore.mapDecoratorStateToProps = {
  get: props => props.data,
  set: (props, data) => {
    props.data = data;
  }
};

for (let key in Form) {
  zanFormCore.register(key, Form[key]);
}

zanFormCore.register("FormCheckboxGroupField", FormCheckboxGroupField);
zanFormCore.register("FormRadioGroupField", FormRadioGroupField);

export default zanFormCore;
