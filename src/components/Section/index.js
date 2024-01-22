import React from "react";
import classnames from "classnames";
import PropTypes from "prop-types";
import InputWrapper from "../InputWrapper";

const Section = ({ fieldData, wrapClassName, name, ...props }) => {
  const { label, description, cssClass } = fieldData;
  return (
    <InputWrapper
      wrapClassName={classnames(wrapClassName, cssClass, "gsection")}
      inputData={fieldData}
      {...props}
    >
      {label && <h3 className="gsection_title">{label}</h3>}
      {description && (
        <div className="gsection_description" id={`gfield_description_${name}`}>
          {description}
        </div>
      )}
    </InputWrapper>
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
