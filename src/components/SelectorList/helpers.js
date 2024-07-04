import { valueToLowerCase } from "../../utils/helpers";

// Determines if a field should be checked by default
export const getSelectionListDefaultValue = ({
  type,
  choices,
  presetValue,
}) => {
  const t = valueToLowerCase(type);
  if (t === "checkbox") {
    const presetValues = presetValue?.split(",") || [];
    return choices?.reduce((values, choice) => {
      const { value, isSelected } = choice;
      const selected = presetValues.includes(value) || isSelected;
      if (selected) values.push(value);

      return values;
    }, []);
  } else if (t === "radio") {
    return presetValue
      ? choices.find((i) => i.value == presetValue)?.value
      : choices.find((i) => i.isSelected)?.value;
  }
  return false;
};
