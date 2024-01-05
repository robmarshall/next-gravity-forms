import React from "react";
import classnames from "classnames";
import PropTypes from "prop-types";
import { useFormContext } from "react-hook-form";
import InputWrapper from "../../components/InputWrapper";
import MultiSelectEnhancedUI from "./MultiSelectEnhancedUI";
import strings from "../../utils/strings";
import { valueToLowerCase } from "../../utils/helpers";

const Select = ({ fieldData, name, ...wrapProps }) => {
  const {
    choices,
    cssClass,
    isRequired,
    size,
    placeholder,
    hasEnhancedUI,
    type,
  } = fieldData;

  const isMultiselectField = valueToLowerCase(type) === "multiselect";

  // if there is placeholder we add it as first option with no value set
  let options = [
    ...(placeholder
      ? [
          {
            text: placeholder,
            value: "",
            isSelected: !choices.some((i) => i.isSelected),
            className: "gf_placeholder",
          },
          ...choices,
        ]
      : choices),
  ];

  const {
    register,
    control,
    formState: { errors },
  } = useFormContext();

  const defaultValue = options.find((i) => i.isSelected)?.value;

  return (
    <InputWrapper
      errors={errors?.[name] || {}}
      inputData={fieldData}
      labelFor={name}
      {...wrapProps}
    >
      {hasEnhancedUI ? (
        <MultiSelectEnhancedUI
          name={name}
          options={options}
          cssClass={cssClass}
          id={name}
          isRequired={isRequired}
          size={valueToLowerCase(size)}
          control={control}
          isMulti={isMultiselectField}
          defaultValue={defaultValue}
        />
      ) : (
        <select
          multiple={isMultiselectField}
          aria-invalid={!!errors?.[name]}
          aria-required={isRequired}
          className={classnames(
            "gravityform__field__input",
            "gravityform__field__input__select",
            "gfield_select",
            cssClass,
            valueToLowerCase(size)
          )}
          id={name}
          name={name}
          {...register(name, {
            required: isRequired && strings.errors.required,
          })}
          defaultValue={defaultValue}
        >
          {options.map(({ text, value, className }, index) => {
            return (
              <option
                key={`${name}-${index}`}
                value={value}
                className={className}
                dangerouslySetInnerHTML={{ __html: text }}
              />
            );
          })}
        </select>
      )}
    </InputWrapper>
  );
};

export default Select;

Select.propTypes = {
  fieldData: PropTypes.shape({
    choices: PropTypes.array,
    cssClass: PropTypes.string,
    isRequired: PropTypes.bool,
    size: PropTypes.string,
  }),
  register: PropTypes.func,
  wrapProps: PropTypes.object,
};
