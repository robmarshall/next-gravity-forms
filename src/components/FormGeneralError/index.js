import React from "react";
import PropTypes from "prop-types";
import { useSettings } from "../../providers/SettingsContext";

const FormGeneralError = ({ errorCode, databaseId }) => {
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
      <div
        className="gform_validation_errors validation_error"
        id={`gform_${databaseId}_validation_container`}
      >
        <p dangerouslySetInnerHTML={{ __html: errorMessage }} />
      </div>
    );
  } else {
    return false;
  }
};

FormGeneralError.propTypes = {
  errorCode: PropTypes.string.isRequired,
  databaseId: PropTypes.number.isRequired,
};

export default FormGeneralError;
