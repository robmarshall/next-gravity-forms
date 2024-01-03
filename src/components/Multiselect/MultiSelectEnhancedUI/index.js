import classnames from "classnames";
import PropTypes from "prop-types";
import React from "react";
import Select from "react-select";

const MultiSelectEnhancedUI = ({
  register,
  name,
  options,
  cssClass,
  id,
  isRequired,
  sizeLowerCase,
}) => {
  // @TODO: you will need to add styling to your project, so i added this to Glamrock globalStyles.js: https://pastebin.com/zutnFFcH
  // @TODO2: I'm missing the 'This field is required.' notice when submitting empty select when required
  // @TODO3: chosen value(s) is not being saved in database yet
  return (
    <Select
      isMulti
      unstyled
      name={name}
      placeholder="Click to select..."
      id={id}
      {...register(name, {
        required: isRequired,
      })}
      options={options}
      className={classnames(
        "gravityform__field__input__select",
        "gfield_select",
        cssClass,
        sizeLowerCase
      )}
      classNamePrefix="react-select"
    />
  );
};

export default MultiSelectEnhancedUI;

MultiSelectEnhancedUI.propTypes = {
  register: PropTypes.func,
  cssClass: PropTypes.string,
  id: PropTypes.number,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      isFixed: PropTypes.bool,
      label: PropTypes.string,
      value: PropTypes.string,
    })
  ),
  size: PropTypes.string,
  isRequired: PropTypes.bool,
  name: PropTypes.string,
};
