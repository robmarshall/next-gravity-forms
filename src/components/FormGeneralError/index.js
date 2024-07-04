import React from "react";
import PropTypes from "prop-types";
import { useSettings } from "../../providers/SettingsContext";

const FormGeneralError = ({ errorCode }) => {
  const { strings } = useSettings();
  let errorMessage = "";

  if (errorCode === "formHasError") {
    errorMessage = strings.errors.general;
  }

  if (errorCode === "unknownError") {
    errorMessage = strings.errors.unknownError;
  }

  if (errorCode === "leastOneField") {
    errorMessage = strings.errors.leastOneField;
  }

  if (errorMessage) {
    return (
      <div className="gravityform__error_inform validation_error">
        <p>{errorMessage}</p>
      </div>
    );
  } else {
    return false;
  }
};

FormGeneralError.propTypes = {
  errorCode: PropTypes.string.isRequired,
};

export default FormGeneralError;
