import { bool, object, string } from "prop-types";
import React from "react";
import FormGeneralError from "../FormGeneralError";
import FormHeading from "../FormHeading";
import ProgressBar from "../../container/FormBuilder/ProgressBar";
import Confirmation from "../Confirmation";

const FormContent = ({ generalError, form, confirmation, success }) => {
  const showConfirmation = success && confirmation.type === "MESSAGE";

  const { databaseId, pagination, title, description } = form;

  const { hasProgressbarOnConfirmation, type } = pagination || {};

  return (
    <>
      {generalError && (
        <FormGeneralError errorCode={generalError} databaseId={databaseId} />
      )}

      {!success && (title || description) && (
        <FormHeading title={title} description={description} />
      )}

      {showConfirmation &&
        hasProgressbarOnConfirmation &&
        type === "PERCENTAGE" && <ProgressBar isCompleted {...pagination} />}

      {showConfirmation && (
        <Confirmation databaseId={databaseId} confirmation={confirmation} />
      )}
    </>
  );
};

FormContent.propTypes = {
  generalError: string.isRequired,
  form: object.isRequired,
  confirmation: object,
  success: bool.isRequired,
};

export default FormContent;
