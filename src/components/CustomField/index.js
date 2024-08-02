/**
 * Custom field to be able to override markup if needed
 */
import React from "react";
import PropTypes from "prop-types";
import { useFormContext } from "react-hook-form";
import InputWrapper from "../InputWrapper";
import { Controller } from "react-hook-form";

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

  if (!CustomComponent) return null;

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
        render={({ field }) => <CustomComponent {...field} />}
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
  children: PropTypes.node.isRequired,
};
