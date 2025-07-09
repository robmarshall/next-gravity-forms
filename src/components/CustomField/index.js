/**
 * Custom field to be able to override markup if needed
 */
import React from "react";
import PropTypes from "prop-types";
import { useFormContext } from "react-hook-form";
import InputWrapper from "../InputWrapper";
import { Controller } from "react-hook-form";
import { useSettings } from "../../providers/SettingsContext";

const CustomField = ({
  fieldData,
  name,
  labelFor,
  children: CustomComponent,
  ...wrapProps
}) => {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  const { strings } = useSettings();

  if (!CustomComponent) return null;

  const { isRequired, errorMessage } = fieldData;

  // check if custom component has validation passed
  let validationConfig = {};
  if (typeof CustomComponent?.validation === "function") {
    validationConfig = CustomComponent.validation({
      name,
      fieldData,
      labelFor,
      strings,
      ...wrapProps,
    });
  } else if (typeof CustomComponent?.validation === "object") {
    validationConfig = CustomComponent.validation;
  }

  return (
    <InputWrapper
      errors={errors?.[name] || {}}
      inputData={fieldData}
      labelFor={labelFor}
      {...wrapProps}
    >
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <CustomComponent
            {...field}
            field={{ ...fieldData, labelFor, ...wrapProps }}
            ref={null}
          />
        )}
        rules={{
          required: isRequired && (errorMessage || strings.errors.required),
        }}
        {...validationConfig}
      />
    </InputWrapper>
  );
};

export default CustomField;

CustomField.propTypes = {
  fieldData: PropTypes.shape({
    dateType: PropTypes.string,
    id: PropTypes.number,
  }),
  value: PropTypes.string,
  name: PropTypes.string,
  labelFor: PropTypes.string,
  wrapProps: PropTypes.object,
  children: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
};
