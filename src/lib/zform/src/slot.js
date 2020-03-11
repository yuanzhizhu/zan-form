import React from "react";

class Slot extends React.Component {
  render = () => {
    const { children } = this.props;
    return <React.Fragment>{children}</React.Fragment>;
  };
}

export default Slot;
