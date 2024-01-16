import React from "react";
import classnames from "classnames";
import PropTypes from "prop-types";
import Select from "react-select";
import { Controller } from "react-hook-form";
import { useSettings } from "../../../providers/SettingsContext";

const MultiSelectEnhancedUI = ({
  control,
  name,
  options,
  cssClass,
  id,
  isRequired,
  size,
  defaultValue,
  isMulti,
  ...props
}) => {
  const { strings } = useSettings();

  // make options react-select like
  const choices = options.map((i) => ({
    ...i,
    label: i.text,
    isFixed: i.isSelected,
  }));

  return (
    <Controller
      name={name}
      control={control}
      defaultValue={
        choices.find((i) => i.value === defaultValue)?.value ||
        (!isMulti && choices[0].value) // first option is selected for a normal select by default
      }
      render={({ field: { onChange, value, ref } }) => (
        <Select
          inputRef={ref}
          unstyled
          isMulti={isMulti}
          placeholder={isMulti && strings.multiselect.placeholder}
          name={name}
          inputId={id}
          options={choices}
          className={classnames(
            "gravityform__field__input__select",
            "gfield_select",
            cssClass,
            size
          )}
          classNamePrefix="react-select"
          value={choices.find((c) => c.value === value)}
          onChange={(val) => {
            if (isMulti) return onChange(val);
            return onChange(val.value);
          }}
          {...props}
        />
      )}
      rules={{ required: isRequired && strings.errors.required }}
    />
  );
};

export default MultiSelectEnhancedUI;

MultiSelectEnhancedUI.propTypes = {
  control: PropTypes.object,
  cssClass: PropTypes.string,
  id: PropTypes.string,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      isSelected: PropTypes.bool,
      text: PropTypes.string,
      value: PropTypes.string,
    })
  ),
  size: PropTypes.string,
  isRequired: PropTypes.bool,
  name: PropTypes.string,
  isMulti: PropTypes.bool,
  defaultValue: PropTypes.string,
};
