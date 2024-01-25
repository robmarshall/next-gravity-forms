import React, { useMemo } from "react";
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
  const choices = useMemo(
    () =>
      options.map((option) => ({
        ...option,
        label: option.text,
        isFixed: option.isSelected,
      })),
    [options]
  );

  const dropdownDefaultValue = useMemo(() => {
    const selectedOption = choices.find(
      (option) => option.value === defaultValue
    );
    if (selectedOption) return selectedOption.value;

    if (!isMulti) return choices[0]?.value;
  }, [choices, defaultValue, isMulti]);

  return (
    <Controller
      name={name}
      control={control}
      defaultValue={
        dropdownDefaultValue && isMulti
          ? [dropdownDefaultValue]
          : dropdownDefaultValue
      }
      render={({ field: { onChange, value, ref } }) => (
        <Select
          defaultValue={
            dropdownDefaultValue && isMulti
              ? choices.filter((i) => i.value === dropdownDefaultValue)
              : dropdownDefaultValue
          }
          inputRef={ref}
          unstyled
          isMulti={isMulti}
          placeholder={isMulti ? strings.multiselect.placeholder : ""}
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
          onChange={(val) =>
            onChange(isMulti ? val.map((v) => v.value) : val.value)
          }
          {...props}
        />
      )}
      rules={{ required: isRequired && strings.errors.required }}
    />
  );
};

export default MultiSelectEnhancedUI;

MultiSelectEnhancedUI.propTypes = {
  control: PropTypes.object.isRequired,
  cssClass: PropTypes.string,
  id: PropTypes.string,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      isSelected: PropTypes.bool,
      text: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
    })
  ).isRequired,
  size: PropTypes.string,
  isRequired: PropTypes.bool,
  name: PropTypes.string.isRequired,
  isMulti: PropTypes.bool,
  defaultValue: PropTypes.string,
};
