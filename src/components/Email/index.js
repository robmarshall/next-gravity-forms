import React from "react";
import PropTypes from "prop-types";
import { useFormContext } from "react-hook-form";
import getFieldError from "../../utils/getFieldError";
import { valueToLowerCase } from "../../utils/helpers";
import InputWrapper from "../InputWrapper";
import { Input, ConditionalWrapper, SubLabelWrapper } from "../General";
import { useSettings } from "../../providers/SettingsContext";

const Email = ({ fieldData, name, labelFor, ...wrapProps }) => {
  const {
    isRequired,
    placeholder,
    inputs,
    subLabelPlacement,
    size,
    errorMessage,
  } = fieldData;
  const [emailField, confirmEmailField] = inputs || [];
  const { strings } = useSettings();

  const {
    register,
    formState: { errors },
    watch,
  } = useFormContext();

  return (
    <InputWrapper
      errors={errors?.[name] || errors?.[`${name}_2`] || {}}
      inputData={fieldData}
      labelFor={!confirmEmailField ? labelFor : undefined}
      {...wrapProps}
    >
      <ConditionalWrapper // render only when there is confirmation field added
        condition={!!confirmEmailField}
        wrapper={(children) => (
          <SubLabelWrapper
            subLabelPlacement={subLabelPlacement}
            id={1}
            className="ginput_left"
            {...emailField}
            name={name}
            labelFor={labelFor}
          >
            {children}
          </SubLabelWrapper>
        )}
      >
        <Input
          name={name}
          errors={errors}
          fieldData={{ ...fieldData, type: "email" }}
          className={valueToLowerCase(size)}
          {...register(name, {
            required: isRequired && (errorMessage || strings.errors.required),
            pattern: {
              value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
              message: getFieldError(
                { ...fieldData, inputMaskValue: true },
                strings
              ),
            },
          })}
          labelFor={labelFor}
          placeholder={emailField?.placeholder || placeholder}
        />
      </ConditionalWrapper>

      {confirmEmailField && (
        <SubLabelWrapper
          subLabelPlacement={subLabelPlacement}
          id={2}
          className="ginput_right"
          {...confirmEmailField}
          name={`${name}_2`}
          labelFor={`${labelFor}_2`}
        >
          <Input
            name={`${name}_2`}
            errors={errors}
            fieldData={{ ...fieldData, type: "email" }}
            labelFor={`${labelFor}_2`}
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
  fieldData: PropTypes.shape({
    cssClass: PropTypes.string,
    placeholder: PropTypes.string,
    isRequired: PropTypes.bool,
    type: PropTypes.string,
    size: PropTypes.string,
    subLabelPlacement: PropTypes.string,
    inputs: PropTypes.array,
    errorMessage: PropTypes.string,
  }),
  value: PropTypes.string,
  name: PropTypes.string,
  labelFor: PropTypes.string,
  wrapProps: PropTypes.object,
};
