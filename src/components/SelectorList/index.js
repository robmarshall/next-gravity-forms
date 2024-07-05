import classnames from "classnames";
import PropTypes from "prop-types";
import React from "react";
import { useFormContext } from "react-hook-form";
import InputWrapper from "../InputWrapper";
import { valueToLowerCase } from "../../utils/helpers";
import { useSettings } from "../../providers/SettingsContext";
import SelectDeselectButton from "./SelectDeselectButton";

// TODO: Enable Select All Choice
const SelectorList = ({ fieldData, name, labelFor, ...wrapProps }) => {
  const { strings } = useSettings();
  const {
    id,
    choices,
    cssClass,
    errorMessage,
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

  return (
    <InputWrapper
      errors={errors?.[name]}
      inputData={fieldData}
      labelFor={labelFor}
      {...wrapProps}
    >
      <div className={`gfield_${type}`} id={name}>
        {choices.map(({ text, value }, index) => {
          const choiceID = index + 1;
          // const defaultChecked = getDefaultChecked(value, isSelected);
          return (
            <div key={`${name}-${index + 1}`}>
              <input
                className={classnames(
                  `gravityform__field__input__${type}`,
                  `gravityform__field__input__${type}--` + choiceID,
                  cssClass,
                  valueToLowerCase(size)
                )}
                id={`${name}_${choiceID}`}
                name={`${name}${type === "checkbox" ? `.${choiceID}` : ""}`}
                {...register(name, {
                  required:
                    isRequired && (errorMessage || strings.errors.required),
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
  fieldData: PropTypes.shape({
    choices: PropTypes.array,
    cssClass: PropTypes.string,
    id: PropTypes.number,
    isRequired: PropTypes.bool,
    size: PropTypes.string,
    type: PropTypes.string,
    errorMessage: PropTypes.string,
    hasSelectAll: PropTypes.bool,
  }),
  name: PropTypes.string,
  labelFor: PropTypes.string,
  wrapProps: PropTypes.object,
};
