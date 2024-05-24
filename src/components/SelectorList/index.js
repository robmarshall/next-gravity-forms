import classnames from "classnames";
import PropTypes from "prop-types";
import React from "react";
import { useFormContext } from "react-hook-form";
import InputWrapper from "../InputWrapper";
import { valueToLowerCase } from "../../utils/helpers";
import { useSettings } from "../../providers/SettingsContext";
import SelectDeselectButton from "./SelectDeselectButton";

// TODO: Enable Select All Choice
const SelectorList = ({ presetValue, fieldData, name, ...wrapProps }) => {
  const { strings } = useSettings();
  const {
    id,
    choices,
    cssClass,
    hasSelectAll,
    isRequired,
    size,
    type: typeUpper,
  } = fieldData;

  const type = valueToLowerCase(typeUpper);

  const {
    register,
    formState: { errors },
    setValue,
  } = useFormContext();

  // Determines if a field should be checked by default
  const getDefaultChecked = (value, isSelected) => {
    if (type === "checkbox") {
      // both preset value and default can be displayed
      return value === presetValue || isSelected;
    } else if (type === "radio") {
      const isPresetValueInChoices = choices.some(
        (choice) => choice.value === presetValue
      );
      // preset value overrides default in priority
      return isPresetValueInChoices ? value === presetValue : isSelected;
    }
    return false;
  };

  return (
    <InputWrapper
      errors={errors?.[name]}
      inputData={fieldData}
      labelFor={name}
      {...wrapProps}
    >
      <div className={`gfield_${type}`} id={name}>
        {choices.map(({ isSelected, text, value }, index) => {
          const choiceID = index + 1;
          const defaultChecked = getDefaultChecked(value, isSelected);
          return (
            <div key={`${name}-${index + 1}`}>
              <input
                className={classnames(
                  `gravityform__field__input__${type}`,
                  `gravityform__field__input__${type}--` + choiceID,
                  cssClass,
                  valueToLowerCase(size)
                )}
                defaultChecked={defaultChecked}
                id={`${name}_${choiceID}`}
                name={name}
                {...register(name, {
                  required: isRequired && strings.errors.required,
                })}
                type={type}
                value={value}
              />
              &nbsp;
              <label
                htmlFor={`${name}_${choiceID}`}
                dangerouslySetInnerHTML={{ __html: text }}
              />
            </div>
          );
        })}
        {hasSelectAll && (
          <SelectDeselectButton
            id={id}
            name={name}
            choices={choices}
            setValue={setValue}
          />
        )}
      </div>
    </InputWrapper>
  );
};

export default SelectorList;

SelectorList.propTypes = {
  presetValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  fieldData: PropTypes.shape({
    choices: PropTypes.array,
    cssClass: PropTypes.string,
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    isRequired: PropTypes.bool,
    size: PropTypes.string,
    type: PropTypes.string,
  }),
  name: PropTypes.string,
  wrapProps: PropTypes.object,
};
