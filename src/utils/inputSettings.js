/**
 * This file manages all of the Gravity Forms input settings.
 * Things such as: Input Mask, Required, Visibility
 */
import { valueToLowerCase } from "./helpers";

export function outputDescription(
  description,
  placement,
  currentPosition,
  errors
) {
  if (description && currentPosition === valueToLowerCase(placement)) {
    return (
      <div
        className={`gravityforms__description gravityforms__description--${valueToLowerCase(
          placement
        )} gfield_description${errors ? " validation_error" : ""}`}
        dangerouslySetInnerHTML={{ __html: description }}
      />
    );
  }
  return null;
}

export function islabelHidden(label) {
  return label === "hidden_label" ? true : false;
}
