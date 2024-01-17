import { interpolateString } from "../../utils/helpers";

/**
 * Generates error objects for minimum and maximum range validations for number field.
 *
 * @param {number|null} rangeMinValue - The minimum value of the range.
 * @param {number|null} rangeMaxValue - The maximum value of the range.
 * @param {Object} strings - Object containing error message templates.
 * @param {string} customErrorText - Custom error message to override default messages.
 * @returns {Object} An object containing error information for min and max values.
 *                   Structure: { min: { value, message } | null, max: { value, message } | null }.
 *                   Returns an object with `min` and `max` properties set to null if no errors are present.
 */
export const getMinMaxRangeErrors = (
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
        message: interpolateString(message, {
          min: rangeMinValue,
          max: rangeMaxValue,
        }),
      };

    return null;
  };

  return {
    min: createErrorObject(rangeMinValue, minMessage),
    max: createErrorObject(rangeMaxValue, maxMessage),
  };
};
