import React from "react";
import PropTypes from "prop-types";
import { useFormContext } from "react-hook-form";
import InputWrapper from "../InputWrapper";
import { valueToLowerCase } from "../../utils/helpers";
import Picker from "./Picker";
import FieldDropdown from "./FieldDropdown";

const DateField = ({ fieldData, name, labelFor, ...wrapProps }) => {
  const { dateType: dateTypeUpper, id } = fieldData;

  const dateType = valueToLowerCase(dateTypeUpper);

  const {
    control,
    formState: { errors },
  } = useFormContext();

  return (
    <InputWrapper
      errors={errors?.[name] || {}}
      inputData={fieldData}
      labelFor={labelFor}
      ginputClassName={dateType != "picker" && "ginput_complex gform-grid-row"}
      {...wrapProps}
    >
      {dateType === "picker" ? (
        <Picker
          errors={errors?.[name] || {}}
          fieldData={fieldData}
          name={name}
          inputId={id}
          control={control}
          labelFor={labelFor}
        />
      ) : (
        <FieldDropdown
          fieldData={fieldData}
          name={name}
          control={control}
          type={dateType}
          labelFor={labelFor}
        />
      )}
    </InputWrapper>
  );
};

export default DateField;

DateField.propTypes = {
  fieldData: PropTypes.shape({
    dateType: PropTypes.string,
    id: PropTypes.number,
  }),
  value: PropTypes.string,
  name: PropTypes.string,
  labelFor: PropTypes.string,
  wrapProps: PropTypes.object,
};
