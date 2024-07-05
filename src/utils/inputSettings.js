/**
 * This file manages all of the Gravity Forms input settings.
 * Things such as: Input Mask, Required, Visibility
 */
import React from "react";

export function outputDescription(description, wrapId) {
  return (
    <div
      className="gfield_description"
      id={`gfield_description_${wrapId.replace(/^field_/, "")}`}
      dangerouslySetInnerHTML={{ __html: description }}
    />
  );
}

export function islabelHidden(label) {
  return label === "HIDDEN" ? true : false;
}
