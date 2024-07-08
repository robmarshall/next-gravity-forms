// set the default value for the field

import { getDateDefaultValue } from "../components/Date/FieldDropdown";
import { getDatePickerDefaultValue } from "../components/Date/Picker";
import { getNameDefaultValue } from "../components/Name/helpers";
import { getSelectDefaultValue } from "../components/Select/helpers";
import { getSelectionListDefaultValue } from "../components/SelectorList/helpers";
import { valueToLowerCase } from "./helpers";

// there are 2 possible options: presetValue, which has more priority and the defaultValue itself
function getDefaultValues(fields, presetValues) {
  const values = {};

  if (!Array.isArray(fields)) return values;

  fields.forEach(
    ({
      type,
      id,
      inputs,
      defaultValue: defaultVal,
      choices,
      inputName: presetName,
      dateFormat: dateFormatUpper,
      dateType,
    }) => {
      const inputName = `input_${id}`;

      const presetValue = presetValues?.[presetName];

      const defaultValue = presetValue ?? defaultVal;

      // Simplify the logic for fields with similar handling
      const simpleFieldTypes = [
        "DATE",
        "HIDDEN",
        "NUMBER",
        "PHONE",
        "POSTCONTENT",
        "POSTEXCERPT",
        "POSTTITLE",
        "SIGNATURE",
        "TEXTAREA",
        "TEXT",
        "WEBSITE",
        "EMAIL",
      ];

      if (simpleFieldTypes.includes(type) && defaultValue) {
        values[inputName] = defaultValue;
      }

      // Special handling for EMAIL type with inputs
      if (type === "EMAIL" && inputs?.length > 0) {
        const [email, confirmation] = inputs;

        values[inputName] = defaultValue || email.defaultValue;

        if (confirmation)
          values[`${inputName}_2`] = defaultValue || confirmation.defaultValue;
      }

      // Multiselect && select
      if (["MULTISELECT", "SELECT"].includes(type)) {
        values[inputName] = getSelectDefaultValue({
          defaultValue,
          choices,
          isMultiselectField: valueToLowerCase(type) === "multiselect",
        });
      }

      // Common logic for CHECKBOX, and RADIO
      if (
        ["CHECKBOX", "RADIO"].includes(type) &&
        choices?.some((i) => i.isSelected)
      ) {
        values[inputName] = getSelectionListDefaultValue({
          type,
          choices,
          presetValue,
        });
      }

      // Handling for NAME type
      if (type === "NAME" && inputs?.length > 0) {
        values[inputName] = getNameDefaultValue(inputs, presetValues);
      }

      if (type === "DATE") {
        const type = valueToLowerCase(dateType);
        values[inputName] =
          type === "picker"
            ? getDatePickerDefaultValue({
                presetValue,
                defaultValue: defaultVal,
              })
            : getDateDefaultValue({
                dateFormatUpper,
                presetValue,
                inputs,
              });
      }
    }
  );

  return values;
}

export default getDefaultValues;
