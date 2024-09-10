// set the default value for the field
import { getDateDefaultValue } from "../components/Date/FieldDropdown";
import { getDatePickerDefaultValue } from "../components/Date/Picker";
import { getNameDefaultValue } from "../components/Name/helpers";
import { formatValue as formatCurrencyValue } from "../components/Number/helpers";
import { formatValue } from "../components/Phone";
import { getSelectDefaultValue } from "../components/Select/helpers";
import { getSelectionListDefaultValue } from "../components/SelectorList/helpers";
import { getSettings } from "../providers/SettingsContext";
import { valueToLowerCase } from "./helpers";

// there are 2 possible options: presetValue, which has more priority and the defaultValue itself
function getDefaultValues(fields, presetValues, helpers) {
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
      hasOtherChoice,
      numberFormat,
      phoneFormat,
    }) => {
      const inputName = `input_${id}`;

      const presetValue =
        presetValues?.[presetName] || presetValues?.[inputName];

      const defaultValue = presetValue ?? defaultVal;

      // Simplify the logic for fields with similar handling
      const simpleFieldTypes = [
        "DATE",
        "HIDDEN",
        "POSTCONTENT",
        "POSTEXCERPT",
        "POSTTITLE",
        "SIGNATURE",
        "TEXTAREA",
        "TEXT",
        "WEBSITE",
        "EMAIL",
        "CONSENT",
      ];

      if (simpleFieldTypes.includes(type) && defaultValue) {
        values[inputName] = defaultValue;
      }

      if (type === "PHONE" && defaultValue) {
        if (phoneFormat === "STANDARD") {
          values[inputName] = formatValue(defaultValue);
        } else {
          values[inputName] = defaultValue;
        }
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

        // handle other choice if enabled
        if (type === "RADIO" && hasOtherChoice && !values[inputName]) {
          values[inputName] = "gf_other_choice";
          values[`${inputName}_other`] = presetValue;
        }
      }

      // Handling for NAME type
      if (type === "NAME" && inputs?.length > 0) {
        values[inputName] = getNameDefaultValue(inputs, presetValues);
      }

      if (type === "NUMBER") {
        const format = valueToLowerCase(numberFormat);
        if (format === "currency") {
          // a bit ugly, is that possible to refactor?
          const {
            settings: { currency: globalCUrrency } = {},
            helperFieldsSettings = {},
          } = helpers || {};
          const fieldSettings = getSettings(helperFieldsSettings);
          const { number: { currencies } = {} } = fieldSettings || {};

          values[inputName] = formatCurrencyValue(
            defaultValue,
            format,
            currencies,
            globalCUrrency
          );
        } else {
          values[inputName] = defaultValue;
        }
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
