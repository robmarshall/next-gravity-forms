import React, { useState } from "react";
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

const FieldDropdown = ({ fieldData, name, control, type, presetValue }) => {
  const {
    isRequired,
    dateFormat: dateFormatUpper,
    inputs,
    subLabelPlacement,
    errorMessage,
  } = fieldData;

  const InputField = type === "field" ? NumberInput : NumberDropdown;

  const {
    fieldsSettings: { date: dateSettings },
    strings,
  } = useSettings();
  const dateFormat = valueToLowerCase(dateFormatUpper);

  const defaultValue = getDefaultValue(inputs);

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

  const presetDateObj = dateStringToObj(presetValue, dateFormat);

  const getProperDefault = () => {
    if (presetDateObj && isValidDate(presetDateObj)) return presetDateObj;
    if (isValidDate(defaultValue)) return defaultValue;

    return null;
  };

  return (
    <Controller
      name={name}
      control={control}
      defaultValue={getProperDefault()}
      render={({ field: { onChange, value } }) => {
        return elements.map(
          ({
            id,
            placeholder,
            name: fieldName,
            defaultPlaceholder,
            index,
            name,
            defaultValue,
            ...rest
          }) => {
            return (
              <InputField
                key={id}
                {...rest}
                selectedValue={presetDateObj?.[name] ?? defaultValue}
                name={`${name}[]`}
                id={`${name}_${index + 1}`}
                placeholder={placeholder || defaultPlaceholder}
                subLabelPlacement={subLabelPlacement}
                onChange={(e) =>
                  onChange({ ...value, [fieldName]: e.target.value })
                }
                fieldName={fieldName}
                isRequired={isRequired}
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
};

export default FieldDropdown;
