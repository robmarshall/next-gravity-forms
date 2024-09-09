import React from "react";
import PropTypes from "prop-types";
import { valueToLowerCase } from "../../utils/helpers";
import { forwardRef } from "react";

const Input = forwardRef(function Input(
  { fieldData, defaultValue, errors, name, labelFor, ...props },
  ref
) {
  const { isRequired, maxLength, placeholder, type, autoComplete } = fieldData;

  // substr default value if there is maxLength set
  const defaultFieldValue =
    defaultValue && maxLength
      ? defaultValue.substring(0, maxLength)
      : defaultValue;

  const describedBy = `gfield_description_${labelFor?.replace("name_", "")}`;

  return (
    <input
      ref={ref}
      aria-invalid={Boolean(errors?.[name])}
      aria-required={isRequired}
      aria-describedby={describedBy}
      defaultValue={defaultFieldValue}
      id={labelFor}
      maxLength={maxLength || 524288} // 524288 = 512kb, avoids invalid prop type error if maxLength is undefined.
      name={name}
      placeholder={placeholder}
      type={valueToLowerCase(type)}
      autoComplete={autoComplete}
      {...props}
    />
  );
});

Input.propTypes = {
  defaultValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  fieldData: PropTypes.shape({
    cssClass: PropTypes.string,
    maxLength: PropTypes.number,
    id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    placeholder: PropTypes.string,
    isRequired: PropTypes.bool,
    type: PropTypes.string,
    size: PropTypes.string,
    autoComplete: PropTypes.string,
  }),
  name: PropTypes.string,
  labelFor: PropTypes.string,
  errors: PropTypes.object,
};

export default Input;
