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
    hasAutocomplete,
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
      labelFor={labelFor}
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
              value:
                /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
              message: getFieldError(
                { ...fieldData, inputMaskValue: true },
                strings
              ),
            },
          })}
          labelFor={labelFor}
          placeholder={emailField?.placeholder || placeholder}
          autoComplete={
            hasAutocomplete && emailField?.autocompleteAttribute
              ? emailField.autocompleteAttribute
              : undefined
          }
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
            autoComplete={
              hasAutocomplete && confirmEmailField?.autocompleteAttribute
                ? confirmEmailField.autocompleteAttribute
                : undefined
            }
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
    hasAutocomplete: PropTypes.bool,
  }),
  value: PropTypes.string,
  name: PropTypes.string,
  labelFor: PropTypes.string,
  wrapProps: PropTypes.object,
};
