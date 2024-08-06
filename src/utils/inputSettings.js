/**
 * This file manages all of the Gravity Forms input settings.
 * Things such as: Input Mask, Required, Visibility
 */
import classNames from "classnames";
import React from "react";

export function outputDescription(description, wrapId = "", className = "") {
  return (
    <div
      id={`gfield_description_${wrapId?.replace(/^field_/, "")}`}
      className={classNames("gfield_description", className)}
      dangerouslySetInnerHTML={{ __html: description }}
    />
  );
}

export function islabelHidden(label) {
  return label === "HIDDEN" ? true : false;
}
