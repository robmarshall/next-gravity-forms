import React from "react";
import classnames from "classnames";
import PropTypes from "prop-types";

const Section = ({ fieldData, wrapClassName, wrapId, name }) => {
  const { label, description, cssClass } = fieldData;
  // @TODO: replace li with div, just like needed in InputWrapper.
  // I skipped the InputWrapper here because we don't need any logic from it
  return (
    <li className={classnames(wrapClassName, cssClass)} id={wrapId}>
      {label && <h3 className="gsection_title">{label}</h3>}
      {description && (
        <div className="gsection_description" id={`gfield_description_${name}`}>
          {description}
        </div>
      )}
    </li>
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
