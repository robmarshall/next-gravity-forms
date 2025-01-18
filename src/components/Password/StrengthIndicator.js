import React from "react";
import classNames from "classnames";
import { object, string } from "prop-types";

const StrengthIndicator = ({ labelFor, score = "blank", strings }) => {
  return (
    <div
      id={`${labelFor}_strength_indicator`}
      className={classNames("gfield_password_strength", score)}
    >
      {strings.password.strength[score]}
    </div>
  );
};

StrengthIndicator.propTypes = {
  score: string,
  labelFor: string.isRequired,
  strings: object.isRequired,
};

export default StrengthIndicator;
