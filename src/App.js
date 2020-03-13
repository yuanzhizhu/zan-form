import React from "react";
import { Form, Button, Notify } from "zent";
import hljs from "highlight.js/lib/highlight";
import javascript from "highlight.js/lib/languages/javascript";
import "highlight.js/styles/github.css";

import ReactImg from "./static/react.jpeg";
import zform from "./lib/zform";
import formConfig from "./form.config";

// eslint-disable-next-line import/no-webpack-loader-syntax
import formConfigText from "!!raw-loader!./form.config.js";
import "./style.css";

hljs.registerLanguage("javascript", javascript);

const highlightFormConfigHtml = hljs.highlight("javascript", formConfigText)
  .value;

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
      <div style={{ overflow: "hidden" }}>
        <div
          style={{
            float: "left",
            width: "50%",
            textAlign: "center",
            maxHeight: "100vh",
            overflow: "scroll"
          }}
        >
          <Form
            style={{
              display: "inline-block",
              textAlign: "left",
              marginTop: 50
            }}
            horizontal
            onSubmit={handleSubmit(this.submit)}
          >
            {zform(formConfig, this)(
              <Slot id="react-banner">
                <div>前端框架选择React后，显示该Slot</div>
                <img src={ReactImg} alt="react-img" />
              </Slot>
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

        <div
          style={{
            overflow: "scroll",
            boxSizing: "border-box",
            maxHeight: "100vh",
            borderLeft: "1px solid #aaa",
            paddingLeft: 12
          }}
        >
          <pre dangerouslySetInnerHTML={{ __html: highlightFormConfigHtml }} />
        </div>
      </div>
    );
  };
}

export default createForm()(ResourceRegisterForm);
