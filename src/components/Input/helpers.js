import { useSettings } from "../../providers/SettingsContext";
import { interpolateString } from "../../utils/helpers";

const getRangeMessage = (message, rangeMinValue, rangeMaxValue) => {
  return interpolateString(message, {
    min: `<strong>${rangeMinValue}</strong>`,
    max: `<strong>${rangeMaxValue}</strong>`,
  });
};

export const getRangeValidation = (
  rangeMinValue,
  rangeMaxValue,
  strings,
  customErrorText
) => {
  // Determine the error message templates
  let minMessage = customErrorText || strings.errors.wrongRangeMin;
  let maxMessage = customErrorText || strings.errors.wrongRangeMax;

  if (rangeMinValue && rangeMaxValue) {
    minMessage = customErrorText || strings.errors.wrongRangeBoth;
    maxMessage = customErrorText || strings.errors.wrongRangeBoth;
  }

  const createErrorObject = (value, message) => {
    if (value !== null)
      return {
        value,
        message: getRangeMessage(message, rangeMinValue, rangeMaxValue),
      };

    return null;
  };

  return {
    min: createErrorObject(rangeMinValue, minMessage),
    max: createErrorObject(rangeMaxValue, maxMessage),
  };
};

export const getRangeInstruction = (rangeMinValue, rangeMaxValue, strings) => {
  if (rangeMinValue && rangeMaxValue) {
    return getRangeMessage(
      strings.errors.wrongRangeBoth,
      rangeMinValue,
      rangeMaxValue
    );
  } else if (rangeMinValue) {
    return getRangeMessage(
      strings.errors.wrongRangeMin,
      rangeMinValue,
      rangeMaxValue
    );
  } else if (rangeMaxValue) {
    return getRangeMessage(
      strings.errors.wrongRangeMax,
      rangeMinValue,
      rangeMaxValue
    );
  }

  return null;
};

/**
 * Custom hook for managing range-related utilities including validation and instruction messages.
 *
 * @param {Object} range - The range object containing minValue and maxValue.
 * @param {number|null} range.minValue - The minimum value of the range.
 * @param {number|null} range.maxValue - The maximum value of the range.
 * @param {boolean|null} error - Error flag indicating the presence of an error, if any.
 * @param {string|null} customErrorText - Custom error message text, if any.
 * @returns {Object} An object containing range validation, instruction message, and a flag to show instruction.
 */
export const useRangeUtilities = ({
  range: { minValue, maxValue },
  isError,
  customErrorText,
}) => {
  const { strings } = useSettings();

  const rangeValidation = getRangeValidation(
    minValue,
    maxValue,
    strings,
    customErrorText
  );

  const rangeInstruction = getRangeInstruction(minValue, maxValue, strings);

  const showInstruction = rangeInstruction && !customErrorText && !isError;

  return { rangeValidation, rangeInstruction, showInstruction };
};
