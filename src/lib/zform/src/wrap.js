import React from "react";

const wrap = Component => {
  class NewComponent extends React.Component {
    state = {
      data: this.props.data
    };

    componentDidMount = () => {
      const { $fetch_data, $values } = this.props;
      if ($fetch_data) {
        $fetch_data($values).then(data => {
          this.setState({ data });
        });
      }
    };

    render = () => {
      const { $format, $values, forwardedRef, ...restProps } = this.props;

      if (this.state.data) {
        restProps.data = this.state.data;
      }

      return $format ? (
        $format(<Component ref={forwardedRef} {...restProps} />, $values)
      ) : (
        <Component ref={forwardedRef} {...restProps} />
      );
    };
  }

  return React.forwardRef((props, ref) => {
    return <NewComponent {...props} forwardedRef={ref} />;
  });
};

export default wrap;
