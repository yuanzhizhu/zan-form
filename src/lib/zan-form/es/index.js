import zanFormCore from 'zan-form-core';
import { Form, Checkbox, Radio } from 'zent';
import React from 'react';

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

function _extends() {
  _extends = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };

  return _extends.apply(this, arguments);
}

function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function");
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      writable: true,
      configurable: true
    }
  });
  if (superClass) _setPrototypeOf(subClass, superClass);
}

function _getPrototypeOf(o) {
  _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
    return o.__proto__ || Object.getPrototypeOf(o);
  };
  return _getPrototypeOf(o);
}

function _setPrototypeOf(o, p) {
  _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
    o.__proto__ = p;
    return o;
  };

  return _setPrototypeOf(o, p);
}

function _objectWithoutPropertiesLoose(source, excluded) {
  if (source == null) return {};
  var target = {};
  var sourceKeys = Object.keys(source);
  var key, i;

  for (i = 0; i < sourceKeys.length; i++) {
    key = sourceKeys[i];
    if (excluded.indexOf(key) >= 0) continue;
    target[key] = source[key];
  }

  return target;
}

function _objectWithoutProperties(source, excluded) {
  if (source == null) return {};

  var target = _objectWithoutPropertiesLoose(source, excluded);

  var key, i;

  if (Object.getOwnPropertySymbols) {
    var sourceSymbolKeys = Object.getOwnPropertySymbols(source);

    for (i = 0; i < sourceSymbolKeys.length; i++) {
      key = sourceSymbolKeys[i];
      if (excluded.indexOf(key) >= 0) continue;
      if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
      target[key] = source[key];
    }
  }

  return target;
}

function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return self;
}

function _possibleConstructorReturn(self, call) {
  if (call && (typeof call === "object" || typeof call === "function")) {
    return call;
  }

  return _assertThisInitialized(self);
}

var OldFormCheckboxGroupField = Form.FormCheckboxGroupField;

var FormCheckboxGroupField = /*#__PURE__*/function (_React$Component) {
  _inherits(FormCheckboxGroupField, _React$Component);

  function FormCheckboxGroupField() {
    var _getPrototypeOf2;

    var _this;

    _classCallCheck(this, FormCheckboxGroupField);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(FormCheckboxGroupField)).call.apply(_getPrototypeOf2, [this].concat(args)));

    _defineProperty(_assertThisInitialized(_this), "render", function () {
      var _this$props = _this.props,
          _this$props$data = _this$props.data,
          data = _this$props$data === void 0 ? [] : _this$props$data,
          restProps = _objectWithoutProperties(_this$props, ["data"]);

      return React.createElement(OldFormCheckboxGroupField, _extends({
        value: []
      }, restProps), data.map(function (item, index) {
        var value = item.value,
            text = item.text,
            restProps = _objectWithoutProperties(item, ["value", "text"]);

        return React.createElement(Checkbox, _extends({}, restProps, {
          key: index,
          value: value
        }), text);
      }));
    });

    return _this;
  }

  return FormCheckboxGroupField;
}(React.Component);

var OldFormRadioGroupField = Form.FormRadioGroupField;

var FormRadioGroupField = /*#__PURE__*/function (_React$Component) {
  _inherits(FormRadioGroupField, _React$Component);

  function FormRadioGroupField() {
    var _getPrototypeOf2;

    var _this;

    _classCallCheck(this, FormRadioGroupField);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(FormRadioGroupField)).call.apply(_getPrototypeOf2, [this].concat(args)));

    _defineProperty(_assertThisInitialized(_this), "render", function () {
      var _this$props = _this.props,
          _this$props$data = _this$props.data,
          data = _this$props$data === void 0 ? [] : _this$props$data,
          restProps = _objectWithoutProperties(_this$props, ["data"]);

      return React.createElement(OldFormRadioGroupField, restProps, data.map(function (item, index) {
        var value = item.value,
            text = item.text,
            restProps = _objectWithoutProperties(item, ["value", "text"]);

        return React.createElement(Radio, _extends({}, restProps, {
          key: index,
          value: value
        }), text);
      }));
    });

    return _this;
  }

  return FormRadioGroupField;
}(React.Component);

for (var key in Form) {
  zanFormCore.register(key, Form[key]);
}

zanFormCore.register("FormCheckboxGroupField", FormCheckboxGroupField);
zanFormCore.register("FormRadioGroupField", FormRadioGroupField); // 为props增加validator

var addValidator = function addValidator(props) {
  props.validations = props.validations || {};
  props.validationErrors = props.validationErrors || {};

  if (typeof props.required === "string") {
    var requiredText = props.required;
    props.required = true;
    props.validations.required = true;
    props.validationErrors.required = requiredText;
  } else if (props.required === true) {
    props.required = true;
  } else if (props.required === false) {
    props.required = false;
  }
};

var setValues = function setValues(data, formInstance, callback) {
  if (data) {
    var zentForm = formInstance.props.zentForm;
    var prevValues = null;

    var setValuesAsync = function setValuesAsync() {
      return setTimeout(function () {
        var values = zentForm.getFormValues();

        if (JSON.stringify(prevValues) !== JSON.stringify(values)) {
          prevValues = values;
          zentForm.setFieldsValue(data);
          setValuesAsync();
        } else {
          callback && callback();
        }
      }, 0);
    };

    setValuesAsync();
  }
};

zanFormCore.setValues = setValues;
zanFormCore.onProps = addValidator;

export default zanFormCore;
