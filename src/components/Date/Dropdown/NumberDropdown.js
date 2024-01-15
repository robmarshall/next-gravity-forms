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
  ariaAttributes,
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
      <option
        value={i}
        key={i}
        selected={parseInt(i, 10) === parseInt(selectedValue, 10)}
      >
        {i}
      </option>
    );
  }

  return (
    <select
      name={name}
      id={id}
      tabIndex={tabIndex}
      disabled={disabled}
      {...ariaAttributes}
    >
      {options}
    </select>
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
  ariaAttributes: PropTypes.object,
};

export default NumberDropdown;
