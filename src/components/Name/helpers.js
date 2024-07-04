export function getNameDefaultValue(fieldInputs, presetValues) {
  const defaultValue = fieldInputs.reduce((accumulatedDefaults, input) => {
    const hasChoices = input.choices?.length > 0;
    const selectedChoice = hasChoices
      ? presetValues?.[input.key] ||
        input.choices.find((choice) => choice.isSelected)?.value
      : null;

    if (selectedChoice) {
      accumulatedDefaults[input.key] = selectedChoice;
    } else if (input.defaultValue) {
      accumulatedDefaults[input.key] =
        presetValues?.[input.key] ?? input.defaultValue;
    }

    return accumulatedDefaults;
  }, {});

  return defaultValue;
}
