import locations from "../../utils/locations";

export const isSelectField = (addressType, fieldKey) => {
  if (!addressType || !fieldKey) return false;

  const selectFieldMap = {
    INTERNATIONAL: "country",
    US: "state",
    CANADA: "state",
  };

  return selectFieldMap[addressType] === fieldKey;
};

export const getAddressDefaultValue = (
  fieldInputs,
  presetValues,
  defaultCountry,
  addressType
) => {
  return fieldInputs.reduce((accumulatedDefaults, input) => {
    const { key, defaultValue } = input;

    if (presetValues?.[key] !== undefined && presetValues?.[key] !== null) {
      accumulatedDefaults[key] = presetValues[key];
      return accumulatedDefaults;
    }

    if (key === "country" && defaultCountry) {
      accumulatedDefaults[key] =
        defaultValue || getLocationNameByCode("INTERNATIONAL", defaultCountry);
      return accumulatedDefaults;
    }

    // TODO add defaultState and defaultProvince support
    if (key === "state") {
      const isValidLocation = findLocation(addressType, "name", defaultValue);

      accumulatedDefaults[key] = isValidLocation ? defaultValue : null;
      return accumulatedDefaults;
    }

    accumulatedDefaults[key] = defaultValue;

    return accumulatedDefaults;
  }, {});
};

export const findLocation = (addressType, key, value) => {
  return locations[addressType]?.find((location) => location[key] === value);
};

export const getLocationNameByCode = (addressType, code) =>
  findLocation(addressType, "code", code)?.name;

export const getLocationCodeByName = (addressType, name) =>
  findLocation(addressType, "name", name)?.code;
