import React from "react";
import PropTypes from "prop-types";
import { useFormContext } from "react-hook-form";
import strings from "../../utils/strings";
import getFieldError from "../../utils/getFieldError";
import InputWrapper from "../InputWrapper";
import { Input, ConditionalWrapper, SubLabelWrapper } from "../General";

const Email = ({ defaultValue, fieldData, name, ...wrapProps }) => {
  const { isRequired, maxLength, placeholder, inputs, subLabelPlacement } =
    fieldData;
  const [emailField, confirmEmailField] = inputs || [];

  const {
    register,
    formState: { errors },
    watch,
  } = useFormContext();

  return (
    <InputWrapper
      errors={errors?.[name] || errors?.[`${name}_2`] || {}}
      inputData={fieldData}
      labelFor={!confirmEmailField ? name : undefined}
      {...wrapProps}
    >
      <ConditionalWrapper // render only when there is confirmation field added
        condition={!!confirmEmailField}
        wrapper={(children) => (
          <SubLabelWrapper
            name={name}
            subLabelPlacement={subLabelPlacement}
            id={1}
            className="ginput_left"
            {...emailField}
          >
            {children}
          </SubLabelWrapper>
        )}
      >
        <Input
          name={name}
          errors={errors}
          defaultValue={emailField?.defaultValue || defaultValue}
          fieldData={{ ...fieldData, type: "email" }}
          {...register(name, {
            required: isRequired && strings.errors.required,
            maxLength: maxLength > 0 && {
              value: maxLength,
              message: `${strings.errors.maxChar.front}  ${maxLength} ${strings.errors.maxChar.back}`,
            },
            pattern: {
              value: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
              message: getFieldError({ ...fieldData, inputMaskValue: true }),
            },
          })}
          placeholder={emailField?.placeholder || placeholder}
        />
      </ConditionalWrapper>

      {confirmEmailField && (
        <SubLabelWrapper
          name={`${name}_2`}
          subLabelPlacement={subLabelPlacement}
          id={2}
          className="ginput_right"
          {...confirmEmailField}
        >
          <Input
            name={`${name}_2`}
            errors={errors}
            defaultValue={confirmEmailField?.defaultValue || defaultValue}
            fieldData={{ ...fieldData, type: "email" }}
            {...register(`${name}_2`, {
              required: isRequired && strings.errors.required,
              validate: (val) => {
                if (watch(name) != val) {
                  return strings.errors.emailsDontmatch;
                }
              },
            })}
            placeholder={confirmEmailField?.placeholder || placeholder}
          />
        </SubLabelWrapper>
      )}
    </InputWrapper>
  );
};

export default Email;

Email.propTypes = {
  defaultValue: PropTypes.string,
  fieldData: PropTypes.shape({
    cssClass: PropTypes.string,
    maxLength: PropTypes.number,
    placeholder: PropTypes.string,
    isRequired: PropTypes.bool,
    type: PropTypes.string,
    size: PropTypes.string,
    subLabelPlacement: PropTypes.string,
    inputs: PropTypes.array,
  }),
  value: PropTypes.string,
  name: PropTypes.string,
  wrapProps: PropTypes.object,
};
