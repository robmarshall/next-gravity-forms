export const isSelectField = (addressType, fieldKey) => {
  if (!addressType || !fieldKey) return false;

  const selectFieldByAddressType = {
    INTERNATIONAL: "country",
    US: "state",
    CANADA: "state",
  };

  return selectFieldByAddressType[addressType] === fieldKey;
};
