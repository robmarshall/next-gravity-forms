import classnames from "classnames";
import PropTypes from "prop-types";
import React from "react";
import { useFormContext } from "react-hook-form";
import InputWrapper from "../../components/InputWrapper";
import { valueToLowerCase } from "../../utils/helpers";
import getFieldError from "../../utils/getFieldError";
import { useSettings } from "../../providers/SettingsContext";

const Textarea = ({ fieldData, name, labelFor, wrapClassName, wrapId }) => {
  const { strings } = useSettings();
  const {
    cssClass,
    errorMessage,
    inputMaskValue,
    isRequired,
    maxLength,
    placeholder,
    size,
    type: typeUpper,
  } = fieldData;

  const type = valueToLowerCase(typeUpper);

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
      wrapClassName={wrapClassName}
      wrapId={wrapId}
    >
      <textarea
        aria-invalid={Boolean(errors?.[name])}
        aria-required={isRequired}
        className={classnames(cssClass, valueToLowerCase(size), "textarea")}
        id={labelFor}
        maxLength={maxLength > 0 ? maxLength : undefined}
        name={name}
        placeholder={placeholder}
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
        type={type}
      />
    </InputWrapper>
  );
};

export default Textarea;

Textarea.propTypes = {
  fieldData: PropTypes.shape({
    cssClass: PropTypes.string,
    description: PropTypes.string,
    inputMaskValue: PropTypes.string,
    label: PropTypes.string,
    descriptionPlacement: PropTypes.string,
    maxLength: PropTypes.number,
    placeholder: PropTypes.string,
    isRequired: PropTypes.bool,
    type: PropTypes.string,
    size: PropTypes.string,
    errorMessage: PropTypes.string,
  }),
  name: PropTypes.string,
  labelFor: PropTypes.string,
  wrapClassName: PropTypes.string,
  wrapId: PropTypes.string,
};
