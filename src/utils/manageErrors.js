/**
 * Maps errors from a response into a structured object and optionally sets them into a form state.
 *
 * @param {Array} data - Array of error objects from the response.
 * @param {Function} setError - Function to set error messages in a form state.
 *                              This is optional and defaults to a no-operation function.
 * @returns {Object} An object mapping of errors in the format: { 'input_id': { type, message } }.
 */
export const handleGravityFormsValidationErrors = (
  data,
  setError = () => {}
) => {
  const errorsObject = {};

  data?.forEach((error) => {
    const errorKey = `input_${error.id}`;
    const errorValue = { type: "gf_validation", message: error.message };
    errorsObject[errorKey] = errorValue;

    setError(errorKey, errorValue);
  });

  return errorsObject;
};
