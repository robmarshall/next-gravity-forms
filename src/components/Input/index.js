import React from "react";
import PropTypes from "prop-types";
import classnames from "classnames";
import { useFormContext } from "react-hook-form";
import { valueToLowerCase } from "../../utils/helpers";
import getFieldError from "../../utils/getFieldError";
import InputWrapper from "../InputWrapper";
import { Input } from "../General";
import { useSettings } from "../../providers/SettingsContext";
import MaxLength from "../General/MaxLength";

const InputField = ({ fieldData, name, labelFor, ...wrapProps }) => {
  const { strings } = useSettings();
  const { inputMaskValue, isRequired, maxLength, type, size, errorMessage } =
    fieldData;

  const regex = inputMaskValue ? new RegExp(inputMaskValue) : false;

  const {
    register,
    formState: { errors },
  } = useFormContext();

  return (
    <InputWrapper
      errors={errors?.[name] || {}}
      inputData={fieldData}
      labelFor={labelFor}
      {...wrapProps}
    >
      <Input
        fieldData={{ ...fieldData, type: valueToLowerCase(type) }}
        className={classnames(valueToLowerCase(size), {
          gform_hidden: type === "HIDDEN",
        })}
        errors={errors}
        name={name}
        labelFor={labelFor}
        {...register(name, {
          required: isRequired && (errorMessage || strings.errors.required),
          maxLength: maxLength > 0 && {
            value: maxLength,
            message: `${strings.errors.maxChar.front}  ${maxLength} ${strings.errors.maxChar.back}`,
          },
          pattern: {
            value: regex,
            message: regex && getFieldError(fieldData, strings),
          },
        })}
      />
      {maxLength > 0 && <MaxLength name={name} maxLength={maxLength} />}
    </InputWrapper>
  );
};

export default InputField;

InputField.propTypes = {
  fieldData: PropTypes.shape({
    cssClass: PropTypes.string,
    inputMaskValue: PropTypes.string,
    maxLength: PropTypes.number,
    placeholder: PropTypes.string,
    isRequired: PropTypes.bool,
    type: PropTypes.string,
    size: PropTypes.string,
    defaultValue: PropTypes.string,
    errorMessage: PropTypes.string,
  }),
  value: PropTypes.string,
  name: PropTypes.string,
  labelFor: PropTypes.string,
  wrapProps: PropTypes.object,
};
