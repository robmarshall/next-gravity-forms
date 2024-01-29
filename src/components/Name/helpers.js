export function getDefaultValue(fieldInputs) {
  const defaultValue = fieldInputs.reduce((accumulatedDefaults, input) => {
    const hasChoices = input.choices?.length > 0;
    const selectedChoice = hasChoices
      ? input.choices.find((choice) => choice.isSelected)?.value
      : null;

    if (selectedChoice) {
      accumulatedDefaults[input.key] = selectedChoice;
    } else if (input.defaultValue) {
      accumulatedDefaults[input.key] = input.defaultValue;
    }

    return accumulatedDefaults;
  }, {});

  return defaultValue;
}
