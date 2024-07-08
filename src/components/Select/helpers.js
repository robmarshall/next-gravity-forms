export const getSelectDefaultValue = ({
  defaultValue,
  choices,
  isMultiselectField,
}) => {
  let value = defaultValue || choices?.find((i) => i.isSelected)?.value;

  if (isMultiselectField) value = value?.split(",");

  return value;
};
