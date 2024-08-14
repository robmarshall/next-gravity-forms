import React from "react";
import PropTypes from "prop-types";
import { Controller } from "react-hook-form";
import { useSettings } from "../../../providers/SettingsContext";
import NumberDropdown from "./NumberDropdown";
import NumberInput from "./NumberInput";
import { valueToLowerCase, interpolateString } from "../../../utils/helpers";
import {
  sortByFormat,
  isValidDate,
  getDefaultValue,
  dateStringToObj,
} from "./helpers";

// get date default value based on presetValue or defaultValue values
export const getDateDefaultValue = ({
  dateFormatUpper,
  inputs,
  presetValue,
}) => {
  const dateFormat = valueToLowerCase(dateFormatUpper);
  const presetDateObj = dateStringToObj(presetValue, dateFormat);

  if (presetDateObj && isValidDate(presetDateObj)) return presetDateObj;

  const defaultValue = getDefaultValue(inputs);

  if (isValidDate(defaultValue)) return defaultValue;

  return null;
};

const FieldDropdown = ({ fieldData, name, control, type, labelFor }) => {
  const {
    isRequired,
    dateFormat: dateFormatUpper,
    inputs,
    subLabelPlacement,
    errorMessage,
  } = fieldData;

  const InputField = type === "field" ? NumberInput : NumberDropdown;
  const dateFormat = valueToLowerCase(dateFormatUpper);

  const {
    fieldsSettings: { date: dateSettings },
    strings,
  } = useSettings();

  const data = [
    { name: "month", startNumber: 1, endNumber: 12, defaultPlaceholder: "MM" },
    { name: "day", startNumber: 1, endNumber: 31, defaultPlaceholder: "DD" },
    {
      name: "year",
      defaultPlaceholder: "YYYY",
      endNumber:
        type === "field" ? dateSettings.dateMaxYear : dateSettings.dateMinYear,
      startNumber:
        type === "field" ? dateSettings.dateMinYear : dateSettings.dateMaxYear,
    },
  ];

  const elements = sortByFormat(
    inputs.map((i, index) => ({ ...i, index, ...data[index] })),
    dateFormat
  );

  const errorRequired = inputs.map((input) => input.label).join(", ");

  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange, value, ref } }) => {
        const indexWithoutValue = elements.findIndex(
          ({ name: fieldName }) => !value?.[fieldName]
        );
        return elements.map(
          (
            {
              id,
              placeholder,
              name: fieldName,
              defaultPlaceholder,
              index,
              name,
              ...rest
            },
            i
          ) => {
            return (
              <InputField
                key={id}
                {...rest}
                selectedValue={value?.[fieldName]}
                name={`${name}[]`}
                id={`${labelFor}_${index + 1}`}
                placeholder={placeholder || defaultPlaceholder}
                subLabelPlacement={subLabelPlacement}
                onChange={(e) =>
                  onChange({ ...value, [fieldName]: e.target.value })
                }
                fieldName={fieldName}
                isRequired={isRequired}
                ref={i === indexWithoutValue ? ref : undefined}
              />
            );
          }
        );
      }}
      rules={{
        required:
          isRequired &&
          `${errorMessage || strings.errors.required} ${interpolateString(
            strings.errors.date.required,
            { fields: errorRequired }
          )}`,

        validate: (value) =>
          !value || isValidDate(value) ? true : strings.errors.date.invalid,
      }}
    />
  );
};

FieldDropdown.propTypes = {
  fieldData: PropTypes.object.isRequired,
  name: PropTypes.string.isRequired,
  control: PropTypes.object.isRequired,
  type: PropTypes.string.isRequired,
  labelFor: PropTypes.string,
};

export default FieldDropdown;
