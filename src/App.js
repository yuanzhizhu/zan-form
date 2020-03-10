import React from "react";
import { Form, Button, Notify } from "zent";

import zform from "./lib/zform";
import formConfig from "./form.config";

import "./style.css";

const { createForm } = Form;

class ResourceRegisterForm extends React.Component {
  submit = values => {
    Notify.success(JSON.stringify(values));
  };

  resetForm = () => {
    this.props.zentForm.resetFieldsValue();
  };

  render = () => {
    const { handleSubmit } = this.props;

    return (
      <Form horizontal onSubmit={handleSubmit(this.submit)}>
        {zform(formConfig, this)}
        <div className="zent-form__form-actions">
          <Button type="primary" htmlType="submit">
            获取表单值
          </Button>
          <Button type="primary" outline onClick={this.resetForm}>
            重置表单值
          </Button>
        </div>
      </Form>
    );
  };
}

export default createForm()(ResourceRegisterForm);
