import { bool, func, object } from "prop-types";
import React from "react";

const VisibilityToggler = ({ onClick, strings, active }) => {
  return (
    <button
      type="button"
      className="gform_show_password gform-theme-button gform-theme-button--simple"
      aria-live="polite"
      aria-label={
        active
          ? strings.password.visibilityToggle.hide
          : strings.password.visibilityToggle.show
      }
      data-label-show={strings.password.visibilityToggle.show}
      data-label-hide={strings.password.visibilityToggle.hide}
      onClick={onClick}
    >
      <span className="dashicons dashicons-hidden" aria-hidden="true"></span>
    </button>
  );
};

VisibilityToggler.propTypes = {
  onClick: func.isRequired,
  active: bool,
  strings: object,
};

export default VisibilityToggler;
