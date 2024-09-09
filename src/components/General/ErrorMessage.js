import { number, oneOfType, string } from "prop-types";
import React from "react";

const ErrorMessage = ({ errorMessage, id }) => {
  return (
    <div
      aria-live="polite"
      id={`validation_message_${id}`}
      className="gfield_description validation_message gfield_validation_message"
      dangerouslySetInnerHTML={{
        __html: errorMessage,
      }}
    />
  );
};

ErrorMessage.propTypes = {
  errorMessage: string.isRequired,
  id: oneOfType([string, number]),
};

export default ErrorMessage;
