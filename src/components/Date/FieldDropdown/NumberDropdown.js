import React from "react";
import PropTypes from "prop-types";

const NumberDropdown = ({
  name,
  id,
  selectedValue,
  tabIndex,
  disabled,
  placeholder,
  startNumber,
  endNumber,
  onChange,
  isRequired,
  fieldName,
}) => {
  const increment = startNumber < endNumber ? 1 : -1;

  const options = [];
  if (placeholder !== false) {
    options.push(
      <option value="" key="placeholder">
        {placeholder}
      </option>
    );
  }

  for (let i = startNumber; i !== endNumber + increment; i += increment) {
    options.push(
      <option value={i} key={i}>
        {i}
      </option>
    );
  }

  return (
    <div
      className={`gfield_date_dropdown_${fieldName} ginput_container ginput_container_date gform-grid-col`}
    >
      <select
        name={name}
        id={id}
        tabIndex={tabIndex}
        disabled={disabled}
        onChange={onChange}
        defaultValue={selectedValue && parseInt(selectedValue, 10)}
        aria-required={isRequired}
      >
        {options}
      </select>
    </div>
  );
};

NumberDropdown.propTypes = {
  name: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  selectedValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  tabIndex: PropTypes.number,
  disabled: PropTypes.bool,
  placeholder: PropTypes.string,
  startNumber: PropTypes.number.isRequired,
  endNumber: PropTypes.number.isRequired,
  isRequired: PropTypes.bool,
  fieldName: PropTypes.string.isRequired,
};

export default NumberDropdown;
