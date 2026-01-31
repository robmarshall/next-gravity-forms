import React from "react";
import classnames from "classnames";
import PropTypes from "prop-types";
import Label from "./Label";

const SubLabelWrapper = ({
  subLabelPlacement = "INHERIT",
  children,
  label,
  customLabel,
  name,
  className,
  labelFor,
  as = "span",
  isHidden,
}) => {
  const sub_label_class =
    subLabelPlacement == "hidden_label"
      ? "hidden_sub_label screen-reader-text"
      : "";

  // @TODO respect FORM settings sub label placement
  const labelPlacement =
    subLabelPlacement === "INHERIT" ? "ABOVE" : subLabelPlacement;

  // we might render wrapper as span or div
  const Wrapper = as;

  return (
    <Wrapper
      className={classnames(className, "gform-grid-col")}
      id={`${name}_container`}
      style={isHidden ? { display: "none" } : undefined}
    >
      {labelPlacement === "ABOVE" && (
        <Label
          labelFor={labelFor || name}
          label={customLabel || label}
          sub_label_class={sub_label_class}
        />
      )}
      {children}
      {labelPlacement === "BELOW" && (
        <Label
          labelFor={labelFor || name}
          label={customLabel || label}
          sub_label_class={sub_label_class}
        />
      )}
    </Wrapper>
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
  as: PropTypes.string,
  labelFor: PropTypes.string,
  isHidden: PropTypes.bool,
};
