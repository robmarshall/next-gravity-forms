import React, { useState } from "react";
import PropTypes from "prop-types";
import { Controller } from "react-hook-form";
import { useSettings } from "../../../providers/SettingsContext";
import NumberDropdown from "./NumberDropdown";
import NumberInput from "./NumberInput";

import { isEmptyObject, valueToLowerCase } from "../../../utils/helpers";
import { sortByFormat, isValidDate, getDefaultValue } from "./helpers";

const FieldDropdown = ({ fieldData, name, control, type }) => {
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

  return (
    <Controller
      name={name}
      control={control}
      defaultValue={defaultValue || null}
      render={({ field: { onChange, value } }) => {
        const [dateValue, setDateValue] = useState(value);

        const handleDropdownChange = (name, selectedValue) => {
          const updatedValue = {
            ...dateValue,
            [name]: selectedValue,
          };

          if (!selectedValue) delete updatedValue[name];

          const selected = isEmptyObject(updatedValue) ? null : updatedValue;

          setDateValue(selected);

          onChange(selected);
        };

        return elements.map(
          ({
            id,
            placeholder,
            name: fieldName,
            defaultPlaceholder,
            index,
            ...rest
          }) => {
            return (
              <InputField
                key={id}
                {...rest}
                name={`${name}[]`}
                id={`${name}_${index + 1}`}
                selectedValue={dateValue && dateValue[fieldName]}
                placeholder={placeholder || defaultPlaceholder}
                subLabelPlacement={subLabelPlacement}
                onChange={(e) =>
                  handleDropdownChange(fieldName, e.target.value)
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
          `${
            errorMessage || strings.errors.required
          } ${strings.errors.date.required.replace("%s", errorRequired)}`,

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
