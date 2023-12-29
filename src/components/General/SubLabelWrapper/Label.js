// eslint-disable-next-line no-unused-vars
import React from "react";
import classnames from "classnames";
import PropTypes from "prop-types";

const Label = ({ name, label, sub_label_class }) => {
  return (
    <label
      htmlFor={name}
      className={classnames(
        "gform-field-label gform-field-label--type-sub",
        sub_label_class
      )}
      dangerouslySetInnerHTML={{ __html: label }}
    />
  );
};

Label.propTypes = {
  sub_label_class: PropTypes.string,
  label: PropTypes.string,
  name: PropTypes.string,
};

export default Label;
