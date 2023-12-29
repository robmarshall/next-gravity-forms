import React from "react";
import classnames from "classnames";
import PropTypes from "prop-types";
import Label from "./Label";

const SubLabelWrapper = ({
  subLabelPlacement,
  children,
  label,
  customLabel,
  name,
  className,
}) => {
  const sub_label_class =
    subLabelPlacement == "hidden_label"
      ? "hidden_sub_label screen-reader-text"
      : "";

  // @TODO respect FORM settings sub label placement
  const labelPlacement =
    subLabelPlacement === "INHERIT" ? "ABOVE" : subLabelPlacement;

  return (
    <>
      <span
        className={classnames(className, "gform-grid-col")}
        id={`${name}_container`}
      >
        {labelPlacement === "ABOVE" && (
          <Label
            name={name}
            label={customLabel || label}
            sub_label_class={sub_label_class}
          />
        )}
        {children}
        {labelPlacement === "BELOW" && (
          <Label
            name={name}
            label={customLabel || label}
            sub_label_class={sub_label_class}
          />
        )}
      </span>
    </>
  );
};

export default SubLabelWrapper;

SubLabelWrapper.propTypes = {
  subLabelPlacement: PropTypes.string,
  children: PropTypes.node,
  label: PropTypes.string,
  customLabel: PropTypes.string,
  name: PropTypes.string,
  className: PropTypes.string,
};
