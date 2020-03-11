import React from "react";
import { Form, Button, Notify } from "zent";
import ReactImg from "./static/react.jpeg";
import zform from "./lib/zform";
import formConfig from "./form.config";

import "./style.css";

const { createForm } = Form;
const Slot = zform.Slot;

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
      <div style={{ textAlign: "center", marginTop: 100 }}>
        <div style={{ display: "inline-block", textAlign: "left" }}>
          <Form horizontal onSubmit={handleSubmit(this.submit)}>
            {zform(formConfig, this)(
              <React.Fragment>
                <Slot id="react-banner">
                  <img src={ReactImg} alt="react-img" />
                </Slot>
              </React.Fragment>
            )}
            <div className="zent-form__form-actions">
              <Button type="primary" htmlType="submit">
                获取表单值
              </Button>
              <Button type="primary" outline onClick={this.resetForm}>
                重置表单值
              </Button>
            </div>
          </Form>
        </div>
      </div>
    );
  };
}

export default createForm()(ResourceRegisterForm);
