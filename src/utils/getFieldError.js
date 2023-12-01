/**
 * Return corresponding error to the field
 */
import strings from "./strings";
import { valueToLowerCase } from "./helpers";

function getFieldError(props) {
  const type = valueToLowerCase(props.type || props.typeUpper);

  if (props.errorMessage) {
    return props.errorMessage;
  }

  // if field has inputMask return static error
  if (props.inputMaskValue) {
    return strings.errors.pattern[type] || strings.errors.pattern.default;
  }

  return "";
}

export default getFieldError;
