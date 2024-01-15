import React from "react";
import PropTypes from "prop-types";
import classnames from "classnames";
import { Controller } from "react-hook-form";
import { useSettings } from "../../../providers/SettingsContext";
import { valueToLowerCase } from "../../../utils/helpers";
import NumberDropdown from "./NumberDropdown";
import { parseDate, sortComponentsByFormat } from "./helpers";

const Dropdown = ({ fieldData, name, control }) => {
  const {
    isRequired,
    defaultValue,
    dateFormat: dateFormatUpper,
    inputs,
    id,
  } = fieldData;
  const {
    fieldsSettings: { date: dateSettings },
  } = useSettings();
  const dateFormat = valueToLowerCase(dateFormatUpper);

  const dateInfo = parseDate(defaultValue, dateFormat, true);

  const getElements = () => {
    const data = [
      { name: "month", startNumber: 1, endNumber: 12 },
      { name: "day", startNumber: 1, endNumber: 31 },
      {
        name: "year",
        endNumber: dateSettings.dateMinYear,
        startNumber: dateSettings.dateMaxYear,
      },
    ];

    const elements = sortComponentsByFormat(
      inputs.map((i, index) => ({ ...i, index, ...data[index] })),
      dateFormat
    );

    console.log({ elements });

    const components = elements.map(({ placeholder, index }) => {
      return (
        <NumberDropdown
          {...data[index]}
          name={`${name}[]`}
          id={`${name}_${index + 1}`}
          selectedValue={dateInfo[data[index].name]}
          placeholder={placeholder}
        />
      );
    });

    return components;
  };

  return <div>{getElements()}</div>;
};

export default Dropdown;
