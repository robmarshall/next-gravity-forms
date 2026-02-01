export const isSelectField = (addressType, fieldKey) => {
  if (!addressType || !fieldKey) return false;

  const selectFieldByAddressType = {
    INTERNATIONAL: "country",
    US: "state",
    CANADA: "state",
  };

  return selectFieldByAddressType[addressType] === fieldKey;
};

export function getAddressDefaultValue(
  fieldInputs,
  presetValues,
  defaultCountry
) {
  return fieldInputs.reduce((accumulatedDefaults, input) => {
    const { key, defaultValue } = input;

    if (presetValues?.[key] !== undefined && presetValues?.[key] !== null) {
      accumulatedDefaults[key] = presetValues[key];
      return accumulatedDefaults;
    }

    if (key === "country" && defaultCountry) {
      accumulatedDefaults[key] = defaultValue || defaultCountry;
      return accumulatedDefaults;
    }

    accumulatedDefaults[key] = defaultValue;
    return accumulatedDefaults;
  }, {});
}
