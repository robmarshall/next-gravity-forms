import React from "react";
import PropTypes from "prop-types";
import { useFormContext } from "react-hook-form";
import InputWrapper from "../InputWrapper";
import { useSettings } from "../../providers/SettingsContext";
import { valueToLowerCase } from "../../utils/helpers";
import Picker from "./Picker";

const DateField = ({ defaultValue, fieldData, name, ...wrapProps }) => {
  const { strings } = useSettings();
  const { isRequired, calendarIconType, dateType: dateTypeUpper } = fieldData;

  const dateType = valueToLowerCase(dateTypeUpper);

  const {
    register,
    control,
    formState: { errors },
  } = useFormContext();

  return (
    <InputWrapper
      errors={errors?.[name] || {}}
      inputData={fieldData}
      labelFor={dateType === "picker" && name} // label is needed only for date picker type
      {...wrapProps}
    >
      {dateType === "picker" ? (
        <Picker fieldData={fieldData} name={name} control={control} />
      ) : dateType == "dropdown" ? (
        "dropdown"
      ) : (
        "field"
      )}
    </InputWrapper>
  );
};

export default DateField;

DateField.propTypes = {
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
