import React from "react";

const wrap = Component => {
  const newComponent = class extends React.Component {
    componentDidMount = () => {
      // console.log('did mount');
    };

    render = () => {
      const { $format, $values, ...restProps } = this.props;

      return $format ? (
        $format(<Component {...restProps} />, $values)
      ) : (
        <Component {...restProps} />
      );
    };
  };
  return newComponent;
};

export default wrap;
