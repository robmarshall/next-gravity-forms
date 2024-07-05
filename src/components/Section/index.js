import React from "react";
import classnames from "classnames";
import PropTypes from "prop-types";
import { outputDescription } from "../../utils/inputSettings";

const Section = ({ fieldData, wrapClassName, wrapId }) => {
  const { label, description, cssClass } = fieldData;
  return (
    <div
      className={classnames(wrapClassName, cssClass, "gsection")}
      id={wrapId}
    >
      {label && <h3 className="gsection_title">{label}</h3>}
      {description &&
        outputDescription(description, wrapId, "gsection_description")}
    </div>
  );
};

export default Section;

Section.propTypes = {
  fieldData: PropTypes.shape({
    cssClass: PropTypes.string,
    description: PropTypes.string,
    label: PropTypes.string,
  }),
  name: PropTypes.string,
  wrapClassName: PropTypes.string,
  wrapId: PropTypes.string,
};
