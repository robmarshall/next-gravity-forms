import React from "react";
import PropTypes from "prop-types";
import { useFormContext } from "react-hook-form";
import { valueToLowerCase } from "../../utils/helpers";
import getFieldError from "../../utils/getFieldError";
import InputWrapper from "../InputWrapper";
import { Input } from "../General";
import { useSettings } from "../../providers/SettingsContext";

const standardType = (type) => {
  switch (type) {
    case "phone":
      return "tel";
    case "fileupload":
      return "file";
    default:
      return type;
  }
};

const InputField = ({ defaultValue, fieldData, name, ...wrapProps }) => {
  const { strings } = useSettings();
  const { inputMaskValue, isRequired, maxLength, type } = fieldData;

  const regex = inputMaskValue ? new RegExp(inputMaskValue) : false;
  const inputType = standardType(type);

  const {
    register,
    formState: { errors },
  } = useFormContext();

  return (
    <InputWrapper
      errors={errors?.[name] || {}}
      inputData={fieldData}
      labelFor={name}
      {...wrapProps}
    >
      <Input
        defaultValue={defaultValue}
        fieldData={{ ...fieldData, type: valueToLowerCase(inputType) }}
        errors={errors}
        name={name}
        {...register(name, {
          required: isRequired && strings.errors.required,
          maxLength: {
            value: maxLength > 0 && maxLength,
            message:
              maxLength > 0 &&
              `${strings.errors.maxChar.front}  ${maxLength} ${strings.errors.maxChar.back}`,
          },
          pattern: {
            value: regex,
            message: regex && getFieldError(fieldData, strings),
          },
        })}
      />
    </InputWrapper>
  );
};

export default InputField;

InputField.propTypes = {
  defaultValue: PropTypes.string,
  fieldData: PropTypes.shape({
    cssClass: PropTypes.string,
    inputMaskValue: PropTypes.string,
    maxLength: PropTypes.number,
    placeholder: PropTypes.string,
    isRequired: PropTypes.bool,
    type: PropTypes.string,
    size: PropTypes.string,
  }),
  value: PropTypes.string,
  name: PropTypes.string,
  wrapProps: PropTypes.object,
};
