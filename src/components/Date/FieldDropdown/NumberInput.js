import React from "react";
import PropTypes from "prop-types";
import { SubLabelWrapper } from "../../General";

const NumberInput = ({
  selectedValue,
  startNumber,
  endNumber,
  isRequired,
  id,
  label,
  customLabel,
  name,
  subLabelPlacement,
  fieldName,
  placeholder,
  onChange,
}) => {
  return (
    <SubLabelWrapper
      subLabelPlacement={subLabelPlacement}
      className={`gfield_date_${fieldName} ginput_container ginput_container_date gform-grid-col`}
      name={id}
      label={customLabel || label}
      as="div"
    >
      <input
        defaultValue={selectedValue && parseInt(selectedValue, 10)}
        aria-required={isRequired}
        step={1}
        min={startNumber}
        max={endNumber}
        type="number"
        id={id}
        placeholder={placeholder}
        name={name}
        onChange={onChange}
      />
    </SubLabelWrapper>
  );
};

NumberInput.propTypes = {
  selectedValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  startNumber: PropTypes.number.isRequired,
  endNumber: PropTypes.number.isRequired,
  isRequired: PropTypes.bool,
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  customLabel: PropTypes.string,
  name: PropTypes.string.isRequired,
  fieldName: PropTypes.string.isRequired,
  placeholder: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default NumberInput;
