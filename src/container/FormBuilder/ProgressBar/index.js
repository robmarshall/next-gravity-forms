import React from "react";
import Percentage from "./Percentage";
import Steps from "./Steps";
import { string } from "prop-types";

const ProgressBar = ({ type, ...props }) => {
  if (type === "PERCENTAGE") {
    return <Percentage {...props} />;
  }

  return <Steps {...props} />;
};

ProgressBar.propTypes = {
  type: string.isRequired,
};

export default ProgressBar;
